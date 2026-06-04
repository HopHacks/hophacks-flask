import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { SiLinktree } from "react-icons/si";

const SOCIAL_LINKS = [
  {
    label: "HopHacks Linktree",
    href: "https://linktr.ee/hophacks",
    Icon: SiLinktree,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/hophacks/?hl=en",
    Icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/hophacks/",
    Icon: FaLinkedinIn,
  },
] as const;

export default function SocialLinks() {
  return (
    <nav
      aria-label="Social links"
      className="absolute right-4 top-4 z-50 flex items-center gap-4 sm:right-8 sm:top-8"
    >
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
  );
}
