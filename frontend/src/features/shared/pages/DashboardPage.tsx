import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useProfile } from '../../profile/hook/profile.hook';
import { useConnections } from '../../connections/hook/connections.hook';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const {
    profile,
    loading,
    error,
    matches,
    loadingMatches,
    matchesError,
    view,
    fetchProfile,
    handleUpdateSkills,
    handleUploadAvatar,
    fetchMatches,
    handleSetView
  } = useProfile();

  const { handleRequestConnection } = useConnections();

  const skillData = profile?.userSkillData;

  // Modals and form state
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillsToTeach, setSkillsToTeach] = useState<string[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');

  // Connect Peer modal state
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [selectedPeerName, setSelectedPeerName] = useState<string>('');
  const [proposedTime, setProposedTime] = useState('');
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Avatar uploading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!profile && !loading) {
      void fetchProfile();
    }
  }, [fetchProfile, loading, profile]);

  useEffect(() => {
    if (view === 'matches') {
      void fetchMatches();
    }
  }, [view]);

  // Sync modal state when profile changes or modal opens
  useEffect(() => {
    if (skillData) {
      setSkillsToTeach(skillData.skillsToTeach ?? []);
      setSkillsToLearn(skillData.skillsToLearn ?? []);
    }
  }, [skillData, isSkillsModalOpen]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (e.g. 5MB max) and type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB.');
      return;
    }

    try {
      setUploadError(null);
      setIsUploading(true);
      await handleUploadAvatar(file);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTeachSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTeachSkill.trim();
    if (clean && !skillsToTeach.includes(clean)) {
      setSkillsToTeach([...skillsToTeach, clean]);
      setNewTeachSkill('');
    }
  };

  const handleAddLearnSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newLearnSkill.trim();
    if (clean && !skillsToLearn.includes(clean)) {
      setSkillsToLearn([...skillsToLearn, clean]);
      setNewLearnSkill('');
    }
  };

  const handleRemoveTeachSkill = (skill: string) => {
    setSkillsToTeach(skillsToTeach.filter((s) => s !== skill));
  };

  const handleRemoveLearnSkill = (skill: string) => {
    setSkillsToLearn(skillsToLearn.filter((s) => s !== skill));
  };

  const handleSaveSkills = async () => {
    try {
      await handleUpdateSkills(skillsToLearn, skillsToTeach);
      setIsSkillsModalOpen(false);
      void fetchMatches();
    } catch (err: any) {
      // Handled by hook/state
    }
  };

  const handleOpenConnectModal = (peerId: string, peerName: string) => {
    setSelectedPeerId(peerId);
    setSelectedPeerName(peerName);
    setProposedTime('');
    setConnectError(null);
    setIsConnectModalOpen(true);
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerId || !proposedTime) {
      setConnectError('Please specify a valid proposed meeting time.');
      return;
    }

    const meetingDate = new Date(proposedTime);
    if (isNaN(meetingDate.getTime()) || meetingDate <= new Date()) {
      setConnectError('Proposed time must be a valid date in the future.');
      return;
    }

    try {
      setConnectError(null);
      setIsConnecting(true);
      await handleRequestConnection(selectedPeerId, meetingDate);
      setIsConnectModalOpen(false);
      alert('Swap connection request sent successfully!');
      // Navigate to meetings page so they can see it pending
      navigate('/meetings');
    } catch (err: any) {
      setConnectError(err?.response?.data?.message || err?.message || 'Failed to send connection request.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300 backdrop-blur-md flex items-center justify-between">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError(null)} className="text-rose-400 hover:text-rose-200">×</button>
          </div>
        )}

        {loading && !profile ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-400 font-medium">Fetching profile details...</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
            
            {/* Left Sidebar - 30% width */}
            <div className="lg:col-span-3 lg:sticky lg:top-24 bg-[#0d111c] border border-white/[0.06] rounded-3xl p-8 flex flex-col items-center shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 inset-x-0 h-2 bg-[#1e293b]"></div>
              
              {/* Avatar section (No gradient border) */}
              <div className="relative mt-4 group/avatar cursor-pointer" onClick={handleAvatarClick}>
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-slate-700 bg-[#1a2030] flex items-center justify-center">
                  {isUploading ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                  ) : null}
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-indigo-300">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Email */}
              <h2 className="mt-6 text-xl font-bold text-white text-center leading-tight tracking-wide">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400 text-center font-medium break-all">
                {profile.email}
              </p>

              {/* Update Avatar Button */}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="mt-6 w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-200 text-slate-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:cursor-pointer"
              >
                {isUploading ? 'Uploading...' : 'Update Avatar'}
              </button>

              {/* Find My Peer Button */}
              <button
                type="button"
                onClick={() => handleSetView('matches')}
                className="mt-3 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-200 text-white shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:cursor-pointer"
              >
                Find My Peer
              </button>

              {/* Your Meetings Button */}
              <button
                type="button"
                onClick={() => navigate('/meetings')}
                className="mt-3 w-full py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider rounded-xl transition duration-200 text-slate-300 hover:text-white hover:cursor-pointer"
              >
                Your Meetings
              </button>

              {/* Stats: Rating and Sessions */}
              <div className="mt-8 w-full border-t border-white/[0.06] pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                      ★
                    </div>
                    <span className="text-sm text-slate-400 font-medium">Rating</span>
                  </div>
                  <span className="text-base font-bold text-white">
                    {skillData?.rating ? Number(skillData.rating).toFixed(1) : '0.0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      ☍
                    </div>
                    <span className="text-sm text-slate-400 font-medium">Sessions</span>
                  </div>
                  <span className="text-base font-bold text-white">
                    {skillData?.totalSessionsCompleted ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - 70% width */}
            <div className="lg:col-span-7 space-y-8">
              {view === 'matches' ? (
                <>
                  {/* Matches View Header */}
                  <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Compatible Peers
                      </h1>
                      <p className="text-slate-400 text-sm mt-1 font-medium">
                        Peers matching your learning goals and teaching skills.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSetView('profile')}
                      className="inline-flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 hover:cursor-pointer"
                    >
                      &larr; Back to Profile
                    </button>
                  </div>

                  {/* Loading/Error states for Matches */}
                  {loadingMatches ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0d111c] border border-white/[0.06] rounded-3xl shadow-xl">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                      </div>
                      <p className="mt-4 text-slate-400 font-medium">Searching for matches...</p>
                    </div>
                  ) : matchesError ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-6 text-rose-300 shadow-xl">
                      {matchesError}
                    </div>
                  ) : matches && matches.length === 0 ? (
                    <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-10 text-center shadow-xl space-y-4">
                      <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-2xl text-slate-400">
                        🔍
                      </div>
                      <h3 className="text-lg font-bold text-white">No matches found yet</h3>
                      <p className="text-slate-400 text-sm max-w-md mx-auto">
                        Make sure you have added both your "skills to teach" and "skills to learn" in your profile, so the match engine can pair you with peers.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSkillsModalOpen(true)}
                        className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] hover:cursor-pointer"
                      >
                        Update Skills
                      </button>
                    </div>
                  ) : matches ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {matches.map((peer: any) => {
                        const peerUser = peer.userId || {};
                        const peerName = peerUser.name || 'Member';
                        const peerInitials = peerName.charAt(0).toUpperCase();

                        return (
                          <div
                            key={peer._id}
                            className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-white/[0.12] transition duration-200 relative overflow-hidden group"
                          >
                            <div className="space-y-5">
                              {/* Peer Header */}
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-[#1a2030] flex items-center justify-center shrink-0">
                                  {peerUser.avatarUrl ? (
                                    <img
                                      src={peerUser.avatarUrl}
                                      alt={peerName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-lg font-bold text-indigo-300">
                                      {peerInitials}
                                    </span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-base font-bold text-white truncate leading-snug">
                                    {peerName}
                                  </h4>
                                  <p className="text-xs text-slate-400 truncate mt-0.5">
                                    {peerUser.email}
                                  </p>
                                </div>
                              </div>

                              {/* Peer Stats */}
                              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/[0.04] text-center">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rating</span>
                                  <span className="text-xs font-bold text-white mt-1 block">
                                    ★ {peer.rating ? Number(peer.rating).toFixed(1) : '0.0'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sessions</span>
                                  <span className="text-xs font-bold text-white mt-1 block">
                                    {peer.totalSessionsCompleted ?? 0}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Activity</span>
                                  <span className="text-xs font-bold text-white mt-1 block">
                                    {peer.activityScore ?? 0}
                                  </span>
                                </div>
                              </div>

                              {/* Skills match matching lists */}
                              <div className="space-y-3.5 text-left">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                    Can Teach You:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {(peer.skillsToTeach ?? []).map((skill: string) => (
                                      <span
                                        key={skill}
                                        className="text-[10px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                                    Wants to Learn:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {(peer.skillsToLearn ?? []).map((skill: string) => (
                                      <span
                                        key={skill}
                                        className="text-[10px] font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleOpenConnectModal(peerUser._id, peerName)}
                              className="mt-6 w-full py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition duration-200 hover:cursor-pointer"
                            >
                              Connect Peer
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  {/* Header card with Action */}
                  <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Workspace Dashboard
                      </h1>
                      <p className="text-slate-400 text-sm mt-1 font-medium">
                        Configure your expertise, match settings, and view system stats.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSkillsModalOpen(true)}
                      className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] hover:cursor-pointer"
                    >
                      Update Skills
                    </button>
                  </div>

                  {/* Section 1: Basic Information */}
                  <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white tracking-wide border-b border-white/[0.06] pb-4">
                      Basic Information
                    </h3>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</label>
                        <p className="mt-1 text-slate-200 font-medium text-base">{profile.name}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email Address</label>
                        <p className="mt-1 text-slate-200 font-medium text-base">{profile.email}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Member Since</label>
                        <p className="mt-1 text-slate-200 font-medium text-base">
                          {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Skills & Performance */}
                  <div className="bg-[#0d111c] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        Skills & Activity
                      </h3>
                    </div>

                    {/* Skill Stats Mini Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-[#141a29] border border-white/[0.04] p-5 rounded-2xl">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Activity Score</span>
                        <p className="mt-2 text-2xl font-black text-white">{skillData?.activityScore ?? 0}</p>
                      </div>
                      <div className="bg-[#141a29] border border-white/[0.04] p-5 rounded-2xl">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">System Rating</span>
                        <p className="mt-2 text-2xl font-black text-white">{skillData?.rating ? Number(skillData.rating).toFixed(1) : '0.0'}</p>
                      </div>
                      <div className="bg-[#141a29] border border-white/[0.04] p-5 rounded-2xl">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Total Sessions</span>
                        <p className="mt-2 text-2xl font-black text-white">{skillData?.totalSessionsCompleted ?? 0}</p>
                      </div>
                    </div>

                    {/* Skills tags lists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Skills to Teach */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Skills to Teach
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillData?.skillsToTeach && skillData.skillsToTeach.length > 0 ? (
                            skillData.skillsToTeach.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 italic">No skills listed yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Skills to Learn */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                          Skills to Learn
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {skillData?.skillsToLearn && skillData.skillsToLearn.length > 0 ? (
                            skillData.skillsToLearn.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3.5 py-1.5 rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-slate-500 italic">No skills listed yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>
        ) : (
          <div className="rounded-3xl border border-white/[0.06] bg-[#0d111c] p-10 text-center text-slate-400">
            No profile details available.
          </div>
        )}
      </div>

      {/* Modern Connect Peer Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-md transition-opacity" onClick={() => setIsConnectModalOpen(false)}></div>
          
          <div className="relative bg-[#0d111c] border border-white/[0.08] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h2 className="text-lg font-bold text-white">Connect with {selectedPeerName}</h2>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 hover:cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="mt-6 space-y-5">
              {connectError && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                  {connectError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Propose Swap Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={proposedTime}
                  onChange={(e) => setProposedTime(e.target.value)}
                  className="w-full bg-[#141a29] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200"
                />
                <p className="text-[10px] text-slate-500">
                  Choose a date and time to meet for the skill-swap session.
                </p>
              </div>

              <div className="mt-8 border-t border-white/[0.06] pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm py-2 px-4 rounded-xl transition duration-200 border border-white/10 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2 px-5 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                >
                  {isConnecting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Skills Modal */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#07090e]/85 backdrop-blur-md transition-opacity" onClick={() => setIsSkillsModalOpen(false)}></div>
          
          <div className="relative bg-[#0d111c] border border-white/[0.08] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h2 className="text-xl font-bold text-white">Update Skills & Interests</h2>
              <button
                onClick={() => setIsSkillsModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 hover:cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 space-y-6 flex-1 overflow-y-auto pr-1">
              
              {/* Form Skills to Teach */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Skills to Teach</label>
                <form onSubmit={handleAddTeachSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. React, Python, Product Design"
                    value={newTeachSkill}
                    onChange={(e) => setNewTeachSkill(e.target.value)}
                    className="flex-1 bg-[#141a29] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200 placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 rounded-xl transition duration-200 hover:cursor-pointer"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsToTeach.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeachSkill(skill)}
                        className="text-emerald-400 hover:text-emerald-200 font-bold ml-0.5 text-sm hover:cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Skills to Learn */}
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Skills to Learn</label>
                <form onSubmit={handleAddLearnSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. NextJS, Rust, Data Science"
                    value={newLearnSkill}
                    onChange={(e) => setNewLearnSkill(e.target.value)}
                    className="flex-1 bg-[#141a29] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition duration-200 placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-4 rounded-xl transition duration-200 hover:cursor-pointer"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsToLearn.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-3.5 py-1.5 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(skill)}
                        className="text-violet-400 hover:text-violet-200 font-bold ml-0.5 text-sm hover:cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-8 border-t border-white/[0.06] pt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSkillsModalOpen(false)}
                className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 border border-white/10 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSkills}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition duration-200 hover:cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
