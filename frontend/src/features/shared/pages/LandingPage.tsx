import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-clip font-sans">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute top-[40%] left-[30%] w-[30rem] h-[30rem] bg-pink-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-12 pb-20 lg:pt-20 lg:pb-32 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left side text */}
            <div className="max-w-2xl text-left mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
                The Ultimate Skill Network
              </span>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
                Master skills with <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">trusted peers.</span>
              </h1>
              <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                Join a modern community of ambitious learners. Share knowledge, find collaborators, and accelerate your growth through meaningful peer-to-peer exchanges.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                >
                  Start Learning For Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 backdrop-blur-md"
                >
                  Explore the Network
                </button>
              </div>
            </div>

            {/* Right side card/image */}
            <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-square sm:aspect-[5/4] lg:aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 z-10 mix-blend-overlay"></div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="Students collaborating"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                {/* Floating elements over image */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-5 transform hover:scale-[1.02] transition-transform duration-500 shadow-2xl">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-black" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Sneha Verma</h4>
                        <p className="text-indigo-300 text-xs font-medium">Senior Developer</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed hidden sm:block">
                      "I learned more about system design in 3 weeks pairing with mentors here than I did in 6 months alone."
                    </p>
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-20">
                   <div className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                     Online Now
                   </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-24 bg-[#050508] border-y border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">succeed</span></h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg">A suite of powerful tools designed to make peer-to-peer learning as seamless and effective as possible.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative w-12 h-12 mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center transform group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] transition-all duration-500">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">Discover Peers</h3>
                <p className="relative text-slate-400 leading-relaxed text-sm md:text-base">
                  Browse verified profiles and instantly match with people whose goals and expertise complement yours. Skip the noise and find the right mentor or mentee.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative w-12 h-12 mb-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center transform group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-500">
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">Skill Exchange</h3>
                <p className="relative text-slate-400 leading-relaxed text-sm md:text-base">
                  Trade what you know for what you need. Learn faster through reciprocal teaching, code reviews, and hands-on practice sessions tailored for you.
                </p>
              </div>

              {/* Feature 3 (New: 1:1 Meeting Room with Jitsi) */}
              <div className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative w-12 h-12 mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center transform group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-500">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">1:1 Meeting Rooms</h3>
                <p className="relative text-slate-400 leading-relaxed text-sm md:text-base">
                  Jump straight into a personal, isolated virtual room powered by Jitsi, designed specifically for learning and growing. Complete with screen sharing and clear audio.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-pink-500/30 transition-all duration-500 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative w-12 h-12 mb-6 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center transform group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all duration-500">
                  <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors duration-300">Accelerate Growth</h3>
                <p className="relative text-slate-400 leading-relaxed text-sm md:text-base">
                  Stay motivated with a supportive community. Track your progress, earn endorsements, and build a portfolio as you master new disciplines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="px-6 py-24 bg-[#0a0a0a] relative z-10 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">works</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three simple steps to start learning and growing with peers around the world.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Line (Desktop only) */}
              <div className="hidden md:block absolute top-[4rem] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">1</div>
                <h3 className="text-xl font-bold text-white mb-3">Create your profile</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Tell us what you know and what you want to learn. Our algorithm matches you with the perfect peers.</p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">2</div>
                <h3 className="text-xl font-bold text-white mb-3">Connect & Schedule</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Browse your matches, send a request, and book a 1:1 session at a time that works for both of you.</p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center text-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-xl backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">3</div>
                <h3 className="text-xl font-bold text-white mb-3">Learn in our Rooms</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Jump into your dedicated virtual room. Share your screen, chat, and exchange skills in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-20 border-y border-white/5 relative z-10 overflow-hidden bg-[#050508]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/5 via-purple-900/5 to-indigo-900/5"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">10k+</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Peers</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">50k</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Hours Learned</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Match Success</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Rooms Open</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 lg:py-24 max-w-4xl mx-auto text-center">
          <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-10 lg:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5">Ready to level up?</h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm md:text-base">
                Join thousands of ambitious individuals who are already transforming their careers through peer-to-peer learning.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors duration-300 shadow-lg shadow-indigo-500/20"
              >
                Create Your Free Account
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 py-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Peer2Peer Network. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
