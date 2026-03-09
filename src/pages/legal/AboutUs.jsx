import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, Briefcase, Store, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            title: "Easy Job Posting",
            icon: <Briefcase size={28} className="text-primary" />,
            description: "Contractors and customers can post detailed job requirements to find skilled fabricators."
        },
        {
            title: "Service Provider Listings",
            icon: <Users size={28} className="text-primary" />,
            description: "Professionals can showcase their expertise and portfolio to attract high-value clients."
        },
        {
            title: "Repair Service Discovery",
            icon: <Wrench size={28} className="text-primary" />,
            description: "Quickly find local technicians for window repairs and glass replacements."
        },
        {
            title: "Local Shop Visibility",
            icon: <Store size={28} className="text-primary" />,
            description: "Glass and aluminium shops can list their physical locations for neighborhood customers."
        }
    ];

    return (
        <div className="min-h-screen bg-light-grey">
            {/* Hero Section */}
            <div className="bg-[#1A1A1A] text-white py-32 px-4 text-center">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-8">
                    <h1 className="text-6xl font-black uppercase tracking-tighter leading-none px-4">The Bridge Between Customers & <span className="text-primary underline decoration-primary/20 underline-offset-8">Fabricators</span>.</h1>
                    <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                        Winsizer is a specialized ecosystem designed to streamline the work of aluminium window professionals, glass installation experts, and fabrication industries across the region.
                    </p>
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 font-black uppercase tracking-widest text-[10px]">
                        <Link to="/login" className="bg-primary text-white px-10 py-5 rounded-md hover:scale-105 transition-transform shadow-xl w-full sm:w-auto">Join the Network</Link>
                        <Link to="/find-job" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-md hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2">Explore Jobs <ArrowRight size={14} /></Link>
                    </div>
                </motion.div>
            </div>

            {/* Core Mission */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-6">Our Mission to Digitize Hardware.</h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                            The goal of Winsizer is to make it easy for customers to find trusted service providers and for professionals to grow their business online. We believe that the fabrication industry deserves a modern, digital tool that reduces frictions and enhances growth.
                        </p>
                        <ul className="space-y-4 font-bold text-slate-800">
                            <li className="flex items-center gap-3"><LayoutGrid size={18} className="text-primary" /> Multi-city service reach</li>
                            <li className="flex items-center gap-3"><LayoutGrid size={18} className="text-primary" /> Verified technician directory</li>
                            <li className="flex items-center gap-3"><LayoutGrid size={18} className="text-primary" /> Integrated payment security</li>
                        </ul>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-2 rounded-md shadow-2xl overflow-hidden border border-slate-200">
                        <div className="bg-slate-50 rounded p-12 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-7xl font-black text-[#1A1A1A] mb-2 leading-none tracking-tight">Winsizer</p>
                                <p className="text-primary font-black uppercase tracking-[0.5em] text-[10px]">Since 2026</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-10 rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="mb-6 bg-light-grey p-5 rounded-md w-fit group-hover:bg-primary/10 transition-colors">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight mb-4">{benefit.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Final */}
            <div className="py-24 bg-[#1A1A1A] text-white overflow-hidden relative">
                <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-tight">Ready to scale your <span className="text-primary">Aluminium</span> or <span className="text-primary">Glass</span> business?</h2>
                    <Link to="/login" className="inline-block bg-primary text-white px-12 py-6 rounded-md font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-transform">Get Started Free</Link>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48 blur-3xl text-right overflow-hidden" />
            </div>
        </div>
    );
};

export default AboutUs;
