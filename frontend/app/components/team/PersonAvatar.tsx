"use client";

import { useState } from "react";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function PersonAvatar({
  name,
  src,
}: {
  name: string;
  src?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        aria-hidden="true"
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 font-display text-lg text-white"
      >
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote S3 photos, not in next.config image domains
    <img
      src={src}
      alt=""
      onError={() => setErrored(true)}
      className="h-16 w-16 shrink-0 rounded-full object-cover"
    />
  );
}
