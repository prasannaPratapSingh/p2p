import { type FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../hook/auth.hook';
import { useNavigate, Link } from 'react-router';
import { setError } from '../state/auth.slice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector((state: any) => state.auth.error);

    useEffect(() => {
        dispatch(setError(null));
    }, [dispatch]);

    const { handleLogin } = useAuth();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setError(null));
        console.log('Login attempt', { email, password });

        try {
            const user = await handleLogin({ email, password }) as any;
            console.log(user);

            if (user?.success) {
                navigate('/dashboard');
            }
        } catch (_error: any) {
            // Error is already stored in Redux via useAuth
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-hidden flex items-center justify-center font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-120 h-120 bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
            <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] mix-blend-screen"></div>

            <div className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row rounded-[2.5rem] overflow-hidden bg-white/2 border border-white/10 shadow-2xl backdrop-blur-2xl relative z-10">

                {/* Left Section - Form */}
                <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center relative">
                    <Link to="/" className="absolute top-6 left-6 lg:top-10 lg:left-10 flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Home
                    </Link>
                    <div className="max-w-md mx-auto w-full space-y-8 mt-4 lg:mt-0">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
                                Peer2Peer Hub
                            </span>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Enter your credentials to access your skill network.
                            </p>
                        </div>

                        {authError && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {authError}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 block">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 flex items-center justify-between">
                                    Password
                                    <Link to="#" className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors">Forgot?</Link>
                                </label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:translate-y-0"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="text-center text-sm text-slate-400 mt-8">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-white font-semibold hover:text-indigo-400 transition-colors">
                                Create one
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Section - Image/Visuals */}
                <div className="hidden lg:flex flex-1 relative bg-indigo-900/20 overflow-hidden items-center justify-center p-12">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 to-purple-600/20 z-0"></div>
                    <img
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80"
                        alt="Collaboration"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />

                    <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-sm transform hover:scale-105 transition-transform duration-500">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Accelerate your growth</h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Join a community of peers exchanging valuable skills. Enhance your career and personal life by learning from the best.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;
