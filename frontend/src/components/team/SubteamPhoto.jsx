import { useState, useEffect } from "react"

const teamToUrl = (teamName) => {
    return `https://hophacks-organizers.s3.us-east-1.amazonaws.com/subteam/${teamName}.JPG`;
}

export default function SubteamPhoto({ teamName }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const validTeam = ['All', 'Website', 'Design'].includes(teamName);

    useEffect(() => {
        console.log({ teamName });
        // Reset states when team changes
        setLoading(true);
        setError(false);
    }, [teamName]);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setError(true);
    };

    if (!validTeam) {
        return null;
    }

    return (
        <div className="w-full flex justify-center">
            <div className="relative max-w-lg w-full">
                {/* Skeleton loader */}
                {loading && (
                    <div className="absolute inset-0 bg-gray-200 rounded-2xl animate-pulse" />
                )}

                {/* Actual image with loading handlers */}
                <img
                    src={teamToUrl(teamName)}
                    alt={`${teamName} team photo`}
                    className={`rounded-2xl w-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                />

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
                        <p className="text-gray-500">Failed to load image</p>
                    </div>
                )}
            </div>
        </div>
    );
}