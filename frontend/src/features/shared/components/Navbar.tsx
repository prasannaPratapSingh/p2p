import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/auth.hook";

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;


  const displayName = user?.data?.name || "Member";
  const avatarUrl = user?.data?.avatarUrl


  const handleSignOut = async () => {
    try {
      await handleLogout();
      navigate('/');
    } catch {
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-100 lg:px-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-lg font-semibold text-white hover:text-indigo-400 transition-colors"
        >
          Peer2Peer
        </button>

        {user ? (
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-2 pr-4 py-1 text-slate-100">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{displayName}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 transition hover:border-indigo-500 hover:text-white"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-500"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500"
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