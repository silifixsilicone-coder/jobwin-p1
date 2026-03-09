import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Find Jobs', path: '/find-job' },
        { name: 'Find Workers', path: '/find-workers' },
        { name: 'Browse Shops', path: '/find-shop' },
        { name: 'Repair Services', path: '/find-repair' },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="bg-[#1A1A1A] border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-3xl font-black text-white hover:text-primary transition-colors">
                            Winsizer
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-white hover:text-primary transition-all font-bold text-sm tracking-tight"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 bg-white/10 pl-2 pr-4 py-1.5 rounded-md border border-white/10 hover:border-primary transition-all group active:scale-95"
                                >
                                    <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight">{user.name?.split(' ')[0]}</span>
                                    <ChevronDown className={`w-4 h-4 text-white/50 group-hover:text-primary transition-all ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-white rounded-md shadow-2xl border border-slate-100 p-2 overflow-hidden"
                                        >
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-orange-50 hover:text-primary rounded-md transition-all"
                                            >
                                                <LayoutDashboard size={18} /> Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-md transition-all"
                                            >
                                                <LogOut size={18} /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-primary text-white px-8 py-3 rounded-md text-sm font-bold hover:bg-primary-dark transition-all shadow-xl active:scale-95 flex items-center gap-2"
                            >
                                Get Started
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-primary p-2 transition-colors"
                        >
                            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#1A1A1A] border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-8 space-y-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-4 py-4 rounded-md text-base font-bold text-white hover:text-primary hover:bg-white/5 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-4 rounded-md text-base font-bold text-primary hover:bg-white/5 transition-all"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-4 rounded-md text-base font-bold text-red-500"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block px-4 py-5 rounded-md text-center text-lg font-bold bg-primary text-white shadow-xl"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login / Sign Up
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
