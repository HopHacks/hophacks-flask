"use client";

import Image from "next/image";
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

// Solid-color placeholder shown while a photo decodes, so images fade in
// smoothly instead of painting in visibly top-to-bottom on first load.
const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjYTljM2UwIi8+PC9zdmc+";

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
    <Image
      ref={imgRef}
      src={src}
      alt=""
      width={64}
      height={64}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onError={() => setErrored(true)}
      className="h-16 w-16 shrink-0 rounded-full object-cover"
    />
  );
}
