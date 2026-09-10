// Derives an organizer's headshot URL from their name (matches how photos
// are named in the S3 bucket the old site used).
export function nameToPhotoUrl(name: string): string {
  return `https://hophacks-organizers.s3.us-east-1.amazonaws.com/${name.replaceAll(" ", "+")}.jpg`;
}

export function filterByNameOrRole<T extends { name: string; role?: string }>(
  members: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return members;
  return members.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      (m.role ?? "").toLowerCase().includes(q),
  );
}

export function sortByYear<T extends { year: number }>(
  entries: T[],
  order: "asc" | "desc",
): T[] {
  return [...entries].sort((a, b) =>
    order === "asc" ? a.year - b.year : b.year - a.year,
  );
}
