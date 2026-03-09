import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import WorkerCard from '../components/WorkerCard';
import { Search, MapPin, Loader2, UserPlus, Info, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FindWorkers = () => {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    useEffect(() => {
        const fetchWorkers = async () => {
            try {
                // Fetch users who are either Workers or Service Providers
                const q = query(
                    collection(db, 'users'),
                    where('role', 'in', ['Worker', 'Service Provider'])
                );
                const querySnapshot = await getDocs(q);
                setWorkers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching workers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkers();
    }, []);

    const filteredWorkers = workers.filter(worker => {
        const matchesSearch = (
            worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            worker.expertise?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesCity = !cityFilter ||
            (worker.serviceCities && worker.serviceCities.some(city => city.toLowerCase().includes(cityFilter.toLowerCase())));

        return matchesSearch && matchesCity;
    });

    return (
        <div className="bg-light-grey min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-primary p-4 rounded-md text-white shadow-xl">
                            <UserPlus size={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-[#1A1A1A] uppercase tracking-tighter">Technician Directory</h1>
                            <p className="text-slate-500 font-medium">Connect with skilled window and glass specialists for your turnkey projects.</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest bg-orange-50 px-4 py-2 rounded-md border border-orange-100 animate-pulse">
                        <Info size={14} /> Only Verified Specialists Shown
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-[#1A1A1A] p-6 rounded-md shadow-2xl flex flex-col md:flex-row gap-4 mb-14 border border-white/5">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Find by name or expertise (e.g. Aluminium, UPVC)..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-primary transition-all outline-none text-white font-bold text-sm placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="md:w-72 relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="City / Service Area..."
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-primary transition-all outline-none text-white font-bold text-sm placeholder:text-slate-600"
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                        />
                    </div>
                </div>

                {/* Directory Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-300 font-bold uppercase tracking-widest">
                        <Loader2 className="w-16 h-16 animate-spin mb-6 text-primary" />
                        <p>Syncing Talent Network...</p>
                    </div>
                ) : filteredWorkers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence>
                            {filteredWorkers.map((worker, index) => (
                                <motion.div
                                    key={worker.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <WorkerCard worker={worker} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-md border-2 border-dashed border-slate-200">
                        <UserPlus className="w-20 h-20 text-slate-100 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-[#1A1A1A] mb-3 uppercase tracking-tighter">No Workers Found</h3>
                        <p className="text-slate-400 font-medium">Be the first to list yourself as a specialist in your city!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindWorkers;
