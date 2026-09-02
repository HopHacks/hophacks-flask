"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import HomeLink from "@/app/components/HomeLink";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post("/api/accounts/reset_password/request", {
        username: email,
        reset_url: `${window.location.protocol}//${window.location.host}/reset_password`,
      });
      setMessage("An email has been sent (if the account exists)!");
    } catch {
      setMessage("Error requesting password reset.");
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <HomeLink />
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <h2
          className="mb-3 text-5xl font-bold text-center text-white"
          style={{ fontVariant: "small-caps" }}
        >
          Reset Password
        </h2>

        <div className="h-5 text-center mb-3 text-white">{message}</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-sketch rounded px-3 py-2 w-full"
          />
          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="px-5 py-4 text-2xl font-bold rounded-2xl bg-[#ffb51f] cursor-pointer text-white shadow-[0_0_40px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(255,181,31,0.5)] max-w-[200px] min-w-[150px] w-[30%]"
              style={{ fontVariant: "small-caps" }}
            >
              Submit
            </button>
            <Link
              href="/register/login"
              className="text-gray-200 transition-all hover:text-gray-400"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
