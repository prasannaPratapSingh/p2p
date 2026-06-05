import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useConnections } from '../hook/connections.hook';

const MeetingsPage = () => {
  const navigate = useNavigate();
  const {
    connections,
    loading,
    error,
    fetchMyConnections,
    handleAcceptConnection,
    handleRejectConnection,
    handleCompleteConnection
  } = useConnections();

  const authUser = useSelector((state: any) => state.auth.user?.data);
  const [activeFilter, setActiveFilter] = useState<'all' | 'received' | 'sent'>('all');

  useEffect(() => {
    void fetchMyConnections();
  }, []);

  // Compute stats/counts
  const receivedRequests = connections?.filter((c) => c.receiverId?._id === authUser?.id) || [];
  const sentRequests = connections?.filter((c) => c.senderId?._id === authUser?.id) || [];

  const getFilteredConnections = () => {
    switch (activeFilter) {
      case 'received':
        return receivedRequests;
      case 'sent':
        return sentRequests;
      case 'all':
      default:
        return connections || [];
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Declined
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const filteredItems = getFilteredConnections();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Meetings
            </h1>
            <p className="text-slate-400 text-sm mt-1 font-medium">
              Manage your scheduled peer swaps, incoming connection requests, and join meetings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 hover:cursor-pointer shrink-0"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Filter Sidebar - 25% width */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 pb-2 border-b border-white/[0.04]">
              Filter Requests
            </h3>
            
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap hover:cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>All Requests</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === 'all' ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                  {connections?.length ?? 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('received')}
                className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap hover:cursor-pointer ${
                  activeFilter === 'received'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>Received Requests</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === 'received' ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                  {receivedRequests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('sent')}
                className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap hover:cursor-pointer ${
                  activeFilter === 'sent'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>Sent Requests</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeFilter === 'sent' ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'}`}>
                  {sentRequests.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Right Main Content - 75% width */}
          <div className="lg:col-span-3">
            {loading && !connections ? (
              <div className="flex flex-col items-center justify-center py-20 bg-[#0d111c] border border-white/[0.06] rounded-3xl shadow-xl">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-400 font-medium">Loading meetings...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-16 text-center shadow-xl space-y-4">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400">
                  📁
                </div>
                <h3 className="text-lg font-bold text-white">No requests found</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                  {activeFilter === 'received'
                    ? "You haven't received any swap connection requests from other peers yet."
                    : activeFilter === 'sent'
                    ? "You haven't dispatched any swap connection requests yet."
                    : "No connection requests found. Get started by finding a peer!"}
                </p>
                {activeFilter === 'all' && (
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 hover:cursor-pointer"
                  >
                    Find Peers
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((meeting: any) => {
                  const isOutgoing = meeting.senderId?._id === authUser?.id;
                  const otherUser = isOutgoing ? meeting.receiverId : meeting.senderId;
                  const otherName = otherUser?.name || 'Member';
                  const otherEmail = otherUser?.email || 'N/A';
                  const otherInitials = otherName.charAt(0).toUpperCase();
                  const proposedTimeStr = new Date(meeting.proposedTime).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={meeting._id}
                      className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-white/[0.12] transition duration-200 relative overflow-hidden group"
                    >
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-[#1a2030] flex items-center justify-center shrink-0">
                              {otherUser?.avatarUrl ? (
                                <img
                                  src={otherUser.avatarUrl}
                                  alt={otherName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-bold text-indigo-300">
                                  {otherInitials}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${isOutgoing ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                                {isOutgoing ? 'Sent' : 'Received'}
                              </span>
                              <h3 className="text-base font-bold text-white mt-1 leading-tight truncate">
                                {otherName}
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">{otherEmail}</p>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {getStatusBadge(meeting.status)}
                          </div>
                        </div>

                        {/* Meeting Time */}
                        <div className="bg-[#141a29] border border-white/[0.04] p-4 rounded-2xl flex items-center justify-between text-sm">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meeting Date & Time</span>
                            <span className="font-semibold text-slate-200">{proposedTimeStr}</span>
                          </div>
                        </div>

                        {/* Jitsi Meeting Link */}
                        {meeting.meetingLink && (meeting.status === 'accepted' || meeting.status === 'completed') && (
                          <div className="bg-[#141a29] border border-white/[0.04] p-4 rounded-2xl space-y-2">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Video Conference Room</span>
                            {meeting.status === 'completed' ? (
                              <button
                                disabled
                                className="inline-flex items-center justify-center gap-2 w-full py-2 bg-slate-800 text-slate-500 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed opacity-50"
                              >
                                🎥 Meeting Completed
                              </button>
                            ) : (
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200"
                              >
                                🎥 Join Jitsi Room
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Accept / Reject actions for Received pending requests */}
                      {!isOutgoing && meeting.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <button
                            type="button"
                            onClick={() => handleRejectConnection(meeting._id)}
                            className="py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 hover:cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAcceptConnection(meeting._id)}
                            className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 hover:cursor-pointer"
                          >
                            Accept
                          </button>
                        </div>
                      )}

                      {/* Complete Meeting action for Accepted requests */}
                      {meeting.status === 'accepted' && (
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              const confirmComplete = window.confirm("Are you sure you want to complete this meeting? Only mark it as complete if the session is over.");
                              if (confirmComplete) {
                                void handleCompleteConnection(meeting._id);
                              }
                            }}
                            className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 hover:cursor-pointer"
                          >
                            Complete Meeting
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default MeetingsPage;
