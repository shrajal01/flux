"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { API_BASE_URL } from "@/lib/api";

export default function RegisterForm() {
  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.detail);
        return;
      }

      alert(
        "Account created successfully!"
      );

      router.push("/");
    } catch (error) {
      console.error(error);

      alert(
        "Registration failed"
      );
    }
  };

  return (
    <div className="mt-10 max-w-md mx-auto">

      <div>
        <label
          htmlFor="username"
          className="block mb-2 text-sm"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          placeholder="Enter username"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />
      </div>

      <div className="mt-6">
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
            setEmail(
              e.target.value
            )
          }
        />
      </div>

      <div className="mt-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />
      </div>

      <div className="mt-6">
        <button
          onClick={handleRegister}
          className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-[1.02] transition-all duration-300"
        >
          Create Account
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300"
          >
            Sign In
          </Link>
        </p>
      </div>

    </div>
  );
}