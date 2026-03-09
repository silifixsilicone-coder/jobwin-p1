import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldCheck, Database, CreditCard, UserCheck, Trash2 } from 'lucide-react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Information We Collect",
            icon: <Eye className="text-primary" size={24} />,
            content: "We collect basic user information such as: Your Name, Email Address, Phone Number, Location, and Business details. This information is necessary for the core functionality of the platform."
        },
        {
            title: "How We Use Information",
            icon: <Database className="text-primary" size={24} />,
            content: "The purpose of collecting this data is to improve our services, connect customers with relevant service providers, and facilitate secure payment processing for premium features."
        },
        {
            title: "Data Security",
            icon: <ShieldCheck className="text-primary" size={24} />,
            content: "We take your privacy seriously. Winsizer will never sell your personal information or data to third-party companies. We use standard encryption and security measures to protect your account information."
        },
        {
            title: "Third Party Services",
            icon: <CreditCard className="text-primary" size={24} />,
            content: "Secure payment processing is handled exclusively by Razorpay. We do not store your credit card or sensitive payment information on our servers. Razorpay complies with PCI-DSS standards."
        },
        {
            title: "User Rights",
            icon: <UserCheck className="text-primary" size={24} />,
            content: "You have the right to access, update, and correct your information through your profile settings. Users can request account deletion at any time by contacting our support team."
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
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Privacy Policy</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    <p className="text-slate-500 font-medium italic text-center w-3/4 mx-auto leading-relaxed">
                        "Your privacy and data security are the foundation of trust at Winsizer. We are committed to being transparent about how we handle your personal information."
                    </p>

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

                    <div className="bg-orange-50 p-6 rounded-md border border-orange-100 flex items-start gap-3">
                        <Trash2 className="text-primary mt-1" size={20} />
                        <div>
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-1">Account Deletion</h3>
                            <p className="text-sm text-slate-600 font-medium">To permanently delete your account and all associated data, please email winsizer.com@gmail.com with your registered user details.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
