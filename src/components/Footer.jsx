import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1A1A1A] text-slate-400 py-16 px-4 border-t border-white/5">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Winsizer Logo" className="h-10 w-auto" />
                        <h3 className="text-white text-2xl font-black tracking-tight">Winsizer</h3>
                    </div>
                    <p className="text-sm leading-relaxed font-medium">
                        India's leading marketplace for windows, glasswork, and specialized repair services. Connecting you with verified local experts.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Our Services</h4>
                    <ul className="space-y-3 text-sm font-bold">
                        <li><a href="/find-job" className="hover:text-primary transition-colors">Find Jobs</a></li>
                        <li><a href="/post-job" className="hover:text-primary transition-colors">Post a Job</a></li>
                        <li><a href="/list-shop" className="hover:text-primary transition-colors">List Your Shop</a></li>
                        <li><a href="/find-repair" className="hover:text-primary transition-colors">Repair Services</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support & Legal</h4>
                    <ul className="space-y-3 text-sm font-bold">
                        <li><a href="/about-us" className="hover:text-primary transition-colors">About Us</a></li>
                        <li><a href="/contact-us" className="hover:text-primary transition-colors">Contact Us</a></li>
                        <li><a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                        <li><a href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Get in Touch</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-center gap-3"><MapPin size={18} className="text-primary" /> India</li>
                        <li className="flex items-center gap-3"><Phone size={18} className="text-primary" /> +91 8530909059</li>
                        <li className="flex items-center gap-3"><Mail size={18} className="text-primary" /> winsizer.com@gmail.com</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Connect With Us</h4>
                    <div className="flex space-x-3">
                        <a href="#" className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/10"><Facebook size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/10"><Twitter size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/10"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 bg-white/5 rounded-md flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/10"><Linkedin size={18} /></a>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                <p>&copy; {new Date().getFullYear()} Winsizer Marketplace. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
