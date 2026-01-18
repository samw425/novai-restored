import React from 'react';
import { Link } from 'react-router-dom';
import { VueLogo } from '../brand/Logo';
import { MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-vue-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <VueLogo size={32} />
                            <span className="text-xl font-black tracking-tight text-white">VUE</span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-6">
                            Your next watch, decided. We cut through the noise to give you one clear verdict.
                        </p>
                    </div>

                    {/* Browse */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Browse</h4>
                        <ul className="space-y-3">
                            <li><Link to="/movies" className="text-white/50 hover:text-white text-sm transition-colors">Movies</Link></li>
                            <li><Link to="/tv" className="text-white/50 hover:text-white text-sm transition-colors">TV Shows</Link></li>
                            <li><Link to="/trending" className="text-white/50 hover:text-white text-sm transition-colors">Trending</Link></li>
                            <li><Link to="/what-to-watch" className="text-white/50 hover:text-white text-sm transition-colors">What to Watch</Link></li>
                            <li><Link to="/new-releases" className="text-white/50 hover:text-white text-sm transition-colors">New Releases</Link></li>
                        </ul>
                    </div>

                    {/* Platforms */}
                    <div>
                        <h4 className="text-white font-bold mb-4">Platforms</h4>
                        <ul className="space-y-3">
                            <li><Link to="/platform/netflix" className="text-white/50 hover:text-white text-sm transition-colors">Netflix</Link></li>
                            <li><Link to="/platform/disney" className="text-white/50 hover:text-white text-sm transition-colors">Disney+</Link></li>
                            <li><Link to="/platform/max" className="text-white/50 hover:text-white text-sm transition-colors">Max</Link></li>
                            <li><Link to="/platform/prime" className="text-white/50 hover:text-white text-sm transition-colors">Prime Video</Link></li>
                            <li><Link to="/platform/hulu" className="text-white/50 hover:text-white text-sm transition-colors">Hulu</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-bold mb-4">VUE</h4>
                        <ul className="space-y-3">
                            <li><Link to="/critics-picks" className="text-white/50 hover:text-white text-sm transition-colors">Critics' Picks</Link></li>
                            <li><Link to="/audience-favorites" className="text-white/50 hover:text-white text-sm transition-colors">Audience Favorites</Link></li>
                            <li><Link to="/youtube" className="text-white/50 hover:text-white text-sm transition-colors">YouTube Trending</Link></li>
                            <li><Link to="/feedback" className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1">
                                <MessageSquare size={14} /> Feedback
                            </Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-sm">
                        © 2026 VUE. Stream Smart.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/feedback" className="text-white/30 hover:text-white transition-colors">Feedback</Link>
                        <a href="#" className="text-white/30 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-white/30 hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
