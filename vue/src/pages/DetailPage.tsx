import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDetails, getImageUrl, getVerdict } from '../lib/api';
import { Play, Star, Clock, Calendar, Users, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const DetailPage: React.FC = () => {
    const { type, id } = useParams<{ type: 'movie' | 'tv'; id: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id || !type) return;
            setLoading(true);
            const details = await getDetails(parseInt(id), type as 'movie' | 'tv');
            setData(details);
            setLoading(false);
        };
        fetchDetails();
    }, [id, type]);

    if (loading) {
        return (
            <div className="min-h-screen bg-vue-black flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-2 border-vue-green border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-vue-black flex items-center justify-center">
                <p className="text-white/50">Content not found</p>
            </div>
        );
    }

    const title = data.title || data.name;
    const year = (data.release_date || data.first_air_date)?.slice(0, 4);
    const { verdict, color } = getVerdict(data.vote_average);
    const score = Math.round(data.vote_average * 10);
    const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    const watchProviders = data['watch/providers']?.results?.US;
    const cast = data.credits?.cast?.slice(0, 10) || [];
    const runtime = data.runtime || (data.episode_run_time?.[0]);

    return (
        <main className="min-h-screen bg-vue-black">
            {/* Hero Background */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={getImageUrl(data.backdrop_path, 'original')}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-vue-black via-vue-black/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-vue-black via-transparent to-vue-black/50" />

                {/* Back button */}
                <Link
                    to="/"
                    className="absolute top-24 left-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </Link>
            </div>

            {/* Content */}
            <div className="relative -mt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Poster */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-64 flex-shrink-0 hidden lg:block"
                    >
                        <img
                            src={getImageUrl(data.poster_path)}
                            alt={title}
                            className="w-full rounded-2xl shadow-2xl"
                        />
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1"
                    >
                        {/* VUE Verdict */}
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="px-4 py-2 rounded-xl text-lg font-black tracking-wider"
                                style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
                            >
                                VUE SAYS: {verdict}
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Star size={18} className="text-yellow-400" fill="currentColor" />
                                <span className="font-bold">{score}%</span>
                                <span className="text-white/40">({data.vote_count?.toLocaleString()} votes)</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4">
                            {title}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-white/60 mb-6">
                            {year && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} />
                                    <span>{year}</span>
                                </div>
                            )}
                            {runtime && (
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} />
                                    <span>{runtime} min</span>
                                </div>
                            )}
                            {data.genres?.map((g: any) => (
                                <span key={g.id} className="px-3 py-1 rounded-full bg-white/10 text-sm">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
                            {data.overview}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            {trailer && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-vue-green text-black font-bold text-lg hover:brightness-110 transition-all"
                                >
                                    <Play size={20} fill="black" />
                                    Watch Trailer
                                </a>
                            )}
                        </div>

                        {/* Where to Watch */}
                        {watchProviders && (
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <ExternalLink size={20} />
                                    Where to Watch
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {watchProviders.flatrate?.map((p: any) => (
                                        <div
                                            key={p.provider_id}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                                        >
                                            <img
                                                src={getImageUrl(p.logo_path)}
                                                alt={p.provider_name}
                                                className="w-6 h-6 rounded"
                                            />
                                            <span className="text-sm font-medium text-white">{p.provider_name}</span>
                                        </div>
                                    ))}
                                    {watchProviders.rent?.slice(0, 3).map((p: any) => (
                                        <div
                                            key={p.provider_id}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5"
                                        >
                                            <img
                                                src={getImageUrl(p.logo_path)}
                                                alt={p.provider_name}
                                                className="w-6 h-6 rounded"
                                            />
                                            <span className="text-sm font-medium text-white/70">{p.provider_name}</span>
                                            <span className="text-xs text-white/40">(Rent)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cast */}
                        {cast.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Users size={20} />
                                    Cast
                                </h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {cast.map((person: any) => (
                                        <div key={person.id} className="flex-shrink-0 w-24 text-center">
                                            <img
                                                src={person.profile_path ? getImageUrl(person.profile_path) : 'https://via.placeholder.com/100x150?text=No+Photo'}
                                                alt={person.name}
                                                className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                                            />
                                            <p className="text-sm font-medium text-white truncate">{person.name}</p>
                                            <p className="text-xs text-white/50 truncate">{person.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default DetailPage;
