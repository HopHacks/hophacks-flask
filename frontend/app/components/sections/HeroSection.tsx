"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/util/auth";
import HeroTitle from "../hero/HeroTitle";
import SocialLinks from "../hero/SocialLinks";
import GetInvolved from "../hero/GetInvolved";

const HERO_LAYERS = {
  backClouds: "/hero/back-clouds.webp",
  floatingRocks: "/hero/layer2-floating-rocks.webp",
  grass: "/hero/layer3-grass.webp",
  gilman: "/hero/layer4-gilman.webp",
  trees: "/hero/layer5-trees.webp",
  bluebird: "/hero/layer6-bluebird.webp",
  frontLeftCloud: "/hero/front-left-cloud.png",
  frontRightCloud: "/hero/front-right-cloud.png",
} as const;

function SceneLayer({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover-bottom"
      />
    </div>
  );
}

const CTA_CLS =
  "relative z-50 rounded-2xl bg-recap-gold px-6 py-3 text-base font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.35)] transition-shadow duration-300 hover:shadow-[0_0_45px_rgba(255,181,31,0.6)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function HeroSection() {
  // null while the session check is in flight — render no CTA yet so a
  // logged-in user never sees a "Register Now" flash.
  const { isLoggedIn } = useAuth();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [cloudsParted, setCloudsParted] = useState(false);

  useEffect(() => {
    function handleLoad() {
      setPageLoaded(true);
    }

    if (document.readyState === "complete") {
      handleLoad();
      return;
    }

    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!pageLoaded) return;

    const timer = window.setTimeout(() => setCloudsParted(true), 1200);
    return () => window.clearTimeout(timer);
  }, [pageLoaded]);

  return (
    <div className="relative h-full min-h-screen w-full overflow-hidden bg-bg">
      <SocialLinks />

      {/* The whole scene sits slightly below the viewport top so the clock
          tower clears the social icons; the island tip crops by the same
          amount at the bottom. */}
      <div className="absolute inset-x-0 -bottom-[6vh] top-[6vh]">
        <SceneLayer
          src={HERO_LAYERS.backClouds}
          alt=""
          priority
          className="z-[1]"
        />

        <div className="absolute inset-0 z-[2] animate-hero-float motion-reduce:animate-none">
          <SceneLayer src={HERO_LAYERS.floatingRocks} alt="" priority />
          <SceneLayer src={HERO_LAYERS.grass} alt="" priority />
          <SceneLayer src={HERO_LAYERS.gilman} alt="" priority />
          <SceneLayer src={HERO_LAYERS.trees} alt="" priority />

          <div className="absolute inset-x-0 bottom-[clamp(9rem,26vh,17rem)] z-10 flex flex-col items-center gap-3 px-6 text-center font-sans">
            <HeroTitle />
            {isLoggedIn ? (
              <>
                <p className="text-base font-normal text-white/90 sm:text-lg">
                  Your application is in! You&apos;ll hear back from us shortly.
                </p>
                <Link href="/profile" className={CTA_CLS}>
                  My Profile
                </Link>
              </>
            ) : isLoggedIn === false ? (
              <>
                <p className="text-base font-normal text-white/90 sm:text-lg">
                  September 18&ndash;20, 2026 &middot; Baltimore, MD
                </p>
                <Link href="/register/signup" className={CTA_CLS}>
                  Apply Now
                </Link>
              </>
            ) : null}
            <GetInvolved />
          </div>

          <SceneLayer src={HERO_LAYERS.bluebird} alt="" priority />
        </div>

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-40 transition-transform duration-hero-cloud ease-hero-cloud will-change-transform motion-reduce:transition-none ${
            cloudsParted
              ? "-translate-x-full motion-reduce:opacity-0"
              : "translate-x-0"
          }`}
        >
          {/* Scale lives on the image, not the sliding wrapper, so it isn't
            animated by the wrapper's transform transition; the origins keep
            the enlarged clouds fully off-screen once parted. */}
          <Image
            src={HERO_LAYERS.frontLeftCloud}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover-bottom scale-125 origin-bottom-right"
          />
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-40 transition-transform duration-hero-cloud ease-hero-cloud will-change-transform motion-reduce:transition-none ${
            cloudsParted
              ? "translate-x-full motion-reduce:opacity-0"
              : "translate-x-0"
          }`}
        >
          <Image
            src={HERO_LAYERS.frontRightCloud}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover-bottom scale-125 origin-bottom-left"
          />
        </div>
      </div>
    </div>
  );
}
