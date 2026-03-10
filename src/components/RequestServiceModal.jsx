import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { X, Send, CheckCircle2, User, Phone, MapPin, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RequestServiceModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        mobileNumber: '',
        city: '',
        area: '',
        serviceCategory: 'Sliding Window Repair',
        description: ''
    });

    if (!isOpen) return null;

    const categories = [
        'Sliding Window Repair',
        'Glass Replacement',
        'Aluminium Partitioning',
        'Mosquito Net Installation',
        'Window Sealing/Waterproofing',
        'New Window Installation',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'service_requests'), {
                ...formData,
                city: formData.city.trim().toLowerCase(), // Normalize for matching
                createdAt: new Date().toISOString(),
                status: 'open'
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setFormData({ customerName: '', mobileNumber: '', city: '', area: '', serviceCategory: 'Sliding Window Repair', description: '' });
            }, 3000);
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto pt-10 pb-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-[95%] sm:w-full max-w-[450px] mx-auto rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative border border-slate-100"
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="p-6 sm:p-12">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2">Requirement Sent!</h2>
                            <p className="text-slate-500">Service providers in your area will contact you shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 sm:mb-10">
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                                    <Search className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" /> Post Requirement
                                </h2>
                                <p className="text-slate-400 sm:text-slate-500 mt-2 font-medium text-xs sm:text-sm">Get competitive quotes from local glass & aluminium experts.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Your Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                required
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 text-sm sm:text-base box-border"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                required
                                                type="tel"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 text-sm sm:text-base box-border"
                                                value={formData.mobileNumber}
                                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">City</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. Pune"
                                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 text-sm sm:text-base box-border"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Area/Locality</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Kothrud"
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 text-sm sm:text-base box-border"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Service Category</label>
                                    <select
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.25rem] text-sm sm:text-base box-border"
                                        value={formData.serviceCategory}
                                        onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Describe Problem</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="e.g. Balcony sliding window is stuck, need wheel replacement..."
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700 resize-none text-sm sm:text-base box-border"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            Find Service Providers <Send size={18} className="group-hover:translate-x-1 transition-transform" />
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

export default RequestServiceModal;
