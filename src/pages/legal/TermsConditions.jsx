import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, ShieldCheck, CreditCard, UserX, Clock } from 'lucide-react';

const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "1. Introduction",
            icon: <Scale className="text-primary" size={24} />,
            content: "Welcome to Winsizer. Our platform connects customers with professionals specializing in aluminium windows, glass work, fabrication services, repair services, and shop listings. By using our website, you agree to these terms."
        },
        {
            title: "2. User Responsibilities",
            icon: <ShieldCheck className="text-primary" size={24} />,
            content: "Users must provide accurate and truthful information during registration and while posting services. You are solely responsible for the content you upload and the interactions you have with other users on the platform."
        },
        {
            title: "3. Job Posting & Service Rules",
            icon: <Clock className="text-primary" size={24} />,
            content: "Winsizer is a connector, not a service provider. We do not guarantee the quality of work performed by third-party professionals. Any disputes regarding workmanship or payments between users must be resolved independently."
        },
        {
            title: "4. Payment Terms",
            icon: <CreditCard className="text-primary" size={24} />,
            content: "Payments for premium listings, subscriptions, or featured services are processed securely via Razorpay. All fees are subject to current platform rules and must be paid in full to activate the associated digital services."
        },
        {
            title: "5. Account Termination",
            icon: <UserX className="text-primary" size={24} />,
            content: "Misuse of the platform, including but not limited to fraud, spam, harassment, or illegal activities, will result in immediate account suspension or permanent termination at our sole discretion."
        },
        {
            title: "6. Policy Updates",
            icon: <Clock className="text-primary" size={24} />,
            content: "Winsizer reserves the right to update or modify these terms and conditions at any time without prior notice. Continued use of the platform after updates constitutes acceptance of the new terms."
        }
    ];

    return (
        <div className="min-h-screen bg-light-grey py-20 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="bg-[#1A1A1A] p-10 text-white text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Terms & Conditions</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    {sections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <div className="flex items-center gap-3">
                                {section.icon}
                                <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight">{section.title}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed font-medium pl-9">
                                {section.content}
                            </p>
                        </div>
                    ))}

                    <div className="pt-10 border-t border-slate-100 italic text-slate-400 text-sm text-center font-medium">
                        For any queries regarding our terms, please contact us at winsizer.com@gmail.com
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsConditions;
