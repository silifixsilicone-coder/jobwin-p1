import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Store, Wrench, FilePlus, ChevronRight, Search, UserPlus, ShieldCheck, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import RequestServiceModal from '../components/RequestServiceModal';

const Home = () => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const { user } = useAuth();

    const actionCards = [
        {
            title: 'Find Job',
            description: 'Discover work opportunities in window and glass installation.',
            icon: <Briefcase className="w-8 h-8 text-primary" />,
            path: '/find-job',
        },
        {
            title: 'Post Job',
            description: 'List your requirements and find expert technicians quickly.',
            icon: <FilePlus className="w-8 h-8 text-primary" />,
            path: user ? '/dashboard?tab=post_job' : '/login',
        },
        {
            title: 'List Shop',
            description: 'Register your glass or aluminium shop to get more customers.',
            icon: <Store className="w-8 h-8 text-primary" />,
            path: user ? '/dashboard?tab=my_services' : '/login',
        },
        {
            title: 'Repair Service',
            description: 'Professional repair services for all your window needs.',
            icon: <Wrench className="w-8 h-8 text-primary" />,
            path: user ? '/dashboard?tab=my_services' : '/login',
        },
        {
            title: 'Find Workers',
            description: 'Connect with verified technicians for your projects.',
            icon: <UserPlus className="w-8 h-8 text-primary" />,
            path: '/find-workers',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-light-grey">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#1A1A1A] py-24 sm:py-32">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-8"
                    >
                        Window Problems? <br />
                        <span className="text-primary tracking-tight">We Fix It All.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-white/70 max-w-2xl mx-auto mb-12 font-medium"
                    >
                        Connect with 5,000+ verified glass and aluminium experts. From sliding repairs to new installations, get it done right.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button
                            onClick={() => setIsRequestModalOpen(true)}
                            className="bg-primary text-white font-bold py-4 px-10 rounded-md shadow-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 transition-all group"
                        >
                            <Search size={20} /> Post Your Requirement
                        </button>
                        <Link to="/find-job" className="bg-white/10 text-white border border-white/20 font-bold py-4 px-10 rounded-md hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                            Browse Opportunities <ChevronRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Justdial Style Quick Search */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 tracking-[0.2em]">Trending Services</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {['Window Repair', 'Glass Work', 'Mosquito Net', 'Aluminium Partition', 'Sealing'].map(s => (
                            <button key={s} onClick={() => setIsRequestModalOpen(true)} className="px-5 py-2.5 rounded-md bg-light-grey border border-slate-200 text-sm font-bold text-slate-600 hover:border-primary hover:text-primary transition-all">
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Action Cards Grid */}
            <section className="py-24 bg-light-grey">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Main Services</h2>
                            <p className="text-slate-500 font-bold mt-2">Explore the Winsizer ecosystem</p>
                        </div>
                        <div className="hidden md:block h-1 w-24 bg-primary rounded-full mb-2" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {actionCards.map((card, index) => (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link to={card.path} className="block h-full p-8 rounded-md bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                                    <div className="bg-light-grey p-5 rounded-md inline-block mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                                        {card.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{card.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                        {card.description}
                                    </p>
                                    <div className="flex items-center text-sm font-bold text-primary gap-1 group-hover:translate-x-2 transition-transform">
                                        Open Marketplace <ChevronRight size={16} />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {[
                            { val: '5,000+', label: 'Verified Partners' },
                            { val: '150+', label: 'Cities Covered' },
                            { val: '25k+', label: 'Leads Delivered' },
                            { val: '4.8★', label: 'Average Rating' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl sm:text-5xl font-black text-slate-900 mb-3 tracking-tighter">{stat.val}</p>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest tracking-[0.2em]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Winsizer? */}
            <section className="py-24 bg-light-grey">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Why Choose Winsizer?</h2>
                        <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                                title: "100% Verified Partners",
                                text: "Every technician on our platform undergoes a strict manual verification process for your peace of mind."
                            },
                            {
                                icon: <Zap className="w-10 h-10 text-primary" />,
                                title: "Instant Response",
                                text: "Get contacted by multiple qualified service providers within hours of posting your requirement."
                            },
                            {
                                icon: <Globe className="w-10 h-10 text-primary" />,
                                title: "Pan-India Reach",
                                text: "Access thousands of experts across 150+ cities in India, from metro hubs to regional centers."
                            }
                        ].map((pos, idx) => (
                            <div key={idx} className="p-8 rounded-md bg-white border border-slate-100 hover:shadow-lg transition-all">
                                <div className="mb-6">{pos.icon}</div>
                                <h3 className="text-xl font-black text-slate-900 mb-4">{pos.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{pos.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Get Started CTA */}
            {!user && (
                <section className="py-24 bg-[#1A1A1A]">
                    <div className="max-w-5xl mx-auto px-4 text-center">
                        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase mb-8 leading-none">Ready to Build Something <br /><span className="text-primary">Great Quality?</span></h2>
                        <p className="text-white/60 text-lg font-medium mb-12 max-w-2xl mx-auto">Join the India's largest network of window and glass industry professionals. Start your journey today.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-12 py-5 rounded-md font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95">Get Started Now</Link>
                            <Link to="/find-workers" className="bg-white/5 border border-white/20 hover:bg-white/10 text-white px-12 py-5 rounded-md font-black uppercase tracking-widest text-sm transition-all active:scale-95">Explore Directory</Link>
                        </div>
                    </div>
                </section>
            )}

            <RequestServiceModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
        </div>
    );
};

export default Home;
