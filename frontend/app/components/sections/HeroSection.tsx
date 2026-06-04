"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import NotificationForm from "../hero/NotificationForm";
import HeroTitle from "../hero/HeroTitle";
import SocialLinks from "../hero/SocialLinks";

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

export default function HeroSection() {
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

      <SceneLayer src={HERO_LAYERS.backClouds} alt="" priority className="z-[1]" />

      <div className="absolute inset-0 z-[2] animate-hero-float motion-reduce:animate-none">
        <SceneLayer src={HERO_LAYERS.floatingRocks} alt="" priority />
        <SceneLayer src={HERO_LAYERS.grass} alt="" priority />
        <SceneLayer src={HERO_LAYERS.gilman} alt="" priority />
        <SceneLayer src={HERO_LAYERS.trees} alt="" priority />

        <div className="absolute inset-x-0 bottom-[clamp(9rem,26vh,17rem)] z-10 flex flex-col items-center gap-3 px-6 text-center font-sans">
          <HeroTitle />
          <p className="text-base font-normal text-white/90 sm:text-lg">
            Get notified when applications open.
          </p>
          <NotificationForm />
        </div>

        <SceneLayer src={HERO_LAYERS.bluebird} alt="" priority />
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-40 transition-transform duration-hero-cloud ease-hero-cloud will-change-transform motion-reduce:transition-none ${
          cloudsParted ? "-translate-x-full motion-reduce:opacity-0" : "translate-x-0"
        }`}
      >
        <Image
          src={HERO_LAYERS.frontLeftCloud}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover-bottom"
        />
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-40 transition-transform duration-hero-cloud ease-hero-cloud will-change-transform motion-reduce:transition-none ${
          cloudsParted ? "translate-x-full motion-reduce:opacity-0" : "translate-x-0"
        }`}
      >
        <Image
          src={HERO_LAYERS.frontRightCloud}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover-bottom"
        />
      </div>
    </div>
  );
}
