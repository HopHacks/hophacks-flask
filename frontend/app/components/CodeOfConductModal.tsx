"use client";

import { useRef } from "react";

const REPORTING_LINES = [
  { region: "North America", phone: "+1 409 202 6060" },
  { region: "Canada", phone: "+1 343 453 4532" },
  { region: "UK", phone: "+44 800 808 5675" },
  { region: "Europe", phone: "+44 333 038 5995" },
  { region: "Asia-Pacific", phone: "+91 000 80004 02492" },
  { region: "India", phone: "000 80004 02492" },
] as const;

const SPECIAL_CONTACTS = [
  { name: "Mary Siebert", phone: "+1 (516) 362-1835", email: "mary@mlh.io" },
  { name: "Swift", phone: "+1 (347) 220-8667", email: "swift@mlh.io" },
] as const;

const headingClass = "font-display text-xl tracking-wide text-white";
const externalLinkClass =
  "underline transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

export default function CodeOfConductModal({
  triggerClassName = "",
}: {
  triggerClassName?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          dialogRef.current?.showModal();
          document.body.classList.add("overflow-hidden");
        }}
      >
        MLH Code of Conduct
      </button>

      {/* Native <dialog> gives Escape handling, focus containment, and focus
          restoration to the trigger for free. The panel is an inner wrapper so
          a click landing on the dialog element itself can only be a backdrop
          click. */}
      <dialog
        ref={dialogRef}
        aria-labelledby="coc-title"
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-2xl border border-white/20 bg-bg-light text-left text-text-primary shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm open:animate-pop motion-reduce:animate-none"
        onClose={() => document.body.classList.remove("overflow-hidden")}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6 sm:px-8">
            <h2
              id="coc-title"
              className="font-display text-3xl font-normal tracking-wide text-white"
            >
              MLH Code of Conduct
            </h2>
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full p-1 text-2xl leading-none text-text-primary transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto px-6 pb-6 text-sm leading-relaxed sm:px-8 sm:text-base">
            <p className="font-semibold text-white">
              TL;DR. Be respectful. Harassment and abuse are never tolerated. If
              you are in a situation that makes you uncomfortable at an MLH
              Member Event, if the event itself creates an unsafe or
              inappropriate environment, or if interacting with an MLH
              representative or event organizer makes you uncomfortable, please
              report it using the procedures included in this document.
            </p>
            <p>
              Major League Hacking (MLH) stands for inclusivity. We believe that
              every single person has the right to hack in a safe and welcoming
              environment.
            </p>
            <p>
              Harassment includes but is not limited to offensive verbal or
              written comments related to gender, age, sexual orientation,
              disability, physical appearance, body size, race, religion, social
              class, economic status, and veteran status. Additional cases of
              harassment include but are not limited to sharing sexual images,
              violent depictions, vulgar language, deliberate intimidation,
              stalking, following, brigading, doxxing, harassing photography or
              recording, sustained disruption of talks or other events,
              inappropriate physical contact, and unwelcome sexual attention.
            </p>
            <p>
              In particular, attendees should not use sexualized images,
              activities, or other material both in their hacks and during the
              event. Booth staff (including volunteers) should not use
              sexualized clothing/uniforms/costumes or otherwise create a
              sexualized environment.
            </p>
            <p>
              If what you&rsquo;re doing is making someone feel uncomfortable,
              that counts as harassment and is enough reason to stop doing it.
              Participants asked to stop any harassing behavior are expected to
              comply immediately.
            </p>
            <p>
              Sponsors, judges, mentors, volunteers, organizers, MLH staff, and
              anyone else participating in the event are also subject to the
              anti-harassment policy.
            </p>
            <p>
              If a participant engages in harassing behavior, MLH may take any
              action it deems appropriate, including warning the offender or
              expulsion from the event with no eligibility for reimbursement or
              refund of any type.
            </p>
            <p>
              If you are being harassed, notice that someone else is being
              harassed, or have any other concerns, please contact MLH using the
              reporting procedures defined below.
            </p>
            <p>
              MLH representatives can help participants contact campus security
              or local law enforcement, provide escorts, or otherwise assist
              those experiencing harassment to feel safe for the duration of the
              event. We value your attendance.
            </p>
            <p>
              We expect participants to follow these rules at all hackathon
              venues, hackathon-related social events, hackathon-supplied
              transportation, and online interactions related to the event.
            </p>

            <h3 className={headingClass}>Reporting Procedures</h3>
            <p>
              If you feel uncomfortable or think there may be a potential
              violation of the code of conduct, please report it immediately
              using one of the following methods. All reporters have the right
              to remain anonymous. By sending information to the general
              reporting line, your report will go to our incident response team
              members.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {REPORTING_LINES.map(({ region, phone }) => (
                <li key={region}>
                  {region} General Reporting &mdash; {phone},{" "}
                  <a
                    href="mailto:incidents@mlh.io"
                    className={externalLinkClass}
                  >
                    incidents@mlh.io
                  </a>
                </li>
              ))}
            </ul>

            <h3 className={headingClass}>Special Incidents</h3>
            <p>
              If you are uncomfortable reporting your situation to one or more
              of these people or need to contact any of them directly in case of
              emergency, direct contact details are listed below.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {SPECIAL_CONTACTS.map(({ name, phone, email }) => (
                <li key={name}>
                  {name} &mdash; {phone},{" "}
                  <a href={`mailto:${email}`} className={externalLinkClass}>
                    {email}
                  </a>
                </li>
              ))}
            </ul>

            <p>
              MLH reserves the right to revise, make exceptions to, or otherwise
              amend these policies in whole or in part. If you have any
              questions regarding these policies, please contact MLH by e-mail
              at{" "}
              <a href="mailto:incidents@mlh.io" className={externalLinkClass}>
                incidents@mlh.io
              </a>
              .
            </p>
            <p className="border-t border-white/20 pt-4 text-xs sm:text-sm">
              Last updated April 16th, 2026 &middot;{" "}
              <a
                href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                target="_blank"
                rel="noopener noreferrer"
                className={externalLinkClass}
              >
                View the canonical document on GitHub
              </a>
            </p>
          </div>
        </div>
      </dialog>
    </>
  );
}
