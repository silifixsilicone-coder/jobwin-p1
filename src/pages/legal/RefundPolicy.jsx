import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, CreditCard, Clock, FileText, CheckCircle } from 'lucide-react';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Digital Services Policy",
            icon: <FileText className="text-primary" size={24} />,
            content: "Winsizer provides digital services such as job listings, shop listings, and premium visibility options. These services are activated instantly upon successful payment."
        },
        {
            title: "Non-Refundable Payments",
            icon: <CreditCard className="text-primary" size={24} />,
            content: "Generally, payments made for subscriptions or listings are non-refundable. However, we may consider a refund if the payment was successfully deducted but the associated service was not activated within 24 hours."
        },
        {
            title: "Refund Exceptions",
            icon: <CheckCircle className="text-primary" size={24} />,
            content: "Refunds may be processed in the following cases: Duplicate payments for the same service or technical error preventing activation of the purchased feature."
        },
        {
            title: "Refund Request Timeline",
            icon: <Clock className="text-primary" size={24} />,
            content: "Refund requests must be submitted within 5 working days of the transaction via our Contact Us page. Please include your Transaction ID and a brief description of the issue."
        },
        {
            title: "Processing Time",
            icon: <RefreshCcw className="text-primary" size={24} />,
            content: "After review and approval, refunds will be credited back to the original payment method through the Razorpay gateway within 7 to 10 working days."
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
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Refund & Cancellation</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">Last Updated: March 2026</p>
                </div>

                <div className="p-8 md:p-12 space-y-12">
                    <div className="bg-primary/5 p-8 rounded-md border border-primary/10 text-center space-y-4">
                        <CreditCard className="mx-auto text-primary" size={32} />
                        <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight">Service Commitment</h2>
                        <p className="text-slate-500 font-medium">We aim to provide consistent service. If you encounter any issues with payment or activation, our support team is ready to assist you.</p>
                    </div>

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

                    <div className="pt-10 border-t border-slate-100 flex flex-col items-center">
                        <p className="text-sm font-bold text-slate-400 italic mb-6">"Direct digital products, once accessed, are non-cancellable by nature."</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RefundPolicy;
