import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sign in with Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get ID token
    const token = await user.getIdToken();

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      token: token
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    setError(err.response?.data?.message || 'Login failed');

    // Handle specific Firebase errors
    let errorMessage = 'Login failed';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      default:
        errorMessage = error.message || 'An error occurred during login';
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: 401 }
    );
  }
}