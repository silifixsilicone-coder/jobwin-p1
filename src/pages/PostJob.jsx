import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { FilePlus, MapPin, Phone, IndianRupee, AlignLeft, Send, CheckCircle2, User, Loader2, Camera, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PostJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        contactNumber: '',
        whatsappNumber: '',
        recruiterName: user?.name || '',
        salaryMin: '',
        salaryMax: '',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let profilePhotoUrl = '';

            if (imageFile) {
                const storageRef = ref(storage, `recruiter_profiles/${user.uid}_${Date.now()}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                profilePhotoUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, 'jobs'), {
                ...formData,
                profilePhotoUrl,
                userId: user.uid,
                createdAt: new Date().toISOString(),
            });

            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            console.error("Error posting job:", error);
            alert("Failed to post job. Please try again.");
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
                        <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Job Published!</h2>
                        <p className="text-slate-500 mb-8 font-medium">Your listing is now live on the Winsizer network.</p>
                        <div className="flex items-center gap-2 text-primary font-bold animate-pulse uppercase text-xs tracking-widest">
                            <Loader2 className="animate-spin" size={18} /> Redirecting...
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Post a New Job</h1>
                            <p className="text-slate-500 font-medium">Connect with India's best window technicians.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-md shadow-lg border border-slate-200 space-y-10">

                            {/* Recruiter Section */}
                            <div className="bg-light-grey p-8 rounded-md border border-slate-100">
                                <h3 className="text-lg font-black text-[#1A1A1A] mb-8 flex items-center gap-2 uppercase tracking-tight">
                                    <User size={20} className="text-primary" /> Recruiter Identity
                                </h3>
                                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-slate-900">
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-md bg-white overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={40} className="text-slate-300" />
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2.5 rounded-md cursor-pointer shadow-lg hover:bg-primary-dark transition-all active:scale-90 border-2 border-white">
                                            <Camera size={16} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </label>
                                    </div>
                                    <div className="flex-1 w-full space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                value={formData.recruiterName}
                                                onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Contact</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="+91"
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                    value={formData.contactNumber}
                                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    WhatsApp Hotline
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="WhatsApp active number"
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                    value={formData.whatsappNumber}
                                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Details Section */}
                            <div className="space-y-8 text-[#1A1A1A]">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                        <FilePlus size={18} className="text-primary" /> Requirement Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sliding Window Repair Specialist Needed"
                                        required
                                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                            <MapPin size={18} className="text-primary" /> Precise Location
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="City, Locality"
                                            required
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                            <IndianRupee size={18} className="text-primary" /> Budget Range (₹)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                required
                                                className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                value={formData.salaryMin}
                                                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                            />
                                            <span className="text-slate-300 font-bold">to</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                required
                                                className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-bold"
                                                value={formData.salaryMax}
                                                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                        <AlignLeft size={18} className="text-primary" /> Detailed Description
                                    </label>
                                    <textarea
                                        placeholder="Explain the scope of work, timeline, and candidate requirements..."
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
                                        <Loader2 className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> Publish Listing Now
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

export default PostJob;
