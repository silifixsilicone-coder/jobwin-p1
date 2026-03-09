import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, Settings, RefreshCcw, FileText, Download,
    ChevronDown, Ruler, HardHat, FileSpreadsheet, IndianRupee,
    Plus, Trash2, List, ClipboardList, Layers, Box, ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RegularSlidingWindowCalculator = () => {
    // Global Order Info
    const [partyName, setPartyName] = useState('');
    const [ratePerSqFt, setRatePerSqFt] = useState('');

    // Windows List
    const [windows, setWindows] = useState([]);

    // Form for new window
    const [newItem, setNewItem] = useState({
        location: '',
        width: '',
        height: '',
        tracks: '2',
        qty: '1',
        unit: 'Inches'
    });

    // Advanced Settings (Reductions) - Global for the order
    const [reductions, setReductions] = useState({
        handle: 1.5,
        bearing: 6.5,
        glassHeight: 4,
        glassWidthOffset: 0.05
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // list, aluminium, glass, invoice

    const resetReductions = () => {
        setReductions({
            handle: 1.5,
            bearing: 6.5,
            glassHeight: 4,
            glassWidthOffset: 0.05
        });
    };

    const convertToInches = (value, unit) => {
        const val = parseFloat(value) || 0;
        if (unit === 'MM') return val / 25.4;
        if (unit === 'Soot') return val * 0.125;
        return val;
    };

    const convertToMM = (inches) => {
        return inches * 25.4;
    };

    const roundToHalfFt = (inches) => {
        const feet = inches / 12;
        return Math.ceil(feet * 2) / 2;
    };

    const addWindow = () => {
        if (!newItem.width || !newItem.height) return;
        setWindows([...windows, { ...newItem, id: Date.now() }]);
        setNewItem({ ...newItem, location: '', width: '', height: '', qty: '1' });
    };

    const removeWindow = (id) => {
        setWindows(windows.filter(w => w.id !== id));
    };

    // Derived Calculations
    const calculatedData = windows.map(win => {
        const wIn = convertToInches(win.width, win.unit);
        const hIn = convertToInches(win.height, win.unit);
        const qty = parseInt(win.qty) || 1;
        const tracks = parseInt(win.tracks) || 2;

        const wMM = convertToMM(wIn);
        const hMM = convertToMM(hIn);

        // Cutting Formulas
        const handlePattiHeight = hIn - reductions.handle;
        const bearingBottomWidth = (wIn - reductions.bearing) / tracks;

        const glassHeight = hIn - reductions.glassHeight;
        const glassWidth = (wIn / tracks) + reductions.glassWidthOffset;

        // Billing
        const roundedW = roundToHalfFt(wIn);
        const roundedH = roundToHalfFt(hIn);
        const area = roundedW * roundedH * qty;

        return {
            ...win,
            wIn, hIn, wMM, hMM, qty, tracks,
            handlePattiHeight,
            bearingBottomWidth,
            glassHeight,
            glassWidth,
            area,
            cost: area * (parseFloat(ratePerSqFt) || 0)
        };
    });

    const totalStats = calculatedData.reduce((acc, curr) => ({
        area: acc.area + curr.area,
        cost: acc.cost + curr.cost,
        glassPcs: acc.glassPcs + (curr.qty * curr.tracks),
        rollers: acc.rollers + (curr.qty * curr.tracks * 2),
        locks: acc.locks + (curr.qty * (curr.tracks === 2 ? 1 : curr.tracks === 3 ? 2 : 2)), // Adjust lock estimate
        screws: acc.screws + (curr.qty * 20)
    }), { area: 0, cost: 0, glassPcs: 0, rollers: 0, locks: 0, screws: 0 });

    const downloadPDF = () => {
        const doc = new jsPDF();
        const primaryColor = [242, 140, 40];

        // PAGE 1: ALUMINIUM CUTTING
        doc.addImage('/logo.png', 'PNG', 10, 10, 15, 15);
        doc.setFontSize(20);
        doc.setTextColor(...primaryColor);
        doc.text('Aluminium Cutting List', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Party: ${partyName || 'N/A'} | Date: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

        doc.autoTable({
            startY: 40,
            head: [['Location', 'Patti/Interlock (Ht)', 'Bearing Bottom (Wd)', 'Tracks/Qty']],
            body: calculatedData.map(d => [
                d.location || 'N/A',
                `${d.handlePattiHeight.toFixed(2)}" x ${d.qty * 2 * d.tracks} Pcs`,
                `${d.bearingBottomWidth.toFixed(2)}" x ${d.qty * d.tracks} Pcs`,
                `${d.tracks}T | Qty: ${d.qty}`
            ]),
            headStyles: { fillColor: primaryColor }
        });

        // PAGE 2: GLASS CUTTING
        doc.addPage();
        doc.setTextColor(...primaryColor);
        doc.text('Glass Cutting List', 105, 20, { align: 'center' });
        doc.autoTable({
            startY: 40,
            head: [['Location', 'Glass Height (Inches)', 'Glass Width (Inches)', 'Total Pcs']],
            body: calculatedData.map(d => [
                d.location || 'N/A',
                `${d.glassHeight.toFixed(2)}"`,
                `${d.glassWidth.toFixed(2)}"`,
                `${d.qty * d.tracks} Pcs`
            ]),
            headStyles: { fillColor: [51, 51, 51] }
        });

        // PAGE 3: INVOICE / BILLING
        doc.addPage();
        doc.setTextColor(...primaryColor);
        doc.text('Order Invoice & Summary', 105, 20, { align: 'center' });
        doc.autoTable({
            startY: 40,
            head: [['Description', 'Dimensions', 'Qty', 'Area (SqFt)', 'Amount']],
            body: calculatedData.map(d => [
                d.location || 'Window',
                `${d.width}${d.unit === 'Soot' ? 'S' : d.unit === 'MM' ? 'mm' : '"'} x ${d.height}${d.unit === 'Soot' ? 'S' : d.unit === 'MM' ? 'mm' : '"'}`,
                d.qty,
                d.area.toFixed(2),
                `Rs. ${d.cost.toLocaleString()}`
            ]),
            foot: [['', '', 'TOTALS', totalStats.area.toFixed(2), `Rs. ${totalStats.cost.toLocaleString()}`]],
            headStyles: { fillColor: primaryColor }
        });

        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(14);
        doc.text('Hardware Requirements', 20, finalY);
        doc.autoTable({
            startY: finalY + 5,
            head: [['Item', 'Total Quantity Required']],
            body: [
                ['Nylon Rollers', `${totalStats.rollers} Pcs`],
                ['S.S. Star Locks', `${totalStats.locks} Pcs`],
                ['Self Tapping Screws', `${totalStats.screws} Pcs (Approx)`],
                ['Wool Pile (Metres)', `${(totalStats.area * 0.5).toFixed(0)} Mtrs`]
            ],
            theme: 'grid'
        });

        doc.save(`${partyName || 'Winsizer'}_Bulk_Report.pdf`);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header section */}
            <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-md shadow-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="Winsizer" className="h-12 w-auto object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1A1A1A] uppercase tracking-tighter">Bulk Order Calculator</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Multi-Window Precision System</p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:w-64 space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Party Name</label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                value={partyName}
                                onChange={(e) => setPartyName(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 md:w-40 space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Rate / SqFt</label>
                            <div className="relative">
                                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full pl-10 pr-4 py-3 bg-light-grey border border-slate-200 rounded-md focus:ring-2 focus:ring-primary outline-none font-bold"
                                    value={ratePerSqFt}
                                    onChange={(e) => setRatePerSqFt(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Form Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm space-y-6 sticky top-24">
                        <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-widest flex items-center gap-2 border-b pb-4">
                            <Plus size={16} className="text-primary" /> Add New Window
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location / Remark</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bed 1, Hall Front"
                                    className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md outline-none font-bold text-sm"
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Width</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                            value={newItem.width}
                                            onChange={(e) => setNewItem({ ...newItem, width: e.target.value })}
                                        />
                                        {newItem.unit === 'Soot' && newItem.width && (
                                            <span className="absolute right-2 bottom-1 text-[8px] text-slate-400">≈ {(parseFloat(newItem.width) * 3.175).toFixed(1)}mm</span>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Height</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                            value={newItem.height}
                                            onChange={(e) => setNewItem({ ...newItem, height: e.target.value })}
                                        />
                                        {newItem.unit === 'Soot' && newItem.height && (
                                            <span className="absolute right-2 bottom-1 text-[8px] text-slate-400">≈ {(parseFloat(newItem.height) * 3.175).toFixed(1)}mm</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-md outline-none font-bold text-xs"
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                    >
                                        <option value="Inches">Inches</option>
                                        <option value="MM">MM</option>
                                        <option value="Soot">Soot</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tracks</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-md outline-none font-bold text-xs"
                                        value={newItem.tracks}
                                        onChange={(e) => setNewItem({ ...newItem, tracks: e.target.value })}
                                    >
                                        <option value="2">2 Track</option>
                                        <option value="3">3 Track</option>
                                        <option value="4">4 Track</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-light-grey border border-slate-200 rounded-md outline-none font-bold"
                                    value={newItem.qty}
                                    onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={addWindow}
                                className="w-full bg-primary text-white font-black py-4 rounded-md shadow-lg hover:bg-primary-dark transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add to Order
                            </button>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="w-full flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400"
                            >
                                <span>Reduction Settings (Inches)</span>
                                <Settings size={14} />
                            </button>
                            {showAdvanced && (
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    {Object.keys(reductions).map(k => (
                                        <div key={k} className="space-y-1">
                                            <label className="text-[8px] font-bold text-slate-400 uppercase">{k}</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 bg-light-grey border rounded text-xs font-bold"
                                                value={reductions[k]}
                                                onChange={(e) => setReductions({ ...reductions, [k]: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={resetReductions} className="col-span-2 text-[8px] uppercase font-bold text-primary mt-2">Reset Defaults</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* List & Tabs Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="flex bg-light-grey border-b  overflow-x-auto">
                            {[
                                { id: 'list', label: 'Order List', icon: <List size={16} /> },
                                { id: 'aluminium', label: 'Aluminium List', icon: <HardHat size={16} /> },
                                { id: 'glass', label: 'Glass List', icon: <FileSpreadsheet size={16} /> },
                                { id: 'invoice', label: 'Final Invoice', icon: <IndianRupee size={16} /> }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`px-6 py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-w-fit flex-1 ${activeTab === t.id ? 'bg-white border-t-4 border-primary text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'list' && (
                                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        {windows.length === 0 ? (
                                            <div className="py-20 text-center opacity-30">
                                                <ClipboardList size={48} className="mx-auto mb-4" />
                                                <p className="font-black uppercase tracking-widest text-xs">Your list is empty. Add windows to begin.</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b-2 border-slate-100 italic">
                                                            <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">Location</th>
                                                            <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actual Size</th>
                                                            <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">MM Version</th>
                                                            <th className="py-3 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Qty</th>
                                                            <th className="py-3"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {calculatedData.map(w => (
                                                            <tr key={w.id} className="group hover:bg-slate-50 transition-colors">
                                                                <td className="py-4 font-black text-slate-800 uppercase text-sm">{w.location || 'Window'}</td>
                                                                <td className="py-4 text-center font-bold text-slate-500">{w.width}x{w.height} <span className="text-[10px] lowercase text-slate-300">{w.unit}</span></td>
                                                                <td className="py-4 text-center font-bold text-slate-400 text-xs">{w.wMM.toFixed(0)}x{w.hMM.toFixed(0)} mm</td>
                                                                <td className="py-4 text-center font-black text-primary">{w.qty}</td>
                                                                <td className="py-4 text-right">
                                                                    <button onClick={() => removeWindow(w.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'aluminium' && (
                                    <motion.div key="aluminium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                        <div className="bg-primary/5 p-4 rounded-md border border-primary/10 flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest">Aluminium Cutting Table</span>
                                            <span className="text-[10px] font-bold text-slate-400 italic">Reductions: H:-{reductions.handle}", W:-{reductions.bearing}"</span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-[#1A1A1A] text-white">
                                                    <tr>
                                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest">Location</th>
                                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest">Patti/Hdl (Ht)</th>
                                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest">Bottom (Wd)</th>
                                                        <th className="p-4 text-[10px] font-black uppercase tracking-widest">Total Pcs</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y border-x border-b">
                                                    {calculatedData.map(d => (
                                                        <tr key={d.id} className="hover:bg-slate-50">
                                                            <td className="p-4 font-black text-slate-800 uppercase">{d.location}</td>
                                                            <td className="p-4 font-bold text-primary">{d.handlePattiHeight.toFixed(2)}"</td>
                                                            <td className="p-4 font-bold text-primary">{d.bearingBottomWidth.toFixed(2)}"</td>
                                                            <td className="p-4 text-slate-500 text-xs font-bold">
                                                                H: {d.qty * d.tracks * 2} | W: {d.qty * d.tracks}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'glass' && (
                                    <motion.div key="glass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="bg-slate-900 p-6 rounded-md text-white mb-6 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <Box className="text-primary" />
                                                <span className="font-black uppercase tracking-widest text-[11px]">Glass Cutting Manifest</span>
                                            </div>
                                            <span className="text-primary font-black text-xl">{totalStats.glassPcs} <span className="text-[10px] uppercase">Pcs</span></span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border rounded-md">
                                                <thead className="bg-light-grey border-b">
                                                    <tr>
                                                        <th className="p-4 font-black uppercase text-[10px]">Location</th>
                                                        <th className="p-4 font-black uppercase text-[10px] text-center">Height (In)</th>
                                                        <th className="p-4 font-black uppercase text-[10px] text-center">Width (In)</th>
                                                        <th className="p-4 font-black uppercase text-[10px] text-center">Total Pcs</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {calculatedData.map(d => (
                                                        <tr key={d.id} className="hover:bg-blue-50/30">
                                                            <td className="p-4 font-bold uppercase">{d.location}</td>
                                                            <td className="p-4 font-black text-primary text-center">{d.glassHeight.toFixed(2)}"</td>
                                                            <td className="p-4 font-black text-primary text-center">{d.glassWidth.toFixed(2)}"</td>
                                                            <td className="p-4 font-black text-center bg-slate-50">{d.qty * d.tracks}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'invoice' && (
                                    <motion.div key="invoice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-y">
                                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500">Item Details</th>
                                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Area (SqFt)</th>
                                                        <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {calculatedData.map(d => (
                                                        <tr key={d.id} className="border-b">
                                                            <td className="p-4">
                                                                <p className="font-black uppercase text-sm">{d.location}</p>
                                                                <p className="text-slate-400 text-[10px] font-bold">{roundToHalfFt(d.wIn)}' x {roundToHalfFt(d.hIn)}' | {d.qty} Unit</p>
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-slate-600">{d.area.toFixed(2)}</td>
                                                            <td className="p-4 text-right font-black text-[#1A1A1A]">₹ {d.cost.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="bg-primary text-white p-10 rounded-md flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <IndianRupee size={150} />
                                            </div>
                                            <div className="text-center md:text-left relative z-10">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Total Party Balance</p>
                                                <p className="text-6xl font-black">₹ {totalStats.cost.toLocaleString()}</p>
                                                <div className="flex gap-4 mt-4 opacity-70 font-bold text-xs">
                                                    <span>Area: {totalStats.area.toFixed(2)} SqFt</span>
                                                    <span>|</span>
                                                    <span>Windows: {calculatedData.length}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={downloadPDF}
                                                className="bg-white text-primary px-10 py-5 rounded-md font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:scale-105 transition-transform shadow-xl w-full md:w-auto justify-center relative z-10"
                                            >
                                                <Download size={20} /> Download Master Report
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Rollers', val: totalStats.rollers },
                                                { label: 'Locks', val: totalStats.locks },
                                                { label: 'Screws', val: '~' + totalStats.screws },
                                                { label: 'Wool Pile', val: (totalStats.area * 0.5).toFixed(0) + 'm' }
                                            ].map(i => (
                                                <div key={i.label} className="bg-slate-50 p-4 rounded border text-center">
                                                    <p className="text-lg font-black">{i.val}</p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">{i.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegularSlidingWindowCalculator;
