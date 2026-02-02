import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { serialize } from "cookie";
import { NextResponse } from "next/server";

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

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token (just for session storage)
    const token = await user.getIdToken();

    // Create HTTP-only cookie for session management
    const sessionCookie = serialize("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 hour
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
          "Set-Cookie": sessionCookie,
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
      case "auth/invalid-credential":
        errorMessage = "Invalid email or password";
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
