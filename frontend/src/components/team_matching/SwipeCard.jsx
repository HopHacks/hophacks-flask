function SwipeCard({ user }) {
  const profile = user.team_matching_profile || {};
  let stage, body, accent, accessory, object;
  if (profile.pfp) {
    const parts = profile.pfp.split('_');
    [stage, body, , accent, accessory, object] = parts.map(Number);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-black w-full h-full flex flex-col overflow-hidden">
      {/* Profile Picture */}
      {profile.pfp && (
        <img
          src={`https://hophacks-website.s3.us-east-1.amazonaws.com/pfps/${stage}_${body}_1_${accent}_${accessory}_${object}.png`}
          alt="Profile"
          className="w-full h-32 object-contain mb-3 rounded-md flex-shrink-0"
        />
      )}
      
      {/* Profile Info */}
      <div className="flex-1 min-h-0 space-y-2">
        <div>
          <h2 className="text-xl font-bold truncate">{profile.first_name} {profile.last_name}</h2>
          <p className="text-xs text-gray-600">{profile.year} • {profile.school}</p>
        </div>
        
        <p className="text-sm"><strong>Major:</strong> <span className="truncate">{profile.major}</span></p>
        
        <div>
          <p className="font-semibold text-sm">Preferred Roles:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.preferred_roles?.slice(0, 3).map((role, i) => (
              <span key={i} className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">{role}</span>
            ))}
            {profile.preferred_roles?.length > 3 && (
              <span className="text-xs text-gray-500">+{profile.preferred_roles.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-sm">Skills:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.skills?.slice(0, 4).map((skill, i) => (
              <span key={i} className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">{skill}</span>
            ))}
            {profile.skills?.length > 4 && (
              <span className="text-xs text-gray-500">+{profile.skills.length - 4} more</span>
            )}
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-sm">Interests:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.interests?.slice(0, 3).map((interest, i) => (
              <span key={i} className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">{interest}</span>
            ))}
            {profile.interests?.length > 3 && (
              <span className="text-xs text-gray-500">+{profile.interests.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <p className="font-semibold text-sm mb-1">Bio:</p>
          <div className="text-xs leading-relaxed overflow-hidden text-ellipsis"
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 4,
                 WebkitBoxOrient: 'vertical',
                 wordBreak: 'break-word',
                 lineHeight: '1.4'
               }}>
            {profile.bio}
          </div>
        </div>
        
        <div className="flex gap-4 pt-2 flex-shrink-0">
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
              GitHub
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


export default SwipeCard;