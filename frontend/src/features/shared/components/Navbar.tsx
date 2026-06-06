import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/auth.hook";
import { useProfile } from "../../profile/hook/profile.hook";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleSetView } = useProfile();
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = user?.data?.name || "Member";
  const avatarUrl = user?.data?.avatarUrl;

  const handleSignOut = async () => {
    try {
      await handleLogout();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-white/[0.04] backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_24px_0_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-100 lg:px-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors hover:cursor-pointer"
        >
          Synapse
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                handleSetView('matches');
                navigate('/dashboard');
              }}
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition hover:cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3.5 py-1.5 rounded-full"
            >
              Find My Peer
            </button>
            <div className="flex items-center gap-2" ref={dropdownRef}>
              {/* Static Avatar Image */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#1a2030] flex items-center justify-center shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-100">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Separate Dropdown Trigger Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 select-none hover:cursor-pointer focus:outline-none"
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#0d0d0d] p-1.5 shadow-xl ring-1 ring-black/50 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleSetView('profile');
                        navigate('/dashboard');
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/5 hover:text-white transition duration-200 hover:cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-rose-400 rounded-lg hover:bg-rose-500/10 hover:text-rose-300 transition duration-200 hover:cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white hover:cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 hover:cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;