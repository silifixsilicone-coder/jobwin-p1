import React, { useState } from 'react';
import { db, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Package, Tag, IndianRupee, Layers, Camera, X, Plus, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductForm = ({ shopId, shopName, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Glass',
        b2bPrice: '',
        b2cPrice: '',
        moq: '1',
        description: ''
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            alert("Maximum 3 photos allowed per product.");
            return;
        }

        const newImages = [...images, ...files];
        setImages(newImages);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const photoUrls = [];
            for (const img of images) {
                const storageRef = ref(storage, `product_photos/${shopId}_${Date.now()}_${img.name}`);
                const snapshot = await uploadBytes(storageRef, img);
                const url = await getDownloadURL(snapshot.ref);
                photoUrls.push(url);
            }

            await addDoc(collection(db, 'products'), {
                ...formData,
                shopId,
                shopName,
                photoUrls,
                createdAt: new Date().toISOString()
            });

            setFormData({
                name: '',
                category: 'Glass',
                b2bPrice: '',
                b2cPrice: '',
                moq: '1',
                description: ''
            });
            setImages([]);
            setPreviews([]);
            if (onSuccess) onSuccess();
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md border border-slate-200 space-y-6">
            <h3 className="text-lg font-black text-[#1A1A1A] flex items-center gap-2 uppercase tracking-tight">
                <Package size={20} className="text-primary" /> Add New Product
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. 12mm Toughened Glass"
                        className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select
                        className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="Glass">Glass</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Profiles">Profiles</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Mirror">Mirror</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B2B Price (Bulk)</label>
                    <div className="relative">
                        <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="number"
                            required
                            placeholder="Price per unit"
                            className="w-full pl-10 pr-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                            value={formData.b2bPrice}
                            onChange={(e) => setFormData({ ...formData, b2bPrice: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">B2C Price (Retail)</label>
                    <div className="relative">
                        <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="number"
                            required
                            placeholder="Price per unit"
                            className="w-full pl-10 pr-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                            value={formData.b2cPrice}
                            onChange={(e) => setFormData({ ...formData, b2cPrice: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min. Order (MOQ)</label>
                    <input
                        type="number"
                        required
                        placeholder="e.g. 10"
                        className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-slate-800"
                        value={formData.moq}
                        onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Description</label>
                <textarea
                    placeholder="Short description of the product and its quality..."
                    rows="2"
                    className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-medium text-slate-700 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Photos (Max 3)</label>
                <div className="flex flex-wrap gap-4">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden border border-slate-200 bg-white">
                            <img src={src} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                    {previews.length < 3 && (
                        <label className="w-24 h-24 rounded-md border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors text-slate-400 hover:text-primary">
                            <Camera size={24} />
                            <span className="text-[8px] font-black uppercase mt-1">Add</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
                        </label>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-primary text-white font-black py-4 rounded-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-xs"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                {loading ? 'Adding Product...' : 'Add to Catalog'}
            </button>
        </form>
    );
};

export default ProductForm;
