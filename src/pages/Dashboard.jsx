import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
    Briefcase, Store, Wrench, Settings, Plus, Trash2, Loader2,
    MessageSquare, ArrowUpRight, ArrowDownLeft, Phone, User,
    Calendar, LayoutGrid, TrendingUp, Activity, MapPin, Eye, Bell, CheckCircle,
    FilePlus, UserPlus, Package, Calculator, Shield
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PostJobForm from '../components/forms/PostJobForm';
import RepairServiceForm from '../components/forms/RepairServiceForm';
import ShopForm from '../components/forms/ShopForm';
import WorkerProfileForm from '../components/forms/WorkerProfileForm';
import ProductForm from '../components/forms/ProductForm';
import RegularSlidingWindowCalculator from '../components/RegularSlidingWindowCalculator';

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    const [items, setItems] = useState([]);
    const [receivedLeads, setReceivedLeads] = useState([]);
    const [nearbyLeads, setNearbyLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revealedLeads, setRevealedLeads] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [selectedShopForProducts, setSelectedShopForProducts] = useState(null);
    const [profileData, setProfileData] = useState({
        expertise: user?.expertise || '',
        whatsappNumber: user?.whatsappNumber || '',
        serviceCities: user?.serviceCities || []
    });
    const [cityInput, setCityInput] = useState('');
    const [stats, setStats] = useState({
        jobs: 0,
        shops: 0,
        repairs: 0,
        leads: 0,
        nearby: 0
    });

    const [providerCities, setProviderCities] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [jobsSnap, shopsSnap, repairsSnap] = await Promise.all([
                getDocs(query(collection(db, 'jobs'), where('userId', '==', user.uid))),
                getDocs(query(collection(db, 'shops'), where('userId', '==', user.uid))),
                getDocs(query(collection(db, 'repairs'), where('userId', '==', user.uid)))
            ]);

            // Consolidate cities from all listings (shops and repairs)
            const cities = new Set();
            shopsSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.serviceCities) data.serviceCities.forEach(c => cities.add(c.toLowerCase()));
                else if (data.location) cities.add(data.location.toLowerCase().split(',')[0].trim());
            });
            repairsSnap.docs.forEach(doc => {
                const data = doc.data();
                if (data.serviceCities) data.serviceCities.forEach(c => cities.add(c.toLowerCase()));
                else if (data.location) cities.add(data.location.toLowerCase());
            });

            setProviderCities(Array.from(cities));

            const [receivedLeadsSnap, allServiceReqSnap] = await Promise.all([
                getDocs(query(collection(db, 'leads'), where('receiverId', '==', user.uid))),
                getDocs(query(collection(db, 'service_requests'), where('status', '==', 'open')))
            ]);

            // Match leads if their city is in providerCities
            const matchedLeads = allServiceReqSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(lead => cities.has(lead.city?.toLowerCase()))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setNearbyLeads(matchedLeads);
            setReceivedLeads(receivedLeadsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

            setStats({
                jobs: jobsSnap.size,
                shops: shopsSnap.size,
                repairs: repairsSnap.size,
                leads: receivedLeadsSnap.size,
                nearby: matchedLeads.length
            });

            if (activeTab === 'jobs') setItems(jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            else if (activeTab === 'shops') setItems(shopsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            else if (activeTab === 'repairs') setItems(repairsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) setActiveTab(tab);
    }, [location]);

    useEffect(() => {
        if (user) fetchData();
    }, [user, activeTab]);

    const handleDelete = async (itemId, tab) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                await deleteDoc(doc(db, tab || activeTab, itemId));
                fetchData();
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleReveal = (leadId) => {
        setRevealedLeads(prev => ({ ...prev, [leadId]: true }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...profileData,
                updatedAt: new Date().toISOString()
            });
            setEditMode(false);
            fetchData(); // Refresh stats/cities
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const addProfileCity = () => {
        if (cityInput.trim() && profileData.serviceCities.length < 5 && !profileData.serviceCities.includes(cityInput.trim().toLowerCase())) {
            setProfileData({ ...profileData, serviceCities: [...profileData.serviceCities, cityInput.trim().toLowerCase()] });
            setCityInput('');
        }
    };

    const removeProfileCity = (c) => {
        setProfileData({ ...profileData, serviceCities: profileData.serviceCities.filter(city => city !== c) });
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutGrid size={20} /> },
        { id: 'calculator', label: 'WindSizer Calc', icon: <Calculator size={20} />, group: 'Tools' },
        { id: 'settings', label: 'My Profile', icon: <Settings size={20} /> },
        { id: 'my_services', label: 'My Services', icon: <Store size={20} />, group: 'Creation' },
        { id: 'post_job', label: 'Post a Job', icon: <FilePlus size={20} />, group: 'Creation' },
        { id: 'become_worker', label: 'Become a Worker', icon: <UserPlus size={20} />, group: 'Creation' },
        { id: 'nearby', label: 'Nearby Leads', icon: <Bell size={20} />, badge: stats.nearby, group: 'Leads' },
        { id: 'leads', label: 'Direct Inbox', icon: <MessageSquare size={20} />, group: 'Leads' },
        { id: 'jobs', label: 'Active Jobs', icon: <Briefcase size={20} />, group: 'Manage' },
        { id: 'shops', label: 'Active Shops', icon: <Store size={20} />, group: 'Manage' },
        { id: 'repairs', label: 'Service Listings', icon: <Wrench size={20} />, group: 'Manage' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 bg-light-grey min-h-screen text-slate-900">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar */}
                <div className="w-full lg:w-72 bg-[#1A1A1A] p-6 rounded-md shadow-xl lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <div className="mb-8 p-6 bg-white/5 rounded-md text-white border border-white/10">
                        <h2 className="font-bold text-lg truncate tracking-tight uppercase leading-none">{user?.name}</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-2">{user?.role || 'Partner'}</p>
                    </div>

                    <nav className="space-y-6">
                        {['', 'Tools', 'Creation', 'Leads', 'Manage'].map(group => {
                            const groupTabs = tabs.filter(t => (t.group || '') === group);
                            if (groupTabs.length === 0) return null;
                            return (
                                <div key={group || 'Main'} className="space-y-1">
                                    {group && <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] pl-4 mb-3">{group}</p>}
                                    {groupTabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-md transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">{tab.icon} {tab.label}</span>
                                            {tab.badge > 0 && <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{tab.badge}</span>}
                                        </button>
                                    ))}
                                </div>
                            )
                        })}
                        {(user?.email === 'pramodraut04@gmail.com' || user?.name === 'Pramod Raut') && (
                            <div className="pt-6 mt-6 border-t border-white/10">
                                <Link
                                    to="/admin"
                                    className="w-full flex items-center justify-between px-5 py-4 rounded-md transition-all font-black text-[10px] uppercase tracking-widest text-[#F28C28] hover:bg-white/5"
                                >
                                    <span className="flex items-center gap-3"><Shield size={20} /> Admin Control</span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter uppercase leading-none">
                            {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        {!['post_job', 'my_services', 'become_worker', 'overview', 'settings'].includes(activeTab) && (
                            <button
                                onClick={() => setActiveTab('post_job')}
                                className="bg-[#1A1A1A] hover:bg-primary text-white px-8 py-4 rounded-md text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
                            >
                                <Plus size={18} /> New Posting
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                                <p className="font-bold text-slate-300 uppercase tracking-widest">Loading...</p>
                            </motion.div>
                        ) : activeTab === 'overview' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm">
                                    <h2 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Welcome, <span className="text-primary">{user?.name}</span>!</h2>
                                    <p className="text-slate-500 font-medium mt-1">Manage your professional presence and track your leads here.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Active Jobs', val: stats.jobs },
                                        { label: 'Shop Reach', val: stats.shops },
                                        { label: 'Verified Leads', val: stats.leads },
                                        { label: 'Nearby Opps', val: stats.nearby, badge: true },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-8 rounded-md border border-slate-200 shadow-sm relative group overflow-hidden hover:shadow-md transition-all">
                                            {stat.badge && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-md">New</div>}
                                            <p className="text-4xl font-black text-[#1A1A1A] mb-1">{stat.val}</p>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-[#1A1A1A] p-10 rounded-md text-white shadow-xl relative overflow-hidden">
                                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                                        <TrendingUp className="text-primary" /> Business Summary
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-900 font-bold">
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-md text-white">
                                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Cities</h4>
                                            <p className="text-lg font-black uppercase text-primary truncate">
                                                {providerCities.length > 0 ? providerCities.join(', ') : 'No cities set'}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-6 rounded-md text-white flex items-center justify-between">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Local Matches</h4>
                                                <p className="text-xl font-black">{stats.nearby} Unified Leads</p>
                                            </div>
                                            <button onClick={() => setActiveTab('nearby')} className="bg-primary hover:bg-primary-dark p-3 rounded-md transition-all"><ArrowUpRight /></button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'nearby' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="flex items-center justify-between bg-white p-6 rounded-md border border-slate-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary text-white p-3 rounded-md"><MapPin /></div>
                                        <div>
                                            <h2 className="font-black text-[#1A1A1A] uppercase tracking-tight">Leads in Service Cities</h2>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest truncate max-w-sm">
                                                {providerCities.join(' / ')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-400">{nearbyLeads.length} Matches</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {nearbyLeads.length > 0 ? nearbyLeads.map(lead => (
                                        <div key={lead.id} className="bg-white p-6 rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col group">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-orange-50 text-primary px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">{lead.serviceCategory}</span>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 flex items-center gap-2 tracking-tight uppercase">
                                                <MapPin size={16} className="text-primary" /> {lead.area}, <span className="text-primary">{lead.city}</span>
                                            </h3>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6 flex-1">"{lead.description}"</p>

                                            <div className="bg-light-grey p-4 rounded-md border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-slate-300 border border-slate-200"><User size={16} /></div>
                                                    <span className="text-sm font-bold text-slate-700">{lead.customerName}</span>
                                                </div>
                                                {revealedLeads[lead.id] ? (
                                                    <a href={`tel:${lead.mobileNumber}`} className="bg-primary text-white px-3 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2">
                                                        <Phone size={14} /> {lead.mobileNumber}
                                                    </a>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReveal(lead.id)}
                                                        className="bg-[#1A1A1A] text-white px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-sm"
                                                    >
                                                        Get Contact
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-white rounded-md border-2 border-dashed border-slate-200">
                                            <Bell className="mx-auto text-slate-200 mb-4 w-12 h-12" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest">No local leads found.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : activeTab === 'calculator' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <RegularSlidingWindowCalculator />
                            </motion.div>
                        ) : activeTab === 'post_job' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                                <PostJobForm onSuccess={fetchData} />
                            </motion.div>
                        ) : activeTab === 'my_services' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                                <div>
                                    <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight mb-8">Register Repair Business</h2>
                                    <RepairServiceForm onSuccess={fetchData} />
                                </div>
                                <div className="border-t border-slate-200 pt-12">
                                    <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tight mb-8">List New Shop Location</h2>
                                    <ShopForm onSuccess={fetchData} />
                                </div>
                            </motion.div>
                        ) : activeTab === 'become_worker' ? (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                                <WorkerProfileForm onSuccess={fetchData} />
                            </motion.div>
                        ) : activeTab === 'leads' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                {receivedLeads.length > 0 ? (
                                    receivedLeads.map(lead => (
                                        <div key={lead.id} className="bg-white p-6 rounded-md border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 group hover:shadow-md transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-primary text-white p-2 rounded-md shadow-md"><User size={18} /></div>
                                                    <h4 className="font-bold text-lg text-[#1A1A1A] tracking-tight truncate">{lead.name}</h4>
                                                </div>
                                                <p className="text-slate-500 text-sm italic font-medium mb-4">"{lead.message}"</p>
                                                <div className="flex gap-4">
                                                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest px-3 py-1.5 bg-orange-50 rounded-md">
                                                        <Phone size={14} /> {lead.phone}
                                                    </a>
                                                    <span className="bg-light-grey text-slate-400 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDelete(lead.id, 'leads')} className="bg-slate-50 text-slate-300 p-3 rounded-md hover:bg-red-500 hover:text-white transition-all shadow-sm">
                                                <Trash2 size={24} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-md border-2 border-dashed border-slate-200 text-slate-300 font-bold uppercase tracking-widest">No Inbox Leads</div>
                                )}
                            </motion.div>
                        ) : activeTab === 'settings' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <div className="bg-white p-10 rounded-md shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-center mb-10 pb-4 border-b">
                                        <h2 className="text-xl font-black uppercase tracking-tight">Account & Security</h2>
                                        {(user?.role === 'Worker' || user?.role === 'Service Provider') && (
                                            <button
                                                onClick={() => {
                                                    setEditMode(!editMode);
                                                    if (!editMode) setProfileData({
                                                        expertise: user?.expertise || '',
                                                        whatsappNumber: user?.whatsappNumber || '',
                                                        serviceCities: user?.serviceCities || []
                                                    });
                                                }}
                                                className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                                            >
                                                {editMode ? 'Cancel Editing' : 'Edit Professional Profile'}
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4 font-bold">
                                            <div className="bg-light-grey p-5 rounded-md border border-slate-100">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                                                <p className="text-lg text-slate-800">{user?.name}</p>
                                            </div>
                                            <div className="bg-light-grey p-5 rounded-md border border-slate-100">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Registered Email</label>
                                                <p className="text-lg text-slate-800">{user?.email}</p>
                                            </div>
                                            <div className="bg-light-grey p-5 rounded-md border border-slate-100">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Account Type</label>
                                                <p className="text-lg text-primary uppercase">{user?.role || 'User'}</p>
                                            </div>
                                        </div>

                                        {!editMode ? (
                                            <div className="bg-[#1A1A1A] p-8 rounded-md text-white shadow-lg flex flex-col justify-between">
                                                <div>
                                                    <div className="bg-primary w-12 h-12 rounded-md flex items-center justify-center mb-6"><CheckCircle size={24} /></div>
                                                    <h3 className="text-xl font-bold mb-2">Professional Status</h3>
                                                    <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                                                        {user?.role === 'Worker' || user?.role === 'Service Provider'
                                                            ? `You are listed as a ${user.role}. Complete your profile to appear in the Technician Directory.`
                                                            : "You are registered as a Contractor. You can post jobs and browse for technicians."}
                                                    </p>
                                                </div>
                                                {(user?.role === 'Worker' || user?.role === 'Service Provider') && (
                                                    <div className="space-y-3 pt-6 border-t border-white/10">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Visibility Stats</p>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span>Expertise: <span className="text-white">{user?.expertise || 'None'}</span></span>
                                                            <span className="text-primary font-bold">{user?.verified ? 'Verified' : 'Pending'}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Area of Expertise</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Aluminium, Glass, UPVC"
                                                        className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                                        value={profileData.expertise}
                                                        onChange={(e) => setProfileData({ ...profileData, expertise: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Number</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="For client chat"
                                                        className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                                        value={profileData.whatsappNumber}
                                                        onChange={(e) => setProfileData({ ...profileData, whatsappNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Cities</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add city..."
                                                            className="flex-1 px-4 py-3 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                                            value={cityInput}
                                                            onChange={(e) => setCityInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addProfileCity())}
                                                        />
                                                        <button type="button" onClick={addProfileCity} className="bg-[#1A1A1A] text-white px-4 rounded-md">Add</button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {profileData.serviceCities.map(c => (
                                                            <span key={c} className="bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase flex items-center gap-1">
                                                                {c} <Plus className="rotate-45 cursor-pointer" size={10} onClick={() => removeProfileCity(c)} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-md uppercase tracking-widest text-xs shadow-lg hover:bg-primary-dark transition-all">
                                                    Update Professional Profile
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'shops' && selectedShopForProducts ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="flex items-center justify-between bg-white p-6 rounded-md border border-slate-200">
                                    <div>
                                        <h2 className="text-xl font-black text-[#1A1A1A] uppercase tracking-tighter">Product Manager</h2>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{selectedShopForProducts.shopName}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedShopForProducts(null)}
                                        className="text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                                    >
                                        Back to Shops
                                    </button>
                                </div>
                                <ProductForm
                                    shopId={selectedShopForProducts.id}
                                    shopName={selectedShopForProducts.shopName}
                                    onSuccess={() => { }}
                                />
                                {/* Product storage would typically show list here, but form is the priority */}
                            </motion.div>
                        ) : (
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {items.length > 0 ? (
                                    items.map(item => (
                                        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={item.id} className="bg-white p-8 rounded-md border border-slate-200 shadow-sm group hover:shadow-md transition-all flex flex-col">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="bg-light-grey text-primary p-4 rounded-md shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                                    {activeTab === 'jobs' ? <Briefcase /> : activeTab === 'shops' ? <Store /> : <Wrench />}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to={`/edit/${activeTab}/${item.id}`} className="p-3 text-slate-300 hover:text-primary bg-light-grey rounded-md transition-all"><Plus size={18} className="rotate-45" /></Link>
                                                    <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-300 hover:text-red-500 bg-light-grey rounded-md transition-all"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-xl text-[#1A1A1A] mb-2 truncate tracking-tight uppercase leading-none">{item.title || item.shopName || item.serviceName}</h3>
                                            <p className="text-sm text-slate-400 font-medium mb-6 line-clamp-2 leading-relaxed italic">"{item.description || item.services}"</p>

                                            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.serviceCities || [item.location]).map(city => (
                                                        <span key={city} className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-slate-100">{city}</span>
                                                    ))}
                                                </div>
                                                {activeTab === 'shops' && (
                                                    <button
                                                        onClick={() => setSelectedShopForProducts(item)}
                                                        className="w-full bg-[#1A1A1A] text-white py-2.5 rounded text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <Package size={14} /> Add/Manage Products
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-24 text-center bg-white rounded-md border-2 border-dashed border-slate-200">
                                        <p className="text-slate-300 font-bold mb-8 uppercase tracking-widest">Your portfolio is currently empty</p>
                                        <Link to={`/post-${activeTab === 'jobs' ? 'job' : activeTab === 'shops' ? 'shop' : 'repair-service'}`} className="bg-primary text-white px-10 py-4 rounded-md font-bold uppercase tracking-widest shadow-md hover:bg-primary-dark transition-all">
                                            Create First Post
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
