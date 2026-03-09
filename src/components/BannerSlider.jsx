import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerSlider = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const q = query(collection(db, 'banners'), where('enabled', '==', true));
                const snap = await getDocs(q);
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBanners(data);
            } catch (err) {
                console.error("Slider fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    // Auto-play
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, banners]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    if (loading) return <div className="h-[500px] w-full bg-[#1A1A1A] animate-pulse" />;
    if (banners.length === 0) return null; // Fallback handled in Home.jsx

    const currentBanner = banners[currentIndex];

    return (
        <section className="relative h-[600px] sm:h-[700px] w-full overflow-hidden bg-[#0F172A]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBanner.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={currentBanner.image}
                            alt={currentBanner.heading}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/80 to-transparent" />
                        <div className="absolute inset-0 bg-black/40 md:hidden" /> {/* Extra dark for mobile text legibility */}
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="max-w-2xl"
                        >
                            <h2 className="text-4xl sm:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-6 uppercase">
                                {currentBanner.heading.split(' ').map((word, i) => (
                                    <span key={i} className={i % 2 !== 0 ? 'text-primary' : ''}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h2>
                            <p className="text-lg sm:text-xl text-white/70 font-medium mb-10 leading-relaxed">
                                {currentBanner.subheading}
                            </p>

                            <Link
                                to={currentBanner.link}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-white hover:text-primary text-white font-black py-5 px-10 rounded-md transition-all uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 group"
                            >
                                {currentBanner.buttonText}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all backdrop-blur-md hidden sm:block"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all backdrop-blur-md hidden sm:block"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {banners.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 transition-all rounded-full ${currentIndex === i ? 'w-10 bg-primary' : 'w-4 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default BannerSlider;
