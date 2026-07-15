/**
 * Shared style constants and layout helpers for the profile page, copied
 * from the signup page's "homepage design language" (see the top of
 * `app/register/signup/page.tsx`) so the two flows look identical. If the
 * signup styles change, mirror them here.
 */

export const INPUT_CLS = "input-sketch w-full rounded-lg px-4 py-2.5 text-base";
export const BTN_PRIMARY =
  "rounded-2xl bg-recap-gold px-6 py-3 text-lg font-bold text-white shadow-[0_0_30px_rgba(255,181,31,0.3)] transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(255,181,31,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
export const BTN_SECONDARY =
  "btn-sketch rounded-2xl px-6 py-3 text-lg font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
// Card styled like the hero's floating islands: translucent warm stone
// (light at the top, shadowed toward the bottom) with a mossy green top
// edge, so it reads as part of the storybook scene rather than a flat
// panel. Kept translucent + blurred so the sky still glows through.
export const CARD_CLS =
  "w-full rounded-2xl border border-rock-light/45 border-t-4 border-t-green-light/80 bg-gradient-to-b from-rock/55 to-rock-dark/70 p-6 backdrop-blur-sm sm:p-8 motion-safe:animate-rise";

export function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  // The control is nested inside the <label> so the two are implicitly
  // associated (screen readers announce the label; clicking it focuses).
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-white">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-white/65">(optional)</span>
        )}
      </span>
      {children}
      {error && <span className="text-sm text-red-300">{error}</span>}
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-rock-light/30 pb-2 text-lg font-bold text-white">
      {children}
    </h3>
  );
}

export function ErrorNote({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p className="rounded-lg border border-red-300/40 bg-red-500/25 px-4 py-2 text-sm text-white">
      {msg}
    </p>
  );
}
