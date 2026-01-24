"use client";

import { StripedPattern } from "../modules/magicui/StrippesBg";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setError(null);
      const response = await axios.post("/api/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("Login successful:", response.data);

      // ✅ REDIRECT AFTER LOGIN
      router.push("/products");


    } catch (err) {
      console.error("Error logging in:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-16 relative overflow-hidden">
      <StripedPattern 
        direction="right" 
        className="text-slate-500/80 opacity-40"
        width={20}
        height={20}
      />

      <div className="mb-16 relative z-10">
        <h1 className="text-4xl font-bold text-indigo-500">
          Murang Bigas<br />Livelihood
        </h1>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-500 mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-500 text-sm">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-indigo-500">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-indigo-500">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded hover:bg-indigo-700 transition duration-200 font-medium mt-8"
          >
            Submit
          </button>
        </form>
      </div>

      <p className="absolute bottom-8 right-16 text-indigo-500 text-sm z-10">
        BSCS © 2027
      </p>
    </div>
  );
}
