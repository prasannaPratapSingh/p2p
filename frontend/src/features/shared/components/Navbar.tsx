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
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-slate-100 lg:px-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-lg font-semibold text-white hover:text-cyan-300"
        >
          Peer2Peer
        </button>

        {user ? (
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/80 pl-2 pr-4 py-1 text-slate-100">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-slate-600" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{displayName}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-100 transition hover:border-cyan-400 hover:text-white"
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-rose-500 px-4 py-2 text-white transition hover:bg-rose-400"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-100 transition hover:border-cyan-400 hover:text-white"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-full bg-cyan-500 px-4 py-2 text-slate-950 transition hover:bg-cyan-400"
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