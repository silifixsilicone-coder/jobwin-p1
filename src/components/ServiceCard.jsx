import React, { useState } from 'react';
import LeadModal from './LeadModal';
import CatalogModal from './CatalogModal';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Star, ShieldCheck, Send, MessageCircle, ShoppingBag, Store, Activity } from 'lucide-react';

const ServiceCard = ({ service, type = 'service' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const { user } = useAuth();

    const isOwner = user?.uid === service.userId;

    const sanitizePhone = (phone) => phone?.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${sanitizePhone(service.whatsappNumber)}?text=Hi ${service.fullName || 'there'}, I found your profile on Winsizer. I need help with window repair/service.`;

    return (
        <>
            <div className="bg-white rounded-md overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                <div className="h-48 bg-[#1A1A1A] relative p-6 flex flex-col justify-end overflow-hidden">
                    {type === 'shop' && service.shopPhotoUrl && (
                        <img src={service.shopPhotoUrl} alt={service.shopName} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-4 right-4 flex gap-2">
                        {type === 'shop' && service.businessCategory && (
                            <div className="bg-white/90 backdrop-blur-sm text-[#1A1A1A] px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-xl">
                                {service.businessCategory}
                            </div>
                        )}
                        <div className="bg-primary p-2 rounded-md shadow-lg">
                            <ShieldCheck className="text-white w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="relative z-10 text-xl font-black text-white mb-0 uppercase tracking-tighter drop-shadow-lg">
                        {type === 'shop' ? service.shopName : service.serviceName}
                    </h3>
                </div>

                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Provider Identity</p>
                        <h4 className="text-lg font-black text-[#1A1A1A] uppercase tracking-tighter leading-none">
                            {service.fullName || service.ownerName || 'Verified Partner'}
                        </h4>
                    </div>

                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 font-medium italic border-l-2 border-primary/20 pl-4">
                        "{service.description || service.services}"
                    </p>

                    <div className="space-y-4 mb-8">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                                <MapPin size={10} className="text-primary" /> Service Locations
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {(service.serviceCities || [service.location]).map((city, idx) => (
                                    <span key={idx} className="bg-orange-50 text-primary border border-orange-100 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                                        {city}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center text-slate-500 text-[10px] font-black uppercase tracking-widest gap-2">
                            <Star size={12} className="text-primary fill-primary" />
                            <span>Premium Rating</span>
                            <span className="text-slate-300 ml-auto">Verified</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href={`tel:${service.contactNumber}`}
                                className="bg-light-grey hover:bg-slate-200 text-[#1A1A1A] font-black py-3 rounded-md text-center text-[10px] transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-slate-200"
                            >
                                <Phone size={14} /> Call Now
                            </a>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#1A1A1A] hover:bg-black text-white font-black py-3 rounded-md text-center text-[10px] transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Send size={14} /> Send Inquiry
                            </button>
                        </div>

                        {service.whatsappNumber && (
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-md text-center text-[11px] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest w-full active:scale-[0.98]"
                            >
                                <MessageCircle size={18} fill="white" /> Chat on WhatsApp
                            </a>
                        )}

                        {type === 'shop' && (
                            <button
                                onClick={() => setIsCatalogOpen(true)}
                                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-4 rounded-md text-center text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] border-t border-white/5"
                            >
                                <ShoppingBag size={18} className="text-primary" /> View Product Catalog
                            </button>
                        )}

                        {isOwner && (
                            <div className="mt-2 py-2 bg-orange-50 text-primary rounded-md text-center text-[9px] font-black uppercase tracking-widest border border-orange-100">
                                Your Profile
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                targetItem={service}
                type={type === 'shop' ? 'shop' : 'repair'}
            />
            <CatalogModal
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                shopId={service.id}
                shopName={type === 'shop' ? service.shopName : service.serviceName}
                whatsappNumber={service.whatsappNumber}
            />
        </>
    );
};

export default ServiceCard;
