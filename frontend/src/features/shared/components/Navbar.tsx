import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useAuth } from "../../auth/hook/auth.hook";
import { useProfile } from "../../profile/hook/profile.hook";
import { useNotifications } from "../../notifications/hook/notification.hook";

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const Navbar = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { handleSetView } = useProfile();
  const { handleFetchNotifications, handleMarkAllRead } = useNotifications();

  const auth = useSelector((state: any) => state.auth);
  const user = auth?.user;
  
  const notifications = useSelector((state: any) => state.notifications);
  const { list: notificationList, unreadCount, loading: notificationLoading } = notifications;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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

  // Fetch notifications on mount/user state change
  useEffect(() => {
    if (user) {
      handleFetchNotifications();
    }
  }, [user, handleFetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
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

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsDropdownOpen(false);
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition hover:cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-[#0d0d0d]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#0d0d0d] p-3 shadow-xl ring-1 ring-black/50 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[400px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition hover:cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {notificationLoading && notificationList.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-500">Loading notifications...</div>
                    ) : notificationList.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-500">No notifications yet.</div>
                    ) : (
                      notificationList.map((notification: any) => {
                        const senderName = typeof notification.sender === "object" ? notification.sender?.name : "System";
                        const senderAvatar = typeof notification.sender === "object" ? notification.sender?.avatarUrl : null;
                        return (
                          <div
                            key={notification._id}
                            onClick={() => {
                              setIsNotificationOpen(false);
                              if (notification.link) {
                                navigate(notification.link);
                              }
                            }}
                            className={`flex items-start gap-2.5 p-2 rounded-lg transition duration-200 hover:cursor-pointer hover:bg-white/5 ${
                              !notification.isRead ? "bg-indigo-500/5 border-l-2 border-indigo-500" : "bg-transparent"
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 bg-[#1a2030] flex items-center justify-center shrink-0">
                              {senderAvatar ? (
                                <img src={senderAvatar} alt={senderName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-100">
                                  {senderName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                                <span className="font-semibold text-white mr-1">{senderName}</span>
                                {notification.message}
                              </p>
                              <span className="text-[10px] text-slate-500 block mt-1">
                                {getRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            {!notification.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

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
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsNotificationOpen(false);
                  }}
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