import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { UserPlus, Plus, CheckCircle2, MessageCircle, MapPin, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerProfileForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cityInput, setCityInput] = useState('');

    const [profileData, setProfileData] = useState({
        expertise: user?.expertise || '',
        whatsappNumber: user?.whatsappNumber || '',
        serviceCities: user?.serviceCities || []
    });

    const addCity = () => {
        if (cityInput.trim() && profileData.serviceCities.length < 5 && !profileData.serviceCities.includes(cityInput.trim().toLowerCase())) {
            setProfileData({ ...profileData, serviceCities: [...profileData.serviceCities, cityInput.trim().toLowerCase()] });
            setCityInput('');
        }
    };

    const removeCity = (c) => {
        setProfileData({ ...profileData, serviceCities: profileData.serviceCities.filter(city => city !== c) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...profileData,
                role: 'Worker', // Ensure role is set to Worker when submitting this form
                updatedAt: new Date().toISOString()
            });
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-md shadow-sm text-center flex flex-col items-center border border-slate-100"
            >
                <div className="bg-primary text-white p-4 rounded-full mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Success!</h2>
                <p className="text-slate-500 mb-8 font-medium">Your worker profile is now live. Contractors can find you in the directory.</p>
                <button onClick={() => setSuccess(false)} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Edit Profile Again</button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-md shadow-sm border border-slate-200 space-y-10">
            <div className="bg-[#1A1A1A] p-8 rounded-md text-white shadow-lg space-y-6">
                <div className="bg-primary w-12 h-12 rounded-md flex items-center justify-center"><UserPlus size={24} /></div>
                <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Become a Specialist</h3>
                    <p className="text-slate-400 font-medium text-sm leading-relaxed"> Register as a worker to start receiving job offers from premium contractors. </p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} className="text-primary" /> Area of Expertise
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Aluminium Window Specialist, Glass Installer"
                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                        value={profileData.expertise}
                        onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MessageCircle size={14} className="text-emerald-500" /> WhatsApp Number
                    </label>
                    <input
                        type="tel"
                        placeholder="For contractor leads"
                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                        value={profileData.whatsappNumber}
                        onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-primary" /> Service Cities (Max 5)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add city name..."
                            className="flex-1 px-5 py-4 bg-light-grey border border-slate-200 rounded-md outline-none font-bold text-slate-800"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                        />
                        <button type="button" onClick={addCity} className="bg-[#1A1A1A] text-white px-5 rounded-md hover:bg-primary transition-all">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profileData.serviceCities.map(c => (
                            <span key={c} className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-md uppercase flex items-center gap-2 shadow-sm">
                                {c} <Plus className="rotate-45 cursor-pointer hover:text-[#1A1A1A] transition-colors" size={14} onClick={() => removeCity(c)} />
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-md shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99] uppercase tracking-widest text-sm"
            >
                {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
                {loading ? 'Processing...' : 'Register as Specialist Worker'}
            </button>
        </form>
    );
};

export default WorkerProfileForm;
