import React from 'react';
import { MapPin, ShieldCheck, MessageCircle, Star, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerCard = ({ worker }) => {
    const sanitizePhone = (phone) => phone?.replace(/\D/g, '');

    // Default city for the message if none selected in filter
    const displayCity = worker.serviceCities?.[0] || 'your area';

    const whatsappLink = `https://wa.me/${sanitizePhone(worker.whatsappNumber || worker.contactNumber)}?text=Hi ${worker.name}, I am a contractor and I found your profile on Winsizer. I have a work requirement in ${displayCity}. Are you available?`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-md overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group"
        >
            <div className="h-24 bg-[#1A1A1A] relative flex items-center px-6">
                <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-md border-4 border-white overflow-hidden bg-light-grey shadow-md">
                        {worker.profilePhoto ? (
                            <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#1A1A1A] font-black text-2xl uppercase">
                                {worker.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
                <div className="ml-24 mt-2">
                    {worker.verified && (
                        <div className="flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border border-primary/30 w-fit">
                            <ShieldCheck size={10} /> Verified Specialist
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-12 p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">
                        {worker.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1">
                        <Briefcase size={10} className="text-primary" /> {worker.expertise || 'General Specialist'}
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                            <MapPin size={10} className="text-primary" /> Service Areas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {(worker.serviceCities || ['Not Specified']).map((city, idx) => (
                                <span key={idx} className="bg-light-grey text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest">
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-md text-center text-[11px] transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest w-full active:scale-[0.98]"
                >
                    <MessageCircle size={18} fill="white" /> Contact Worker
                </a>
            </div>
        </motion.div>
    );
};

export default WorkerCard;
