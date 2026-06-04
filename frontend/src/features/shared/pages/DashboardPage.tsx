import { useEffect } from 'react';
import { useProfile } from '../../profile/hook/profile.hook';

const DashboardPage = () => {
  const { profile, loading, error, fetchProfile } = useProfile();
  const skillData = profile?.userSkillData;

  useEffect(() => {
    if (!profile && !loading) {
      void fetchProfile();
    }
  }, [fetchProfile, loading, profile]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-5xl rounded-4xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400 text-lg leading-8">
            You are signed in. Use this dashboard to manage your connections, update your profile, and explore the latest peer opportunities.
          </p>

          {loading && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-300">Loading your profile...</div>
          )}

          {error && (
            <div className="rounded-3xl border border-rose-500 bg-rose-500/10 p-6 text-rose-200">{error}</div>
          )}

          {profile && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Sessions Completed</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{skillData?.totalSessionsCompleted ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Activity Score</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{skillData?.activityScore ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Rating</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{skillData?.rating ?? 0}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Profile</p>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{profile.name}</h2>
                  <p className="text-slate-400">{profile.email}</p>
                  <p className="mt-4 text-slate-400">Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Skills</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-slate-400">Skills to Teach</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(skillData?.skillsToTeach ?? []).map((skill) => (
                          <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-white">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Skills to Learn</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(skillData?.skillsToLearn ?? []).map((skill) => (
                          <span key={skill} className="rounded-full bg-slate-800 px-3 py-1 text-sm text-white">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !profile && !error && (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-slate-400">No profile data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
