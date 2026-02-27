export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { admin } from "@/app/lib/firebaseAdmin";
import { logAudit } from '@/app/lib/audit'

// Helper: verify session and return decoded token
async function getSession(req) {
  const token = req.cookies.get("session")?.value;
  if (!token) return null;

  try {
    return await admin.auth().verifySessionCookie(token, true);
  } catch (err) {
    console.error("Invalid session cookie:", err.message);
    return null;
  }
}

// Helper: standard unauthorized response
function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

/* ==========================
   GET - fetch announcements
========================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Single announcement fetch by ID
    if (id) {
      const docRef = doc(db, "announcements", id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
      }

      return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
    }

    // Get filter params
    const search = searchParams.get("search")?.toLowerCase() || "";
    const sort = searchParams.get("sort") || "";
    const status = searchParams.get("status") || "";
    const dateFrom = searchParams.get("dateFrom") || "";
    const dateTo = searchParams.get("dateTo") || "";

    // Fetch all announcements
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    let announcements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Apply search filter (by title)
    if (search) {
      announcements = announcements.filter((a) =>
        a.title?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (status === "published") {
      announcements = announcements.filter((a) => a.isPublished === true);
    } else if (status === "draft") {
      announcements = announcements.filter((a) => a.isPublished === false);
    }

    // Apply date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      announcements = announcements.filter((a) => {
        if (!a.createdAt) return false;
        const createdDate = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt.seconds * 1000);
        return createdDate >= fromDate;
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      announcements = announcements.filter((a) => {
        if (!a.createdAt) return false;
        const createdDate = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt.seconds * 1000);
        return createdDate <= toDate;
      });
    }

    // Apply sort (by title)
    if (sort === "asc") {
      announcements.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sort === "desc") {
      announcements.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }
    // Default sort is by createdAt desc (already from Firestore query)

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("GET /announcements error:", error);
    return NextResponse.json({ message: "Failed to fetch announcements" }, { status: 500 });
  }
}

/* ==========================
   POST - create announcement
========================== */
export async function POST(req) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { title, content, isPublished = false, publishAt } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const announcementData = {
      title: title.trim(),
      content: content.trim(),
      isPublished,
      publishAt: isPublished ? serverTimestamp() : publishAt ? new Date(publishAt) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByEmail: session.email,
      createdByUid: session.uid,
    }

    const docRef = await addDoc(collection(db, 'announcements'), announcementData)

    await logAudit({
      action: 'CREATE',
      entityType: 'announcement',
      entityId: docRef.id,
      newData: announcementData,
      performedById: session.uid

    })


    return NextResponse.json({ message: "Created successfully", id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("POST /announcements error:", error);
    return NextResponse.json({ message: "Failed to create announcement" }, { status: 500 });
  }
}

/* ==========================
   PUT - update announcement
========================== */
export async function PUT(req) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const body = await req.json();
    const { id, title, content, isPublished, publishAt } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    // Check announcement exists
    const docRef = doc(db, "announcements", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
    }

    const existing = snapshot.data();

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      isPublished,
      publishAt: isPublished ? existing.publishAt ?? serverTimestamp() : publishAt ? new Date(publishAt) : null,
      updatedAt: serverTimestamp(),
      updatedByEmail: session.email,
    }

    await updateDoc(docRef, updateData)

    await logAudit({
      action: 'UPDATE',
      entityType: 'announcement',
      entityId: id,
      oldData: existing,
      newData: updateData,
      performedById: session.uid
    })

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("PUT /announcements error:", error);
    return NextResponse.json({ message: "Failed to update announcement" }, { status: 500 });
  }
}

/* ==========================
   DELETE - remove announcement
========================== */
export async function DELETE(req) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const docRef = doc(db, "announcements", id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
    }

    const deletedData = snapshot.data()  // ✅ capture before deleting

    await deleteDoc(docRef)

    await logAudit({
      action: 'DELETE',
      entityType: 'announcement',
      entityId: id,
      oldData: deletedData,
      newData: null,
      performedById: session.uid
    })

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /announcements error:", error);
    return NextResponse.json({ message: "Failed to delete announcement" }, { status: 500 });
  }
}