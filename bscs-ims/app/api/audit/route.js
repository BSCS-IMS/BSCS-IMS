export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
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
   GET - fetch audit logs
========================== */
export async function GET(req) {
  try {
    const session = await getSession(req);
    if (!session) return unauthorized();

    // Fetch all audit logs with ordering (filtering done on frontend)
    const q = query(
      collection(db, "auditLogs"), 
      orderBy("timestamp", "desc")
    );
    
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map((d) => {
      const data = d.data();
      return { id: d.id, ...data };
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /audit error:", error);
    return NextResponse.json({ message: "Failed to fetch audit logs", error: error.message }, { status: 500 });
  }
}