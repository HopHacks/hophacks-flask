"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/util/auth";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push("/profile");
  }, [isLoggedIn, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/profile");
    } catch {
      setAttempted(true);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <h2
          className="mb-3 text-5xl font-bold text-center text-white"
          style={{ fontVariant: "small-caps" }}
        >
          Login
        </h2>

        <div className="h-5 mb-2 text-center text-red-400">
          {attempted && <p>Incorrect Username or Password</p>}
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
            className="input-sketch rounded px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-sketch rounded px-3 py-2 w-full"
          />
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="px-5 py-4 text-2xl font-bold rounded-2xl bg-[#ffb51f] cursor-pointer text-white shadow-[0_0_40px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(255,181,31,0.5)] max-w-[200px] min-w-[150px] w-[30%] mt-5 mb-10"
              style={{ fontVariant: "small-caps" }}
            >
              Login
            </button>
            <div className="flex justify-end w-full">
              <Link
                href="/register/resetpassword"
                className="text-gray-200 transition-all hover:text-gray-400"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
