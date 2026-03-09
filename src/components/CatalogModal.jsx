import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { X, MessageCircle, Info, ShoppingBag, Loader2, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CatalogModal = ({ isOpen, onClose, shopId, shopName, whatsappNumber }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && shopId) {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const q = query(collection(db, 'products'), where('shopId', '==', shopId));
                    const snap = await getDocs(q);
                    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } catch (error) {
                    console.error("Error fetching catalog:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isOpen, shopId]);

    if (!isOpen) return null;

    const sanitizePhone = (phone) => phone?.replace(/\D/g, '');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#1A1A1A]/90 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-md shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <h2 className="text-3xl font-black text-[#1A1A1A] uppercase tracking-tighter leading-none flex items-center gap-3">
                                <ShoppingBag className="text-primary" /> {shopName} Catalog
                            </h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 px-1 border-l-2 border-primary">B2B & B2C Inventory</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-light-grey rounded-full transition-all active:scale-90">
                            <X size={24} className="text-[#1A1A1A]" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-light-grey">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                <p className="font-black text-slate-300 uppercase tracking-widest">Opening Catalog...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            {product.photoUrls && product.photoUrls.length > 0 ? (
                                                <img src={product.photoUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ShoppingBag size={40} /></div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest text-[#1A1A1A]">
                                                {product.category}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4 uppercase tracking-tight">{product.name}</h3>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="p-3 bg-light-grey rounded-md border border-slate-100">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">B2B Price</p>
                                                    <p className="text-xl font-black text-[#1A1A1A] flex items-center gap-0.5">
                                                        <IndianRupee size={16} />{product.b2bPrice}
                                                    </p>
                                                </div>
                                                <div className="p-3 bg-orange-50 rounded-md border border-orange-100">
                                                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-1">B2C Price</p>
                                                    <p className="text-xl font-black text-primary flex items-center gap-0.5">
                                                        <IndianRupee size={16} />{product.b2cPrice}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-6 flex-1">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    <span>Min Order (MOQ)</span>
                                                    <span className="text-[#1A1A1A]">{product.moq} Units</span>
                                                </div>
                                                <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">"{product.description}"</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <a
                                                    href={`https://wa.me/${sanitizePhone(whatsappNumber)}?text=Hi ${shopName}, I saw your product ${product.name} on Winsizer. I want to inquire about the B2B price for my requirement.`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#1A1A1A] hover:bg-black text-white px-3 py-3 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <MessageCircle size={14} /> B2B Query
                                                </a>
                                                <a
                                                    href={`https://wa.me/${sanitizePhone(whatsappNumber)}?text=Hi ${shopName}, I saw your product ${product.name} on Winsizer. I want to inquire about the B2C price for my requirement.`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-3 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                                                >
                                                    <MessageCircle size={14} /> Buy Now
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40">
                                <ShoppingBag className="mx-auto text-slate-200 mb-6 w-20 h-20" />
                                <h3 className="text-2xl font-black text-[#1A1A1A] mb-2 uppercase tracking-tighter">No Catalog Items</h3>
                                <p className="text-slate-400 font-medium italic">This business hasn't added any products to their inventory yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CatalogModal;
