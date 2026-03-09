import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Store, User, MapPin, Info, Send, CheckCircle2, Plus, X, MessageCircle, Loader2, Camera, FileText, Globe, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ShopForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cityInput, setCityInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        shopName: '',
        fullName: user?.name || '',
        businessCategory: 'Retailer',
        serviceCities: [],
        whatsappNumber: user?.whatsappNumber || '',
        contactNumber: '',
        gstNumber: '',
        fullAddress: '',
        mapLink: '',
        services: '',
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
            let shopPhotoUrl = '';
            if (imageFile) {
                const storageRef = ref(storage, `shop_photos/${user.uid}_${Date.now()}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                shopPhotoUrl = await getDownloadURL(snapshot.ref);
            }

            await addDoc(collection(db, 'shops'), {
                ...formData,
                shopPhotoUrl,
                userId: user.uid,
                createdAt: new Date().toISOString(),
            });
            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error listing shop:", error);
            alert("Failed to list shop. Please try again.");
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
                <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-[#1A1A1A] mb-4 uppercase tracking-tighter">Shop Listed!</h2>
                <p className="text-slate-500 mb-8 font-medium">Your business is now featured on the Winsizer directory.</p>
                <button onClick={() => setSuccess(false)} className="text-primary font-black uppercase text-xs tracking-widest hover:underline">List Another Shop</button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-12 rounded-md shadow-sm border border-slate-200 space-y-10">
            {/* Business Profile */}
            <div className="bg-light-grey p-8 rounded-md border border-slate-100 space-y-8">
                <h3 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 uppercase tracking-tight">
                    <Store size={20} className="text-primary" /> Business Profile
                </h3>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shop / Business Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Royal Glass House"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.shopName}
                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Category</label>
                            <select
                                required
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800 appearance-none"
                                value={formData.businessCategory}
                                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                            >
                                <option value="Retailer">Retailer</option>
                                <option value="Wholesaler">Wholesaler</option>
                                <option value="Manufacturer">Manufacturer</option>
                            </select>
                        </div>
                    </div>

                    {/* Shop Photo Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shop Front / Logo Photo</label>
                        <div className="flex items-center gap-6">
                            <div className="w-32 h-32 rounded-md bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera size={32} className="text-slate-300" />
                                )}
                            </div>
                            <label className="bg-primary text-white px-6 py-2.5 rounded-md font-black uppercase text-[10px] tracking-widest cursor-pointer hover:bg-primary-dark transition-all active:scale-95">
                                Select Photo
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner / Representative Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} className="text-primary" /> GST Number (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="22AAAAA0000A1Z5"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.gstNumber}
                                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                            <input
                                type="tel"
                                required
                                placeholder="Primary contact"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MessageCircle size={14} className="text-emerald-500" /> WhatsApp Business Number
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="For customer chat"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Business Address</label>
                            <textarea
                                required
                                placeholder="Building No, Street, Landmark, Area, City, Pincode"
                                rows="3"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800 resize-none"
                                value={formData.fullAddress}
                                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={14} className="text-primary" /> Google Maps Link
                            </label>
                            <input
                                type="url"
                                placeholder="https://maps.google.com/..."
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
                                value={formData.mapLink}
                                onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                        <MapPin size={18} className="text-primary" /> Operational Cities (Up to 5)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter city name..."
                            className="flex-1 px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-slate-800"
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
                    <div className="flex flex-wrap gap-2">
                        {formData.serviceCities.map(city => (
                            <span
                                key={city}
                                className="bg-primary text-white px-4 py-2 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm"
                            >
                                {city}
                                <button type="button" onClick={() => removeCity(city)} className="hover:text-[#1A1A1A] transition-colors"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#1A1A1A]">
                        <Info size={18} className="text-primary" /> Products & Services Offered
                    </label>
                    <textarea
                        placeholder="List the types of glass, aluminium work, or specific products your shop provides..."
                        required
                        rows="5"
                        className="w-full px-5 py-4 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none transition-all resize-none font-medium leading-relaxed text-slate-700"
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    ></textarea>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-md shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99] uppercase tracking-widest text-sm"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {loading ? 'Publishing Business...' : 'Publish Business Listing'}
            </button>
        </form>
    );
};

export default ShopForm;
