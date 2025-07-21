function SwipeCard({ user }) {
  const profile = user.team_matching_profile || {};

  let stage, body, accent, accessory, object;
  if (profile.pfp) {
    const parts = profile.pfp.split('_');
    [stage, body, , accent, accessory, object] = parts.map(Number);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-black w-full">
      {/* Profile Picture */}
      {profile.pfp && (
        <img
          src={`https://hophacks-website.s3.us-east-1.amazonaws.com/pfps/${stage}_${body}_1_${accent}_${accessory}_${object}.png`}
          alt="Profile"
          className="w-full h-48 object-contain mb-4 rounded-md"
        />
      )}

      {/* Profile Info */}
      <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
      <p className="text-sm text-gray-600 mb-2">{profile.year} • {profile.school}</p>

      <p><strong>Major:</strong> {profile.major}</p>
      <p><strong>Role:</strong> {profile.preferred_role}</p>

      <div className="mt-2">
        <p className="font-semibold">Skills:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {profile.skills?.map((skill, i) => (
            <span key={i} className="bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <p className="font-semibold">Interests:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {profile.interests?.map((interest, i) => (
            <span key={i} className="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full">{interest}</span>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <p className="font-semibold">Bio:</p>
        <p>{profile.bio}</p>
      </div>

      <div className="mt-4 flex gap-4">
        {profile.github && (
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            GitHub
          </a>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}



export default SwipeCard;
