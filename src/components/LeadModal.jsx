import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { X, Send, CheckCircle2, Loader2, Phone, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeadModal = ({ isOpen, onClose, targetItem, type }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        message: '',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to send inquiries.");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'leads'), {
                ...formData,
                senderId: user.uid,
                senderEmail: user.email,
                receiverId: targetItem.userId,
                targetId: targetItem.id,
                targetTitle: targetItem.title || targetItem.shopName || targetItem.serviceName,
                type: type, // 'job', 'shop', 'repair'
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2500);
        } catch (error) {
            console.error("Error sending lead:", error);
            alert("Failed to send inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="bg-green-100 p-4 rounded-full text-green-600 inline-block mb-6 animate-bounce">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Sent!</h3>
                            <p className="text-slate-500">The owner will receive your contact details and message shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Send Inquiry</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    You are inquiring about: <span className="text-blue-600 font-semibold">{targetItem.title || targetItem.shopName || targetItem.serviceName}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. +91 98765 43210"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-4 text-slate-300" size={18} />
                                        <textarea
                                            required
                                            rows="3"
                                            placeholder="Ask about pricing, availability, or details..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LeadModal;
