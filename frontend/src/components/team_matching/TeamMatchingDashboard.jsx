export default function TeamMatchingDashboard({ setStage }) {
  return (
    <div className="flex justify-center items-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-screen px-4 pt-12">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5 space-y-8"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h1 className="text-white text-3xl font-bold text-center">Team Matching Dashboard</h1>
        <div className="flex flex-col gap-6">
          {/* Find Teammates Card */}
          <div className="bg-white rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 p-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Find Teammates</h3>
            <p className="text-gray-600 mb-4">
              Swipe through potential team members and find your perfect match.
            </p>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium transition"
              onClick={() => setStage('swipe')}
            >
              Start Swiping
            </button>
          </div>

          {/* Your Matches Card */}
          <div className="bg-white rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 p-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your Matches</h3>
            <p className="text-gray-600 mb-4">View and manage your team matches and connections.</p>
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium transition"
              onClick={() => setStage('matches')}
            >
              Go to Your Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
