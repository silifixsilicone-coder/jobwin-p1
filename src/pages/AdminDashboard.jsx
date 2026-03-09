import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, query, getDocs, doc, updateDoc, deleteDoc, where, orderBy, limit } from 'firebase/firestore';
import {
    Users, CreditCard, IndianRupee, Calculator, Shield,
    Search, UserCheck, UserX, Star, Zap, Clock,
    ArrowUpRight, CheckCircle2, XCircle, AlertCircle,
    LayoutGrid, Settings, LogOut, Package, List, HardHat, FileSpreadsheet, Eye, Briefcase, Trash2, Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // Stats
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubs: 0,
        totalRevenue: 0,
        calculationsToday: 0
    });

    // Data lists
    const [users, setUsers] = useState([]);
    const [bulkOrders, setBulkOrders] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [allJobs, setAllJobs] = useState([]);
    const [settings, setSettings] = useState({
        basicRate: 499,
        premiumRate: 999
    });

    // Selected item for viewing
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Security Check: Only allow admin session or specific Firebase user
    useEffect(() => {
        const adminId = sessionStorage.getItem('adminId');
        const isFirebaseAdmin = user?.email === 'winsizer.com@gmail.com';

        const checkAndElevateUser = async () => {
            if (isFirebaseAdmin && user?.uid) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, { role: 'SUPERADMIN', isAdmin: true });
                } catch (e) {
                    console.error("Auto-elevation failed:", e);
                }
            }
        };

        if (adminId !== 'admin_pramod' && !isFirebaseAdmin) {
            navigate('/admin/login');
        } else {
            checkAndElevateUser();
            fetchData();
        }
    }, [activeTab, user]);

    const handleAdminLogout = () => {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminId');
        navigate('/admin/login');
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const usersSnap = await getDocs(collection(db, 'users'));
                const transSnap = await getDocs(collection(db, 'transactions')); // Assuming collection name

                let revenue = 0;
                let activeSubs = 0;
                transSnap.docs.forEach(doc => {
                    const d = doc.data();
                    if (d.status === 'success') {
                        revenue += parseFloat(d.amount || 0);
                        activeSubs++;
                    }
                });

                // Simulated calculations today (would need a 'logs' or 'analytics' collection)
                const calcSnap = await getDocs(collection(db, 'calculations'));

                setStats({
                    totalUsers: usersSnap.size,
                    activeSubs: activeSubs,
                    totalRevenue: revenue,
                    calculationsToday: calcSnap.size || 0
                });
            } else if (activeTab === 'users') {
                const usersSnap = await getDocs(collection(db, 'users'));
                setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } else if (activeTab === 'orders') {
                // In a real app, 'bulk_orders' would be a collection
                const ordersSnap = await getDocs(collection(db, 'bulk_orders'));
                setBulkOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } else if (activeTab === 'payments') {
                const transSnap = await getDocs(collection(db, 'transactions'));
                setTransactions(transSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } else if (activeTab === 'all_jobs') {
                const jobsSnap = await getDocs(collection(db, 'jobs'));
                setAllJobs(jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (error) {
            console.error("Admin fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId, action, value) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { [action]: value });
            fetchData(); // Refresh
        } catch (err) {
            alert("Action failed: " + err.message);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to PERMANENTLY delete this job post?")) {
            try {
                await deleteDoc(doc(db, 'jobs', jobId));
                fetchData();
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const updatePrice = async (type, price) => {
        setSettings(prev => ({ ...prev, [type]: price }));
        // Save to a 'config' collection in real app
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutGrid size={20} /> },
        { id: 'users', label: 'User Management', icon: <Users size={20} /> },
        { id: 'orders', label: 'Order Monitor', icon: <Package size={20} /> },
        { id: 'payments', label: 'Transactions', icon: <CreditCard size={20} /> },
        { id: 'all_jobs', label: 'Job Management', icon: <Briefcase size={20} /> },
        { id: 'settings', label: 'Platform Rates', icon: <Settings size={20} /> },
    ];

    if (!user && sessionStorage.getItem('adminId') !== 'admin_pramod') return <div className="p-20 text-center font-bold uppercase tracking-widest text-[#0F172A]">Access Denied</div>;

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-screen text-slate-900 font-sans">
            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Admin Sidebar */}
                <div className="w-full lg:w-80 bg-[#0F172A] p-8 rounded-2xl shadow-2xl lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto border border-white/5">
                    <div className="mb-10 flex items-center gap-3 border-b border-white/10 pb-6">
                        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-white text-xl tracking-tight uppercase">Admin Panel</h2>
                            <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase">Control Center</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all font-bold text-sm tracking-tight ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-20 pt-6 border-t border-white/10 space-y-2">
                        <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-5 py-4 text-slate-500 hover:text-white transition-all font-bold text-sm">
                            <LogOut size={18} /> Return to Site
                        </button>
                        <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm">
                            <Shield size={18} /> Logout Admin
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full space-y-8">
                    <header className="flex justify-between items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div>
                            <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h1>
                            <p className="text-slate-400 font-medium mt-2">Managing Winsizer Platform Ecosystem</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4 bg-slate-50 p-2 rounded-xl border">
                            <div className="text-right">
                                <p className="text-xs font-black text-[#0F172A] leading-none uppercase">{user?.email === 'winsizer.com@gmail.com' ? 'Admin Winsizer' : 'admin_pramod'}</p>
                                <p className="text-[10px] font-bold text-primary tracking-widest mt-1">SUPER ADMIN</p>
                            </div>
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">AP</div>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Platform Users', val: stats.totalUsers, icon: <Users />, color: 'blue' },
                                        { label: 'Active Subscriptions', val: stats.activeSubs, icon: <Zap />, color: 'orange' },
                                        { label: 'Total Revenue (Net)', val: `₹${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee />, color: 'emerald' },
                                        { label: 'Windows Calc Today', val: stats.calculationsToday, icon: <Calculator />, color: 'purple' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md group">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-${s.color}-50 text-${s.color}-600 group-hover:scale-110 transition-transform`}>
                                                {s.icon}
                                            </div>
                                            <p className="text-3xl font-black text-[#0F172A] mb-1">{s.val}</p>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-[#0F172A] p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <Zap size={200} />
                                        </div>
                                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                            <Zap className="text-primary" /> System Performance
                                        </h3>
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-xl">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Server Status</p>
                                                    <p className="text-lg font-black text-emerald-400 uppercase">Operational 99.9%</p>
                                                </div>
                                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">API Latency</p>
                                                    <p className="text-lg font-black">42ms</p>
                                                </div>
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Db Queries</p>
                                                    <p className="text-lg font-black">1.2k / hr</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm">
                                        <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter mb-8 flex justify-between items-center">
                                            Quick Transactions
                                            <button className="text-[10px] text-primary font-black uppercase tracking-widest">View All</button>
                                        </h3>
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle2 size={18} /></div>
                                                        <div>
                                                            <p className="text-sm font-black text-[#0F172A] uppercase">#RZP_O927{i}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Successful • 2m ago</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-slate-700">₹999</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : activeTab === 'users' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-8 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by name, email or mobile..."
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="px-5 py-3 bg-[#0F172A] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <Star size={14} /> Only Premium
                                        </button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b">
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">User Details</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Plan</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 uppercase">{u.name?.charAt(0)}</div>
                                                            <div>
                                                                <p className="font-black text-[#0F172A] uppercase text-sm leading-none mb-1">{u.name}</p>
                                                                <p className="text-xs font-bold text-slate-400 lowercase">{u.email} • {u.whatsappNumber || 'No Phone'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.isPremium ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                                            {u.isPremium ? 'Premium' : 'Free'}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <span className={`flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest ${u.disabled ? 'text-red-500' : 'text-emerald-500'}`}>
                                                            {u.disabled ? <><XCircle size={12} /> Locked</> : <><CheckCircle2 size={12} /> Active</>}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleUserAction(u.id, 'isPremium', !u.isPremium)}
                                                                title="Upgrade/Downgrade"
                                                                className="p-2.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all"
                                                            >
                                                                <Zap size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUserAction(u.id, 'disabled', !u.disabled)}
                                                                title={u.disabled ? "Enable User" : "Disable User"}
                                                                className={`p-2.5 rounded-lg transition-all ${u.disabled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                            >
                                                                {u.disabled ? <UserCheck size={18} /> : <UserX size={18} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 uppercase italic">No users found in database</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : activeTab === 'orders' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {bulkOrders.map(order => (
                                        <div key={order.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="bg-primary/10 text-primary p-3 rounded-xl"><Package size={20} /></div>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-slate-900 text-white p-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                            <h3 className="text-lg font-black text-[#0F172A] uppercase tracking-tighter mb-1 truncate">{order.partyName}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">User: {order.userName || 'Anonymous'}</p>

                                            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Calculator size={14} className="text-slate-300" />
                                                    <span className="text-xs font-black text-slate-700">{order.windows?.length || 0} Windows</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-primary bg-orange-50 px-3 py-1 rounded-lg">₹{order.totalAmount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {bulkOrders.length === 0 && (
                                        <div className="col-span-full py-40 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                            <p className="text-slate-300 font-black uppercase tracking-widest italic">No client orders recorded yet</p>
                                        </div>
                                    )}
                                </div>

                                {/* Order Audit Modal */}
                                {selectedOrder && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm">
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                                            <div className="p-8 bg-[#0F172A] text-white flex justify-between items-center">
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase tracking-tighter">{selectedOrder.partyName}</h2>
                                                    <p className="text-primary text-[11px] font-black uppercase tracking-[0.2em] mt-1">Audit Mode • User ID: {selectedOrder.userId}</p>
                                                </div>
                                                <button onClick={() => setSelectedOrder(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><XCircle size={24} /></button>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-6"><HardHat size={16} /> Aluminium Cutting List</h4>
                                                    <table className="w-full text-left text-xs border rounded-xl overflow-hidden">
                                                        <thead className="bg-slate-50 uppercase font-bold text-slate-500">
                                                            <tr><th className="p-4">Loc</th><th className="p-4">Patti (H)</th><th className="p-4">Bottom (W)</th><th className="p-4">Pcs</th></tr>
                                                        </thead>
                                                        <tbody className="divide-y font-bold">
                                                            {selectedOrder.windows?.map((w, index) => (
                                                                <tr key={index}>
                                                                    <td className="p-4 uppercase">{w.location}</td>
                                                                    <td className="p-4 text-primary">{w.handleHeight?.toFixed(2)}"</td>
                                                                    <td className="p-4 text-primary">{w.bottomWidth?.toFixed(2)}"</td>
                                                                    <td className="p-4 text-slate-400">{w.qty * 2}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 mb-6"><FileSpreadsheet size={16} /> Glass Manifest</h4>
                                                    <table className="w-full text-left text-xs border rounded-xl overflow-hidden">
                                                        <thead className="bg-slate-50 uppercase font-bold text-slate-500">
                                                            <tr><th className="p-4">Loc</th><th className="p-4">Ht</th><th className="p-4">Wd</th><th className="p-4">Total Pcs</th></tr>
                                                        </thead>
                                                        <tbody className="divide-y font-bold">
                                                            {selectedOrder.windows?.map((w, index) => (
                                                                <tr key={index}>
                                                                    <td className="p-4 uppercase">{w.location}</td>
                                                                    <td className="p-4 text-primary">{w.glassHeight?.toFixed(2)}"</td>
                                                                    <td className="p-4 text-primary">{w.glassWidth?.toFixed(2)}"</td>
                                                                    <td className="p-4 text-slate-800">{w.qty}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        ) : activeTab === 'payments' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-8 border-b flex justify-between items-center">
                                    <h3 className="font-black text-[#0F172A] uppercase tracking-tight">Razorpay Flow Logs</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-xs font-black uppercase text-slate-500 hover:bg-slate-200 transition-all">
                                        <Clock size={16} /> Filter Date
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b">
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction ID</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Customer</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Amount</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Gate Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {transactions.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50 transition-colors font-bold text-sm">
                                                    <td className="p-6 font-mono text-slate-500 uppercase">{t.razorpayId || t.id.slice(0, 12)}</td>
                                                    <td className="p-6">
                                                        <p className="font-black text-[#0F172A] uppercase leading-none mb-1">{t.userName}</p>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</p>
                                                    </td>
                                                    <td className="p-6 text-center font-black text-slate-700">₹{t.amount}</td>
                                                    <td className="p-6 text-right">
                                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${t.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                            {t.status === 'success' ? <><CheckCircle2 size={12} /> Captured</> : <><AlertCircle size={12} /> Failed</>}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {transactions.length === 0 && (
                                                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 uppercase italic">No payment logs available</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : activeTab === 'all_jobs' ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-8 border-b flex justify-between items-center">
                                    <h3 className="font-black text-[#0F172A] uppercase tracking-tight">Global Job Postings</h3>
                                    <span className="text-sm font-bold text-slate-400">{allJobs.length} active posts</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b">
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Details</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Recruiter</th>
                                                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Budget</th>
                                                <th className="p-6 text-[10px) font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {allJobs.map(j => (
                                                <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-6 max-w-md">
                                                        <p className="font-black text-[#0F172A] uppercase text-sm mb-1">{j.title}</p>
                                                        <p className="text-xs text-slate-400 line-clamp-1">{j.description}</p>
                                                        <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">{j.location}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <p className="font-bold text-slate-700">{j.recruiterName}</p>
                                                        <p className="text-[10px] text-slate-400">{j.whatsappNumber || j.contactNumber}</p>
                                                    </td>
                                                    <td className="p-6 text-center">
                                                        <p className="font-black text-slate-900 text-sm">₹{j.salaryMin} - ₹{j.salaryMax}</p>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/edit/jobs/${j.id}`)}
                                                                className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all border border-blue-100"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteJob(j.id)}
                                                                className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-100"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {allJobs.length === 0 && (
                                                <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 uppercase italic">No job posts found in database</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-8">
                                <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5">
                                        <Settings size={150} />
                                    </div>
                                    <h3 className="text-2xl font-black text-[#0F172A] uppercase tracking-tighter mb-10 flex items-center gap-4">
                                        <Zap className="text-primary" /> Subscription Rates
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Basic</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-[#0F172A]">₹{settings.basicRate}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">/Mo</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => updatePrice('basicRate', settings.basicRate + 10)} className="bg-white p-2 rounded-lg border shadow-sm hover:text-primary transition-all"><ArrowUpRight size={18} /></button>
                                            </div>
                                            <input
                                                type="range" min="99" max="999" step="10"
                                                className="w-full accent-primary"
                                                value={settings.basicRate}
                                                onChange={(e) => updatePrice('basicRate', parseInt(e.target.value))}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Premium Partner</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-[#0F172A]">₹{settings.premiumRate}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">/Mo</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => updatePrice('premiumRate', settings.premiumRate + 50)} className="bg-white p-2 rounded-lg border shadow-sm hover:text-primary transition-all"><ArrowUpRight size={18} /></button>
                                            </div>
                                            <input
                                                type="range" min="499" max="4999" step="50"
                                                className="w-full accent-primary"
                                                value={settings.premiumRate}
                                                onChange={(e) => updatePrice('premiumRate', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t">
                                        <button className="w-full bg-[#0F172A] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/30 hover:bg-slate-800 transition-all active:scale-95">
                                            Save Global Configuration
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
