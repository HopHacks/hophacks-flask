// Converts a team member's name to their image URL
export function nameToURL(name) {
  const processedName = name.replaceAll(' ', '+');
  return 'https://hophacks-organizers.s3.us-east-1.amazonaws.com/' + processedName + '.jpg';
}

// Filters team members based on search query
export function filterTeamMembers(members, searchQuery) {
  return members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

// Sort alumni by year
export function sortAlumni(alumni, sortOrder) {
  return [...alumni].sort((a, b) => (sortOrder === 'asc' ? a.year - b.year : b.year - a.year));
}
