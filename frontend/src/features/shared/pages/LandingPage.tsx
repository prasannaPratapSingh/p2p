import { useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-12 lg:px-10">
          <header className="mb-12 max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1 text-sm text-cyan-300">
              Peer2Peer — Connect, Learn, Grow
            </span>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build real skills with trusted peers.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Share knowledge, find collaborators, and grow your network in a modern skill-sharing community built for ambitious learners.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Peer discovery</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Find collaborators instantly</h2>
                  <p className="mt-2 text-slate-400">Browse profiles, compare strengths, and connect with people who match your goals.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Skill swap</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Trade expertise</h2>
                  <p className="mt-2 text-slate-400">Offer what you know, learn what you need, and grow together through meaningful exchanges.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
                >
                  Get Started
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950/80 p-6 ring-1 ring-slate-800">
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Featured insight</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">Your next mentor is a conversation away.</h2>
                  <p className="mt-4 text-slate-400">Join a network of learners and experts where skill-building is fast, friendly, and focused on real outcomes.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Verified peer profiles</p>
                    <p className="mt-3 text-xl font-semibold text-white">12k+</p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                    <p className="text-sm text-slate-400">Sessions scheduled</p>
                    <p className="mt-3 text-xl font-semibold text-white">4.7k</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950/90 py-16">
        <div className="mx-auto max-w-6xl space-y-10 px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-3xl bg-slate-900/80 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Community</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Designed for growth</h3>
              <p className="mt-3 text-slate-400">Peer2Peer makes it easy to build trust, exchange skills, and stay motivated with a supportive community.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Focus</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Quality connections</h3>
              <p className="mt-3 text-slate-400">Match with peers who care about the same topics and are ready to learn together.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-8 shadow-lg shadow-slate-950/20">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Momentum</p>
              <h3 className="mt-4 text-xl font-semibold text-white">Built to move fast</h3>
              <p className="mt-3 text-slate-400">Quick onboarding, easy skill swaps, and a streamlined experience for busy professionals.</p>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Ready to join?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Start your peer-to-peer journey today</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">Whether you want to teach, learn, or collaborate, Peer2Peer gives you the tools to grow faster with real people.</p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="mt-8 inline-flex rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Create your free account
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
