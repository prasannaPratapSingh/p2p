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
                                className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-3 mt-4 transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:bg-indigo-400"
                            >
                                {isSubmitting && (
                                    <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                )}
                                {isSubmitting ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>

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
