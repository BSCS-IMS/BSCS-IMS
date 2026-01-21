// before modifying this file, let me know for what reason it is

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Debug logging
console.log('🔥 Firebase Initialization Check:')
console.log('API Key:', firebaseConfig.apiKey ? '✓ Set' : '✗ MISSING')
console.log('Auth Domain:', firebaseConfig.authDomain ? '✓ Set' : '✗ MISSING')
console.log('Project ID:', firebaseConfig.projectId ? '✓ Set' : '✗ MISSING')

const missingFields = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingFields)
}

let app
let db
let auth
let analytics

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  db = getFirestore(app)
  auth = getAuth(app)

  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app)
        console.log('✅ Firebase Analytics initialized')
      }
    })
  }

  console.log('✅ Firebase initialized successfully')
} catch (error) {
  console.error('❌ Firebase initialization failed:', error)
  throw error
}

export { app, db, auth, analytics }
