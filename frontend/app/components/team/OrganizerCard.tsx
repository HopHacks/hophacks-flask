import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import PersonAvatar from "./PersonAvatar";
import { nameToPhotoUrl } from "@/app/team/teamHelpers";

const iconLinkClass =
  "text-text-primary/90 transition hover:scale-110 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function OrganizerCard({
  name,
  role,
  hometown,
  major,
  year,
  funFact,
  github,
  linkedin,
  photo,
}: {
  name: string;
  role: string;
  hometown?: string;
  major?: string;
  year?: string;
  funFact?: string;
  github?: string;
  linkedin?: string;
  photo?: string;
}) {
  const majorYear = [major, year].filter(Boolean).join(", ");

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <PersonAvatar name={name} src={photo ?? nameToPhotoUrl(name)} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg text-white">{name}</h3>
          <p className="text-sm text-white/80">{role}</p>
        </div>
        {(linkedin || github) && (
          <div className="flex shrink-0 gap-2.5 pt-1">
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

      {(hometown || majorYear) && (
        <p className="text-sm text-white/70">
          {[hometown, majorYear].filter(Boolean).join(" · ")}
        </p>
      )}
      {funFact && (
        <p className="text-sm italic leading-relaxed text-white/70">
          &ldquo;{funFact}&rdquo;
        </p>
      )}
    </div>
  );
}
