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

    if (id) {
      const docRef = doc(db, "announcements", id);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        return NextResponse.json({ message: "Announcement not found" }, { status: 404 });
      }

      return NextResponse.json({ id: snapshot.id, ...snapshot.data() });
    }

    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const announcements = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

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

    const docRef = await addDoc(collection(db, "announcements"), {
      title: title.trim(),
      content: content.trim(),
      isPublished,
      publishAt: isPublished
        ? serverTimestamp()
        : publishAt
        ? new Date(publishAt)
        : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdByEmail: session.email,
      createdByUid: session.uid,
    });

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

    await updateDoc(docRef, {
      title: title.trim(),
      content: content.trim(),
      isPublished,
      publishAt: isPublished
        ? existing.publishAt ?? serverTimestamp() // preserve original publish time if already published
        : publishAt
        ? new Date(publishAt)
        : null,
      updatedAt: serverTimestamp(),
      updatedByEmail: session.email,
    });

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

    await deleteDoc(docRef);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /announcements error:", error);
    return NextResponse.json({ message: "Failed to delete announcement" }, { status: 500 });
  }
}