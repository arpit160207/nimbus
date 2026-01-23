import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            if (isSignup) {
                // Handle Signup
                const res = await fetch('http://localhost:8000/api/v1/signup', {
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

                setSuccessMsg('Account created! Please sign in.');
                setIsSignup(false);
            } else {
                // Handle Login
                const formData = new FormData();
                formData.append('username', username);
                formData.append('password', password);

                const res = await fetch('http://localhost:8000/api/v1/login/access-token', {
                    method: 'POST',
                    body: formData,
                });

                if (!res.ok) throw new Error('Invalid credentials');

                const data = await res.json();
                onLogin(data.access_token);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative z-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 pointer-events-none"></div>

            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-96 border border-slate-700 relative z-10">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2 text-center">
                    {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-400 text-center mb-8 text-sm">
                    {isSignup ? 'Join Nimbus Cloud Drive' : 'Sign in to access your files'}
                </p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-2 rounded mb-4 text-sm text-center">{error}</div>}
                {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-2 rounded mb-4 text-sm text-center">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all">
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => {
                            setIsSignup(!isSignup);
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                    >
                        {isSignup ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
