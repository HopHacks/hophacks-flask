import Image from "next/image";
import Link from "next/link";

/* Brand mark pinned to the top-left of pages outside the homepage, linking
   back to it. The parent page container must be `relative`. */
export default function HomeLink() {
  return (
    <Link
      href="/"
      className="absolute left-4 top-4 z-50 flex items-center gap-2.5 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 sm:left-8 sm:top-6"
    >
      <Image
        src="/images/hophacks-logo.png"
        alt=""
        width={242}
        height={177}
        className="h-8 w-auto"
      />
      <span className="font-display text-2xl font-normal tracking-wide text-white">
        HopHacks
      </span>
    </Link>
  );
}
