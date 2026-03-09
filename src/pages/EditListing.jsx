import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, CheckCircle2, User, MessageCircle, IndianRupee, MapPin, Plus, X, Store, Wrench, Info } from 'lucide-react';

const EditListing = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({});
    const [cityInput, setCityInput] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const docRef = doc(db, type, id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    alert("Listing not found.");
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [type, id, navigate]);

    const addCity = () => {
        const cities = formData.serviceCities || [];
        if (cityInput.trim() && cities.length < 5 && !cities.includes(cityInput.trim().toLowerCase())) {
            setFormData({
                ...formData,
                serviceCities: [...cities, cityInput.trim().toLowerCase()]
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
        setUpdating(true);
        try {
            await updateDoc(doc(db, type, id), {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error("Error updating listing:", error);
            alert("Failed to update listing.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-slate-300 font-bold uppercase tracking-widest bg-light-grey">
            <Loader2 className="w-16 h-16 animate-spin mb-4 text-primary" />
            <p>Loading Details...</p>
        </div>
    );

    const isJob = type === 'jobs';
    const isShop = type === 'shops';
    const isRepair = type === 'repairs';

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 bg-light-grey min-h-screen">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 font-black uppercase text-[10px] tracking-widest transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Management
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Edit {isJob ? 'Job' : isShop ? 'Business' : 'Service'}</h1>
                    <p className="text-slate-500 font-medium">Keep your professional profile across Winsizer accurate and up to date.</p>
                </div>

                {success ? (
                    <div className="bg-white p-12 rounded-md shadow-xl text-center flex flex-col items-center border border-slate-100">
                        <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-[#1A1A1A] mb-2 uppercase tracking-tighter">Changes Saved!</h2>
                        <p className="text-slate-500 font-medium">Updating your public listing...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-md shadow-lg border border-slate-200 space-y-10">

                        {/* Profile Identity Section */}
                        <div className="bg-light-grey p-8 rounded-md border border-slate-100 space-y-8">
                            <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2">
                                <User size={18} className="text-primary" /> {isJob ? 'Recruiter Identity' : 'Provider Identity'}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name / Business Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                        value={formData.fullName || formData.recruiterName || formData.ownerName || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (isJob) setFormData({ ...formData, recruiterName: val });
                                            else if (isShop) setFormData({ ...formData, fullName: val, ownerName: val });
                                            else setFormData({ ...formData, fullName: val });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MessageCircle size={14} className="text-emerald-500" /> WhatsApp Hotline
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                        value={formData.whatsappNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Main Content Details */}
                        <div className="space-y-8 text-[#1A1A1A]">
                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                    {isJob ? <Briefcase size={18} className="text-primary" /> : isShop ? <Store size={18} className="text-primary" /> : <Wrench size={18} className="text-primary" />}
                                    {isJob ? 'Requirement Title' : isShop ? 'Business Name' : 'Service Specialization'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                    value={formData.title || formData.shopName || formData.serviceName || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isJob) setFormData({ ...formData, title: val });
                                        else if (isShop) setFormData({ ...formData, shopName: val });
                                        else setFormData({ ...formData, serviceName: val });
                                    }}
                                />
                            </div>

                            {isShop && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight">Business Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                            value={formData.businessCategory || 'Retailer'}
                                            onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                        >
                                            <option value="Retailer">Retailer</option>
                                            <option value="Wholesaler">Wholesaler</option>
                                            <option value="Manufacturer">Manufacturer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight">Shop Photo URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                            value={formData.shopPhotoUrl || ''}
                                            onChange={(e) => setFormData({ ...formData, shopPhotoUrl: e.target.value })}
                                            placeholder="Direct link to image"
                                        />
                                    </div>
                                </div>
                            )}

                            {!isJob && (
                                <div className="space-y-4">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                        <MapPin size={18} className="text-primary" /> Service Cities (Up to 5)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add city..."
                                            className="flex-1 px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                            value={cityInput}
                                            onChange={(e) => setCityInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                                        />
                                        <button type="button" onClick={addCity} className="bg-[#1A1A1A] text-white px-5 rounded-md hover:bg-primary transition-all"><Plus size={20} /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.serviceCities || []).map(city => (
                                            <span key={city} className="bg-primary text-white px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                {city}
                                                <X size={12} className="cursor-pointer hover:text-[#1A1A1A]" onClick={() => removeCity(city)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight">Base Location / Area</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                        value={formData.location || ''}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight">Contact Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                        value={formData.contactNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    />
                                </div>
                            </div>

                            {isShop && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight">GST Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-primary"
                                            value={formData.gstNumber || ''}
                                            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase tracking-tight">Google Maps Link</label>
                                        <input
                                            type="url"
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                            value={formData.mapLink || ''}
                                            onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-black uppercase tracking-tight">Full Address</label>
                                        <textarea
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold resize-none"
                                            rows="2"
                                            value={formData.fullAddress || ''}
                                            onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {isJob && (
                                <div className="space-y-2">
                                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                        <IndianRupee size={16} className="text-primary" /> Budget Range
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                            value={formData.salaryMin || ''}
                                            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                                            placeholder="Min"
                                        />
                                        <span className="font-bold text-slate-300">to</span>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                            value={formData.salaryMax || ''}
                                            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                    <Info size={18} className="text-primary" /> Detailed Description
                                </label>
                                <textarea
                                    required
                                    rows="6"
                                    className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-medium leading-relaxed"
                                    value={formData.description || formData.services || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (isShop) setFormData({ ...formData, services: val });
                                        else setFormData({ ...formData, description: val });
                                    }}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={updating}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-md shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99] uppercase tracking-widest text-sm"
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="animate-spin" /> Synchronizing...
                                </>
                            ) : (
                                <>
                                    <Save size={18} /> Update Listing
                                </>
                            )}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default EditListing;
