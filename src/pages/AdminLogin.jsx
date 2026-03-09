import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import bcrypt from 'bcryptjs';

// Hardcoded Admin Credentials (Hashed)
const ADMIN_ID = 'admin_pramod';
const ADMIN_HASH = '$2b$10$HA04cnWvfLW4tjTOYdrUPu0xaGKNhByEfw2DFN952VBrKs1RGunk6';

const AdminLogin = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Check Admin ID first
            if (id !== ADMIN_ID) {
                throw new Error('Invalid Administrator ID');
            }

            // Verify Password using bcrypt
            const isMatch = await bcrypt.compare(password, ADMIN_HASH);

            if (isMatch) {
                // Set Session Storage for persistence
                sessionStorage.setItem('adminToken', 'winsizer_admin_session_' + Date.now());
                sessionStorage.setItem('adminId', ADMIN_ID);

                // Redirect to Admin Panel
                navigate('/admin');
            } else {
                throw new Error('Incorrect Password');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4 py-12 relative overflow-hidden">
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
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter text-center">
                        Winsizer Admin
                    </h2>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">
                        Secure System Access
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
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Admin ID</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter ID (e.g. admin_pramod)"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-600 text-sm"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">Master Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none font-bold placeholder:text-slate-600 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-[11px] mt-4 shadow-orange-500/20"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Unlock Command Center
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-500 hover:text-white transition-all font-black uppercase text-[8px] tracking-[0.2em] mt-2"
                    >
                        Return to Public View
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
