import Image from "next/image";
import CodeOfConductModal from "./CodeOfConductModal";
import SocialIconLinks from "./SocialIconLinks";

const linkClass =
  "transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/20 bg-bg-light text-text-primary">
      <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-12 text-center sm:grid-cols-3 sm:text-left">
        <div className="flex flex-col items-center gap-4 sm:items-start">
          <span className="font-display text-3xl font-normal tracking-wide text-white">
            HopHacks
          </span>
          <Image
            src="/images/hophacks-logo.png"
            alt="HopHacks logo"
            width={242}
            height={177}
            className="h-auto w-24"
          />
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-start">
          <a className={linkClass} href="mailto:hophacks@gmail.com">
            hophacks@gmail.com
          </a>
          <span>Malone Hall</span>
          <span>Johns Hopkins University</span>
          <CodeOfConductModal triggerClassName={linkClass} />
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span className="text-lg font-semibold text-white">Follow Us</span>
          <SocialIconLinks />
        </div>
      </div>
    </footer>
  );
}
