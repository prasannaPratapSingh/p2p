import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hook/auth.hook';

type RegisterFormValues = {
    name: string;
    email: string;
    password: string;
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const { handleRegister } = useAuth();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>();
    const [backendError, setBackendError] = useState<string | null>(null);

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:4001/api/auth/google';
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setBackendError(null);

        try {
            console.log('Registration attempt', data);
            const user = await handleRegister(data) as any;

            if (user) {
                navigate('/login');
            }
        } catch (error: any) {
            const backendErrors = error?.response?.data?.errors;

            if (Array.isArray(backendErrors)) {
                backendErrors.forEach((backendErrorItem: any) => {
                    const fieldName = backendErrorItem.path?.[1] || backendErrorItem.path?.[0] || 'form';
                    const validFieldNames = ['name', 'email', 'password'];
                    if (validFieldNames.includes(fieldName)) {
                        setError(fieldName, {
                            type: 'server',
                            message: backendErrorItem.message || 'Invalid value',
                        });
                    } else {
                        setBackendError(backendErrorItem.message || 'Invalid input.');
                    }
                });
                return;
            }

            setBackendError(error?.response?.data?.message || error?.message || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-hidden flex items-center justify-center font-sans">
            <div className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row-reverse rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-2xl relative z-10">

                {/* Form Section */}
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
                                Join the Network
                            </span>
                            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                                Create an Account
                            </h1>
                            <p className="text-slate-400 text-sm">
                                Enter your details to join our skill-sharing community.
                            </p>
                        </div>

                        {backendError && (
                            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {backendError}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 block">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        {...register('name', { required: 'Name is required' })}
                                        placeholder="Jane Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                                {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 block">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Please enter a valid email address',
                                            },
                                        })}
                                        placeholder="you@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                                {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-300 block">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: { value: 7, message: 'Password must be at least 7 characters' },
                                        })}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 group-hover:border-white/20"
                                    />
                                </div>
                                {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-indigo-400 hover:cursor-pointer"
                            >
                                {isSubmitting && (
                                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                )}
                                {isSubmitting ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase tracking-wider font-medium">or</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 hover:cursor-pointer"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className="text-center text-sm text-slate-400 mt-8">
                            Already have an account?{' '}
                            <Link to="/login" className="text-white font-semibold hover:text-indigo-400 transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Visual Section */}
                <div className="hidden lg:flex flex-1 relative bg-indigo-900/20 overflow-hidden items-center justify-center p-12">
                    <div className="absolute inset-0 bg-indigo-900/40 z-0"></div>
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
