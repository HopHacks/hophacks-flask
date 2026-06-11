"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const PASSWORD_RE =
  /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!PASSWORD_RE.test(password)) {
      setIsError(true);
      setMessage(
        "New password must be 7–25 characters long and include a digit and a special character.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post("/api/accounts/reset_password", {
        reset_token: token,
        password,
      });
      setIsError(false);
      setMessage("Password reset successfully!");
    } catch {
      setIsError(true);
      setMessage(
        "Unable to reset password. It may have already been changed.",
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <h2
          className="font-bold text-white text-4xl text-center mb-4"
          style={{ fontVariant: "small-caps" }}
        >
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-sketch rounded px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-sketch rounded px-3 py-2 w-full"
          />

          {message && (
            <p
              className={`text-center text-sm ${isError ? "text-red-400" : "text-green-400"}`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-col items-center gap-4">
            <button
              type="submit"
              className="px-5 py-4 text-2xl font-bold rounded-2xl bg-[#ffb51f] cursor-pointer text-white shadow-[0_0_40px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(255,181,31,0.5)] max-w-[200px] min-w-[150px] w-[30%]"
              style={{ fontVariant: "small-caps" }}
            >
              Submit
            </button>
            {!isError && (
              <Link
                href="/register/login"
                className="text-gray-200 transition-all hover:text-gray-400"
              >
                Back to Sign In
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
