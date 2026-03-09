import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Standard Firebase login
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // Strict Admin check for Pramod's account
            // Note: In production, this should check a custom 'isAdmin' claim or a specific role field in the user document
            if (email === 'pramodraut04@gmail.com' || user.displayName === 'Pramod Raut') {
                navigate('/admin');
            } else {
                setError('Unauthorized access. This area is reserved for Super Admins.');
            }
        } catch (err) {
            setError('Invalid credentials. Please check your email and password.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 py-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl w-full max-w-md p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                        Admin Portal
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Secure Access Control
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 text-red-400 p-4 rounded-xl text-xs mb-8 border border-red-500/20 font-bold flex items-center gap-3"
                    >
                        <AlertCircle size={18} className="shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Administrator Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="email"
                                placeholder="name@winsizer.com"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Secure Passkey</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-[11px] mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Authenticate Session
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-500 hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em] mt-2"
                    >
                        Back to Public Site
                    </button>
                </form>
            </motion.div>

            <p className="absolute bottom-8 text-slate-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                Authorized Personnel Only • Winsizer Sec-Ops
            </p>
        </div>
    );
};

export default AdminLogin;
