"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE_URL } from "@/lib/api";
import { saveTokens } from "@/lib/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail);
        return;
      }

      saveTokens(
        data.access_token,
        data.refresh_token
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto">
      <div>
        <label
          htmlFor="email"
          className="block mb-2 text-sm"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter your email address"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="password"
            className="text-sm"
          >
            Password
          </label>

          <a
            href="#"
            className="text-purple-400 text-sm hover:text-purple-300"
          >
            Forgot Password?
          </a>
        </div>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogin}
          className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-[1.02] transition-all duration-300"
        >
          Sign In
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-purple-400 hover:text-purple-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}