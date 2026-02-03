import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from '@/app/lib/firebase';

export async function POST(request) {
  try {
    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== 'string') {
      throw new Error("Location name must be a non-empty string");
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error("Location name cannot be empty");
    }

    // Normalize to title case
    const normalizedName = trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1).toLowerCase();

    // Check uniqueness
    const q = query(collection(db, "locations"), where("name", "==", normalizedName));
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error(`Location "${normalizedName}" already exists`);
    }

    // Add new location
    const docRef = await addDoc(collection(db, "locations"), {
      name: normalizedName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return new Response(JSON.stringify({ id: docRef.id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
