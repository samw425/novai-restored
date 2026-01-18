import React, { useEffect, useState } from 'react';
import type { ContentItem } from '../../lib/api';
import { getImageUrl, getVerdict } from '../../lib/api';
import { Link } from 'react-router-dom';
import { Play, Info, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
    items: ContentItem[];
}

export const Hero: React.FC<HeroProps> = ({ items }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const featured = items.slice(0, 5);

    // Auto-rotate every 6 seconds
    useEffect(() => {
        if (featured.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % featured.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [featured.length]);

    if (!featured.length) {
        return (
            <div className="h-[70vh] bg-gradient-to-b from-vue-maroon/10 to-transparent flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-vue-maroon" size={48} />
                <div className="text-white/50">Loading what's hot...</div>
            </div>
        );
    }

    const current = featured[activeIndex];
    const title = current.title || current.name || 'Unknown';
    const { verdict, color } = getVerdict(current.vote_average);
    const score = Math.round(current.vote_average * 10);
    const mediaType = current.media_type || 'movie';

    return (
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
            {/* Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <img
                        src={getImageUrl(current.backdrop_path, 'original')}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-vue-black via-vue-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-vue-black via-transparent to-vue-black/50" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl"
                    >
                        {/* Badges */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                                <TrendingUp size={14} className="text-vue-maroon" />
                                <span className="text-xs font-bold text-white">Trending #{activeIndex + 1}</span>
                            </div>
                            <div
                                className="px-3 py-1.5 rounded-full text-xs font-black tracking-wider"
                                style={{ backgroundColor: `${color}20`, color: color }}
                            >
                                {verdict} • {score}%
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                            {title}
                        </h1>

                        {/* Overview */}
                        <p className="text-lg text-white/70 line-clamp-3 mb-8 max-w-lg">
                            {current.overview}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/${mediaType}/${current.id}`}
                                className="flex items-center gap-2 px-8 py-4 rounded-full bg-vue-maroon text-white font-bold text-lg hover:brightness-110 transition-all"
                            >
                                <Play size={20} fill="white" />
                                View Details
                            </Link>
                            <Link
                                to={`/${mediaType}/${current.id}`}
                                className="flex items-center gap-2 px-6 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
                            >
                                <Info size={18} />
                                More Info
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {featured.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`h-1 rounded-full transition-all ${i === activeIndex ? 'w-12 bg-vue-maroon' : 'w-4 bg-white/30 hover:bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
