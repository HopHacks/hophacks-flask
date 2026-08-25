"use client";

import { useEffect, useRef, useState } from "react";

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
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Same-origin 404s can resolve before hydration attaches onError below,
    // so the failure event fires on a listener-less DOM node and is lost.
    // Catch that case by checking the already-settled image on mount too.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setErrored(true);
    }
  }, [src]);

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
      ref={imgRef}
      src={src}
      alt=""
      onError={() => setErrored(true)}
      className="h-16 w-16 shrink-0 rounded-full object-cover"
    />
  );
}
