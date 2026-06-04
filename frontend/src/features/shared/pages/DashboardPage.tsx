const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 px-6 sm:px-10">
      <div className="mx-auto max-w-5xl rounded-4xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-400 text-lg leading-8">
            You are signed in. Use this dashboard to manage your connections, update your profile, and explore the latest peer opportunities.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Connections</p>
              <p className="mt-4 text-3xl font-semibold text-white">24</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Sessions</p>
              <p className="mt-4 text-3xl font-semibold text-white">8</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Skills</p>
              <p className="mt-4 text-3xl font-semibold text-white">16</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
