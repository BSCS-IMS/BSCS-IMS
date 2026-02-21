export const runtime = "nodejs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { admin } from "@/app/lib/firebaseAdmin";


export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sign in with Firebase client SDK
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get short-lived ID token from Firebase client SDK
    const idToken = await user.getIdToken();

    // Create long-lived session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set HTTP-only cookie for browser
    const cookie = serialize("session", sessionCookie, {
      httpOnly: true,
      path: "/",
      maxAge: expiresIn / 1000, // in seconds
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return new NextResponse(
      JSON.stringify({
        message: "Login successful",
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);

    let errorMessage = "Login failed";

    switch (error.code) {
      case "auth/invalid-email":
        errorMessage = "Invalid email address";
        break;
      case "auth/user-disabled":
        errorMessage = "This account has been disabled";
        break;
      case "auth/user-not-found":
        errorMessage = "No account found with this email";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Please try again later";
        break;
      default:
        errorMessage = error.message || "An error occurred during login";
    }

    return NextResponse.json({ message: errorMessage }, { status: 401 });
  }
}