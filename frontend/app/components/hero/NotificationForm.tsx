"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "success" | "error";

export default function NotificationForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("success");
    setMessage("You're on the list. We'll email you when applications open.");
    setEmail("");
  }

  return (
    <div className="relative z-50 flex w-full max-w-lg flex-col items-center gap-3 font-sans">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
      >
        <label htmlFor="notify-email" className="sr-only">
          Email address
        </label>
        <input
          id="notify-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Your Email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage("");
            }
          }}
          className="input-sketch min-w-0 flex-1 px-4 py-2.5 text-base sm:max-w-xs"
        />
        <button
          type="submit"
          className="btn-sketch shrink-0 px-6 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
        >
          Get Notified
        </button>
      </form>

      {message ? (
        <p
          role="status"
          className={`text-sm ${status === "error" ? "text-red-100" : "text-white/90"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
