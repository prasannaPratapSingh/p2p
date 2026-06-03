import React, { type FormEvent, useState } from 'react';
import { useAuth } from '../hook/auth.hook';
import { useNavigate } from 'react-router';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate=useNavigate();

    const { handleRegister } = useAuth();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Registration attempt', { name, email, password });

        const user = await handleRegister({ name, email, password });

        if (user?.success) {
            navigate('/login');
        }


    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-hidden flex items-center justify-center font-sans">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
            <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] mix-blend-screen"></div>

            <div className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row-reverse rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-2xl relative z-10">

                {/* Form Section */}
                <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center relative">
                    <div className="max-w-md mx-auto w-full space-y-8">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-6">
                                Join the Network
                            </span>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                Create an Account
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Enter your details to join our skill-sharing community.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 block">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                        placeholder="Jane Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                            </div>

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
                                <label className="text-sm font-medium text-slate-300 block">
                                    Password
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
                                Sign Up
                            </button>
                        </form>

                        <div className="text-center text-sm text-slate-400 mt-8">
                            Already have an account?{' '}
                            <a href="#" className="text-white font-semibold hover:text-indigo-400 transition-colors">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>

                {/* Visual Section */}
                <div className="hidden lg:flex flex-1 relative bg-indigo-900/20 overflow-hidden items-center justify-center p-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 z-0"></div>
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                        alt="Team collaboration"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />

                    <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-sm transform hover:scale-105 transition-transform duration-500">
                        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Share your expertise</h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Sign up today to connect with thousands of learners and experts. Your next great skill is just a conversation away.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RegisterPage;
