import React, { useState } from 'react';
import { MapPin, Clock, Send, IndianRupee, MessageCircle, User } from 'lucide-react';
import LeadModal from './LeadModal';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useAuth();

    const isOwner = user?.uid === job.userId;

    // WhatsApp logic
    const waLink = `https://wa.me/${job.whatsappNumber || job.contactNumber}?text=Hi, I am interested in your job post: ${job.title} on Winsizer.`;

    return (
        <>
            <div className="bg-white rounded-md p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
                {/* Header: Title & Salary */}
                <div className="flex justify-between items-start mb-4 text-slate-900">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{job.title}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Job ID: #{job.id?.slice(0, 6)}</p>
                    </div>
                    {job.salaryMin && (
                        <div className="text-primary text-lg font-black flex items-center tracking-tighter">
                            <IndianRupee size={16} className="mr-0.5" />
                            {job.salaryMin} - {job.salaryMax}
                        </div>
                    )}
                </div>

                {/* Body: Description */}
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                    {job.description}
                </p>

                {/* Recruiter Section */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-light-grey rounded-md border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm flex-shrink-0">
                        {job.profilePhotoUrl ? (
                            <img src={job.profilePhotoUrl} alt={job.recruiterName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Recruiter</p>
                        <h4 className="text-sm font-bold text-slate-800 truncate tracking-tight">{job.recruiterName || 'Verified User'}</h4>
                    </div>
                </div>

                {/* Footer Info: Meta */}
                <div className="space-y-2 mb-8 mt-auto">
                    <div className="flex items-center text-slate-500 text-xs gap-2 font-bold">
                        <MapPin size={14} className="text-primary" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs gap-2 font-bold">
                        <Clock size={14} className="text-primary" />
                        <span>Posted on: {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-md text-center text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                    >
                        <MessageCircle size={16} fill="currentColor" /> WhatsApp
                    </a>

                    {!isOwner ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-md text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
                        >
                            <Send size={16} /> Inquiry
                        </button>
                    ) : (
                        <div className="flex-1 bg-slate-100 text-slate-400 font-bold py-3 px-4 rounded-md text-center text-xs border border-slate-200 flex items-center justify-center">
                            Owner View
                        </div>
                    )}
                </div>
            </div>

            <LeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                targetItem={job}
                type="job"
            />
        </>
    );
};

export default JobCard;
