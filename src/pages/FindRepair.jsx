import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ServiceCard from '../components/ServiceCard';
import { Search, MapPin, Loader2, Frown, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const FindRepair = () => {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    useEffect(() => {
        const fetchRepairs = async () => {
            try {
                const q = query(collection(db, 'repairs'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                setRepairs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching repairs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRepairs();
    }, []);

    const filteredRepairs = repairs.filter(repair => {
        const matchesSearch = (
            repair.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repair.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            repair.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesLocation = !locationFilter ||
            repair.location?.toLowerCase().includes(locationFilter.toLowerCase()) ||
            (repair.serviceCities && repair.serviceCities.some(city => city.toLowerCase().includes(locationFilter.toLowerCase())));

        return matchesSearch && matchesLocation;
    });

    return (
        <div className="bg-light-grey min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-14 flex items-center gap-6">
                    <div className="bg-primary p-4 rounded-md text-white shadow-xl">
                        <Wrench size={40} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#1A1A1A] uppercase tracking-tighter">Repair Specialists</h1>
                        <p className="text-slate-500 font-medium">Find expert window technicians across India's top cities.</p>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] p-6 rounded-md shadow-2xl flex flex-col md:flex-row gap-4 mb-14 border border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or specialization..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-primary transition-all outline-none text-white font-bold text-sm placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:w-72 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="City Filter..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-primary transition-all outline-none text-white font-bold text-sm placeholder:text-slate-600"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-300 font-bold uppercase tracking-widest">
                        <Loader2 className="w-16 h-16 animate-spin mb-6 text-primary" />
                        <p>Locating Verified Specialists...</p>
                    </div>
                ) : filteredRepairs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRepairs.map((repair, index) => (
                            <motion.div
                                key={repair.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <ServiceCard service={repair} type="repair" />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-md border border-slate-200 shadow-sm border-dashed">
                        <Frown className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-[#1A1A1A] mb-3 uppercase tracking-tighter">No Specialists Found</h3>
                        <p className="text-slate-400 font-medium">Be the first expert to list your services in this area!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindRepair;
