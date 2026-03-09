import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Wrench, Info, MapPin, Phone, Send, CheckCircle2, User, Plus, X, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RepairService = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cityInput, setCityInput] = useState('');

    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        serviceName: '',
        description: '',
        serviceCities: [], // Array for multiple locations
        whatsappNumber: '',
        contactNumber: '',
    });

    const addCity = () => {
        if (cityInput.trim() && formData.serviceCities.length < 5 && !formData.serviceCities.includes(cityInput.trim().toLowerCase())) {
            setFormData({
                ...formData,
                serviceCities: [...formData.serviceCities, cityInput.trim().toLowerCase()]
            });
            setCityInput('');
        }
    };

    const removeCity = (cityToRemove) => {
        setFormData({
            ...formData,
            serviceCities: formData.serviceCities.filter(city => city !== cityToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.serviceCities.length === 0) {
            alert("Please select at least one city.");
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, 'repairs'), {
                ...formData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error("Error listing service:", error);
            alert("Failed to register service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 bg-light-grey min-h-screen">
            <AnimatePresence>
                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-12 rounded-md shadow-xl text-center flex flex-col items-center border border-slate-100"
                    >
                        <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Registration Complete!</h2>
                        <p className="text-slate-500 mb-8 font-medium">Your repair specialist profile is now active in your selected cities.</p>
                        <div className="flex items-center gap-2 text-primary font-bold animate-pulse uppercase text-xs tracking-widest">
                            <Loader2 className="animate-spin" size={18} /> Redirecting to dashboard...
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Register as Repair Specialist</h1>
                            <p className="text-slate-500 font-medium">Provide your business details and service areas to start receiving leads.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-md shadow-lg border border-slate-200 space-y-10">

                            {/* Provider Profile Info */}
                            <div className="bg-light-grey p-8 rounded-md border border-slate-100 space-y-8">
                                <h3 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 uppercase tracking-tight">
                                    <User size={20} className="text-primary" /> Specialist Profile
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name / Business Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Rahul Window Solutions"
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="10-digit mobile"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                value={formData.contactNumber}
                                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <MessageCircle size={14} className="text-emerald-500" /> WhatsApp Number
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="For customer chat"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                value={formData.whatsappNumber}
                                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                                        <Wrench size={18} className="text-primary" /> Specialist Service Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Premium Aluminium Window & Glass Repair"
                                        required
                                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-[#1A1A1A]"
                                        value={formData.serviceName}
                                        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                                    />
                                </div>

                                {/* Multiple Location Support */}
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                                        <MapPin size={18} className="text-primary" /> Service Cities (Up to 5)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type city and click plus..."
                                            className="flex-1 px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold text-[#1A1A1A]"
                                            value={cityInput}
                                            onChange={(e) => setCityInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                                        />
                                        <button
                                            type="button"
                                            onClick={addCity}
                                            className="bg-[#1A1A1A] text-white p-4 rounded-md hover:bg-primary transition-all active:scale-95"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.serviceCities.map(city => (
                                            <span
                                                key={city}
                                                className="bg-primary text-white px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm animate-in zoom-in-75 duration-200"
                                            >
                                                {city}
                                                <button type="button" onClick={() => removeCity(city)} className="hover:text-[#1A1A1A] transition-colors"><X size={14} /></button>
                                            </span>
                                        ))}
                                        {formData.serviceCities.length === 0 && (
                                            <p className="text-xs text-slate-400 font-medium italic">No cities added yet. Enter a city name above.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                                        <Info size={18} className="text-primary" /> Expertise Description
                                    </label>
                                    <textarea
                                        placeholder="Detail your repair skills, experience, and why customers should choose you..."
                                        required
                                        rows="6"
                                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-medium leading-relaxed"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-md shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99] uppercase tracking-widest text-sm"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Registering...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> Register as Repair Specialist
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RepairService;
