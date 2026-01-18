import React from 'react';
import { Link } from 'react-router-dom';
import { VueLogo } from '../brand/Logo';
import { Play, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const WelcomeHero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-vue-black">
            {/* Subtle gradient background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-vue-maroon/5 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-10"
                >
                    <VueLogo size={72} />
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]"
                >
                    Your next watch,
                    <br />
                    <span className="text-vue-maroon">decided.</span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-white/50 max-w-xl mx-auto mb-12 leading-relaxed"
                >
                    We cut through the noise. Critics, audiences, trending data—all distilled
                    into one verdict so you never waste time on bad content again.
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        to="/movies"
                        className="flex items-center gap-2 px-8 py-4 rounded-full bg-vue-maroon text-white font-bold text-lg hover:brightness-110 transition-all"
                    >
                        <Play size={20} fill="white" />
                        Start Browsing
                    </Link>
                    <Link
                        to="/tv"
                        className="flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
                    >
                        Popular Right Now
                    </Link>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-20 flex flex-col items-center"
                >
                    <div className="flex items-center gap-8 text-white/30 text-sm">
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span>10 platforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} />
                            <span>Updated hourly</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-vue-maroon"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default WelcomeHero;
