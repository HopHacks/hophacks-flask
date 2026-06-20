import { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const SOCIAL_LINKS: { label: string; href: string; Icon: IconType }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/HopHacks",
    Icon: FaFacebookF,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/hophacks/",
    Icon: FaLinkedinIn,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hophacks/?hl=en",
    Icon: FaInstagram,
  },
];

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
          <a
            href="https://mlh.link/MLH-PureButtons-hackathons"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MLH Pure Buttons"
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hophacks-website.s3.amazonaws.com/images/pure_buttons.png"
              alt="MLH Pure Buttons"
              className="h-auto w-24"
            />
          </a>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-start">
          <a className={linkClass} href="mailto:hophacks@gmail.com">
            hophacks@gmail.com
          </a>
          <span>Malone Hall</span>
          <span>Johns Hopkins University</span>
          <a
            className={linkClass}
            href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"            
            target="_blank"
            rel="noopener noreferrer"
          >
            MLH Code of Conduct
          </a>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-start">
          <span className="text-lg font-semibold text-white">Follow Us</span>
          <nav aria-label="Social links" className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-text-primary/90 transition hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
