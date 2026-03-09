import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, Store } from 'lucide-react';

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Form submission logic would go here
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-light-grey py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden"
                >
                    {/* Contact Info Sidebar */}
                    <div className="bg-[#1A1A1A] p-12 text-white flex flex-col justify-between">
                        <div>
                            <div className="bg-primary w-16 h-1 bg-white mb-8" />
                            <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">Get In <span className="text-primary">Touch</span>.</h1>
                            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-12">
                                For inquiries about our aluminium window services, shop listings, or premium payment processing issues, reach out to our dedicated support team.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="bg-white/5 p-4 rounded-md border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                        <Mail className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">General Inquiries</p>
                                        <p className="text-xl font-bold">winsizer.com@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="bg-white/5 p-4 rounded-md border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                        <Phone className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Support</p>
                                        <p className="text-xl font-bold">+91 8530909059</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="bg-white/5 p-4 rounded-md border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                                        <Store className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Business Name</p>
                                        <p className="text-xl font-bold">Winsizer Platform</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 mt-12 border-t border-white/5 flex gap-4">
                            <div className="p-3 bg-white/5 rounded hover:bg-primary/20 transition-all"><MapPin size={20} /></div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center">Headquarters: India</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-12">
                        {submitted ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="bg-green-100 text-green-600 p-8 rounded-full mb-8">
                                    <Send size={48} />
                                </div>
                                <h3 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tighter mb-4">Message Sent!</h3>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">Thank you for reaching out to Winsizer. We will get back to you within 24–48 hours at your registered email address.</p>
                                <button onClick={() => setSubmitted(false)} className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline">Send another message</button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-6 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="example@yourdomain.com"
                                        className="w-full px-6 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Reason for Inquiry</label>
                                    <select className="w-full px-6 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800 transition-all">
                                        <option value="general">General Support</option>
                                        <option value="payment">Payment/Refund Inquiry</option>
                                        <option value="listing">Shop Listing Issue</option>
                                        <option value="job">Work Posting Inquiry</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Detailed Message</label>
                                    <textarea
                                        required
                                        rows="6"
                                        placeholder="How can we help your business today?"
                                        className="w-full px-6 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-medium text-slate-800 resize-none transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1A1A1A] hover:bg-primary text-white font-black py-5 rounded-md transition-all flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    {loading ? 'Submitting Form...' : 'Transmit Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactUs;
