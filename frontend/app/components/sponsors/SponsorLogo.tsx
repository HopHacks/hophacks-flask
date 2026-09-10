"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

export default function SponsorLogo({
  name,
  logo,
  href,
}: {
  name: string;
  logo: string;
  href?: string;
}) {
  const [errored, setErrored] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Same race as PersonAvatar: a same-origin 404 can resolve before
    // hydration attaches onError below, silently dropping the fallback.
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setErrored(true);
    }
  }, [logo]);

  const box = (
    <div className="flex h-28 w-full items-center justify-center rounded-2xl border border-white/40 bg-white/90 p-5 shadow-[0_4px_20px_rgba(6,26,64,0.12)] backdrop-blur-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-white/70 group-hover:bg-white group-hover:shadow-[0_8px_28px_rgba(6,26,64,0.2)]">
      {errored ? (
        <span className="text-center text-sm font-semibold text-bg">
          {name}
        </span>
      ) : (
        <Image
          ref={imgRef}
          src={logo}
          alt={name}
          width={160}
          height={80}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => setErrored(true)}
          className="h-full max-h-16 w-full object-contain"
        />
      )}
    </div>
  );

  if (!href) return box;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
    >
      {box}
    </a>
  );
}
