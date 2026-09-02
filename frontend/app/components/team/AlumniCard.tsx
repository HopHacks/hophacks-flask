import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import PersonAvatar from "./PersonAvatar";

const iconLinkClass =
  "text-text-primary/90 transition hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function AlumniCard({
  name,
  role,
  year,
  image,
  github,
  linkedin,
}: {
  name: string;
  role?: string;
  year?: number;
  image?: string;
  github?: string;
  linkedin?: string;
}) {
  const subtitle = [role, year ? String(year) : ""].filter(Boolean).join(", ");

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
      <PersonAvatar name={name} src={image} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-lg text-white">{name}</h3>
        {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
      </div>
      {(linkedin || github) && (
        <div className="flex shrink-0 gap-2.5">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className={iconLinkClass}
            >
              <FaLinkedinIn className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on GitHub`}
              className={iconLinkClass}
            >
              <FaGithub className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
