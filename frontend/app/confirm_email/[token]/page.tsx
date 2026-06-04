"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ConfirmEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState("Confirming Email...");
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    axios
      .post("/api/accounts/confirm_email", { confirm_token: token })
      .then(() => {
        setMessage(
          "Email confirmed! You have applied to this event successfully!",
        );
      })
      .catch(() => {
        setMessage("Maybe the link is old? Try logging in.");
      });
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col items-center rounded-2xl p-10 m-5 gap-6"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <p
          className="font-bold text-white text-2xl text-center"
          style={{ fontVariant: "small-caps" }}
        >
          {message}
        </p>
        <Link
          href="/register/login"
          className="px-5 py-3 text-xl font-bold rounded-2xl bg-[#ffb51f] text-white shadow-[0_0_40px_rgba(255,181,31,0.3)] hover:shadow-[0_0_50px_rgba(255,181,31,0.5)] transition-shadow duration-300"
          style={{ fontVariant: "small-caps" }}
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
