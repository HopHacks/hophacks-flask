"use client";

import { useMemo, useState } from "react";
import HomeLink from "@/app/components/HomeLink";
import OrganizerCard from "@/app/components/team/OrganizerCard";
import AlumniCard from "@/app/components/team/AlumniCard";
import { TEAMS, TeamMember } from "./data/teams";
import { ALUMNI } from "./data/alumni";
import { filterByNameOrRole, sortByYear } from "./teamHelpers";

const SUBTEAM_NAMES = ["All", ...TEAMS.map((t) => t.name)];

// Flattens every subteam into one list for the "All" tab, keeping faculty
// advisors at the end (matches the old site's ordering).
function buildAllMembers(): TeamMember[] {
  const regular: TeamMember[] = [];
  const faculty: TeamMember[] = [];
  for (const team of TEAMS) {
    for (const member of team.members) {
      const withRole = { ...member, role: member.role ?? team.defaultRole };
      (withRole.role === "Faculty Advisor" ? faculty : regular).push(withRole);
    }
  }
  return [...regular, ...faculty];
}

const ALL_MEMBERS = buildAllMembers();

const toggleClass = (active: boolean) =>
  `rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
    active ? "bg-recap-gold text-white" : "text-white/80 hover:bg-white/10"
  }`;

const tabClass = (active: boolean) =>
  `shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 ${
    active
      ? "border-recap-gold bg-recap-gold text-white"
      : "border-white/30 text-white/80 hover:bg-white/10"
  }`;

export default function TeamPage() {
  const [view, setView] = useState<"organizers" | "alumni">("organizers");
  const [activeTeam, setActiveTeam] = useState("All");
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const currentMembers = useMemo(() => {
    if (activeTeam === "All") return ALL_MEMBERS;
    const team = TEAMS.find((t) => t.name === activeTeam);
    if (!team) return [];
    return team.members.map((m) => ({
      ...m,
      role: m.role ?? team.defaultRole,
    }));
  }, [activeTeam]);

  const filteredMembers = useMemo(
    () => filterByNameOrRole(currentMembers, query),
    [currentMembers, query],
  );

  const filteredAlumni = useMemo(
    () => sortByYear(filterByNameOrRole(ALUMNI, query), sortOrder),
    [query, sortOrder],
  );

  const noResults =
    (view === "organizers" && filteredMembers.length === 0) ||
    (view === "alumni" && filteredAlumni.length === 0);

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center px-4 pb-10 pt-20 sm:pb-14 sm:pt-24">
      <HomeLink />

      {/* leading-tight (not leading-none) so the display font's ascenders
          don't spill upward into the HomeLink mark above. */}
      <h1 className="mb-2 text-center font-display text-[clamp(2.5rem,7vw,4rem)] font-normal leading-tight tracking-wide text-white/95 text-shadow-hero-title">
        Our Team
      </h1>
      <p className="mb-8 text-center text-white/90">
        Meet the people behind HopHacks
      </p>

      <div className="mb-6 inline-flex rounded-2xl border border-white/30 p-1">
        <button
          type="button"
          onClick={() => setView("organizers")}
          className={toggleClass(view === "organizers")}
        >
          Organizers
        </button>
        <button
          type="button"
          onClick={() => setView("alumni")}
          className={toggleClass(view === "alumni")}
        >
          Alumni
        </button>
      </div>

      <div className="mb-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or role…"
          className="input-sketch w-full rounded-lg px-4 py-2.5 text-base"
        />
        {view === "alumni" && (
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="input-sketch rounded-lg px-4 py-2.5 text-base sm:w-56"
          >
            <option value="desc">Year: newest first</option>
            <option value="asc">Year: oldest first</option>
          </select>
        )}
      </div>

      {view === "organizers" && (
        <div className="mb-8 flex w-full max-w-3xl gap-2 overflow-x-auto px-1 pb-1">
          {SUBTEAM_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setActiveTeam(name)}
              className={tabClass(activeTeam === name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <div className="grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {view === "organizers" &&
          filteredMembers.map((member) =>
            member.role === "Faculty Advisor" ? (
              <AlumniCard
                key={member.name}
                name={member.name}
                role={member.role}
              />
            ) : (
              <OrganizerCard
                key={member.name}
                name={member.name}
                role={member.role ?? ""}
                hometown={member.hometown}
                major={member.major}
                year={member.year}
                funFact={member.funFact}
                github={member.github}
                linkedin={member.linkedin}
                photo={member.photo}
              />
            ),
          )}

        {view === "alumni" &&
          filteredAlumni.map((alum) => (
            <AlumniCard
              key={alum.name}
              name={alum.name}
              role={alum.role}
              year={alum.year || undefined}
              image={alum.image}
              github={alum.github ?? undefined}
              linkedin={alum.linkedin ?? undefined}
            />
          ))}

        {noResults && (
          <p className="col-span-full text-center text-white/70">
            No matches found.
          </p>
        )}
      </div>
    </div>
  );
}
