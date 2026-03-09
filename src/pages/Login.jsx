import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Chrome, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('Contractor'); // Default role
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, name, role);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Authentication failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            setError('Google login failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-light-grey px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md p-10 rounded-md shadow-xl border border-slate-200"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 uppercase tracking-tighter">
                        {isLogin ? 'Member Login' : 'Create Account'}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {isLogin
                            ? 'Access your Winsizer portal'
                            : 'Start your journey with Winsizer'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm mb-6 border border-red-100 font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    {!isLogin && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">I am a...</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Contractor', 'Service Provider', 'Worker'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2.5 rounded-md text-[10px] font-black uppercase tracking-tight transition-all border ${role === r
                                            ? 'bg-primary border-primary text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-primary/50'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="w-full pl-12 pr-4 py-3.5 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-md shadow-lg transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-sm"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Login Now' : 'Join Winsizer'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-xs font-black uppercase tracking-widest">Or</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-md hover:bg-light-grey transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                    >
                        <Chrome className="w-5 h-5 text-primary" />
                        Sign in with Google
                    </button>
                </div>

                <p className="text-center mt-10 text-slate-500 text-sm font-bold">
                    {isLogin ? "New here? " : "Already registered? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:underline font-black"
                    >
                        {isLogin ? 'Create Account' : 'Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
