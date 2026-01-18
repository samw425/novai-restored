import React from 'react';
import { Link } from 'react-router-dom';
import type { ContentItem } from '../../lib/api';
import { getImageUrl, getVerdict } from '../../lib/api';
import { Play, Info, Star } from 'lucide-react';

interface ContentCardProps {
    item: ContentItem;
    showVerdict?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, showVerdict = true, size = 'md' }) => {
    const title = item.title || item.name || 'Unknown';
    const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || '';
    const score = Math.round(item.vote_average * 10);
    const { verdict, color } = getVerdict(item.vote_average);

    const sizeClasses = {
        sm: 'w-32',
        md: 'w-44',
        lg: 'w-56',
    };

    return (
        <Link
            to={`/${item.media_type}/${item.id}`}
            className={`group flex-shrink-0 ${sizeClasses[size]}`}
        >
            <div className="relative overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-vue-green/10">
                {/* Poster */}
                <div className="aspect-[2/3] relative">
                    <img
                        src={getImageUrl(item.poster_path)}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Verdict badge */}
                    {showVerdict && (
                        <div
                            className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-black tracking-wider"
                            style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
                        >
                            {verdict}
                        </div>
                    )}

                    {/* Score badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                        <Star size={10} className="text-yellow-400" fill="currentColor" />
                        <span className="text-[10px] font-bold text-white">{score}%</span>
                    </div>

                    {/* Hover actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform">
                        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-vue-green text-black text-xs font-bold hover:brightness-110 transition-all">
                            <Play size={12} fill="black" />
                            Watch
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                            <Info size={14} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Title */}
            <div className="mt-3 px-1">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-vue-green transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                    {year} • {item.media_type === 'movie' ? 'Movie' : 'TV Series'}
                </p>
            </div>
        </Link>
    );
};

export default ContentCard;
