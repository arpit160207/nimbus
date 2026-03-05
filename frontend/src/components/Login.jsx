import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { CloudUpload, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            if (isSignup) {
                const res = await fetch(`${API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: username,
                        password: password,
                        full_name: fullName
                    }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Signup failed');
                }

                setSuccessMsg('Account created successfully! Please sign in.');
                setIsSignup(false);
                setUsername('');
                setPassword('');
            } else {
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);

                const res = await fetch(`${API_BASE_URL}/login/access-token`, {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error('Invalid email or password');

                const data = await res.json();
                onLogin(data.access_token);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative p-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Elegant Background Accents */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-brand-500/10 to-transparent dark:from-brand-500/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="w-full max-w-[420px] bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/50 relative z-10"
            >
                <div className="p-8 sm:p-10">
                    {/* Brand Header */}
                    <div className="flex flex-col items-center justify-center mb-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="bg-brand-50 dark:bg-brand-500/10 p-4 rounded-2xl mb-5 shadow-sm text-brand-600 dark:text-brand-400"
                        >
                            <CloudUpload className="w-8 h-8" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                            {isSignup ? 'Create your account' : 'Sign in to Nimbus'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center mt-2.5 text-sm font-medium">
                            {isSignup ? 'Start organizing your files securely.' : 'Welcome back! Please enter your details.'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400 p-3 rounded-xl mb-6 text-sm flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span className="font-medium">{successMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence>
                            {isSignup && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    className="space-y-1.5"
                                >
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-sm"
                                            placeholder="John Doe"
                                            required={isSignup}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-sm"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 pb-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                {!isSignup && <a href="#" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500">Forgot?</a>}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-brand-600 dark:bg-brand-500 hover:bg-brand-700 dark:hover:bg-brand-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isSignup ? 'Create Account' : 'Sign In'}
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer Switcher */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-6 text-center">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                setSuccessMsg('');
                            }}
                            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-bold ml-1 hover:underline underline-offset-2 transition-all"
                        >
                            {isSignup ? 'Sign in' : 'Sign up'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
