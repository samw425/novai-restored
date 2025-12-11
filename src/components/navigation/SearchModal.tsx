'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, ArrowRight, Command, FileText, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock Data for Search (In a real app, this might come from a localized index or API)
const SEARCH_INDEX = [
    // Navigation
    { title: 'Global Feed', type: 'page', url: '/global-feed', description: 'Real-time intelligence stream.' },
    { title: 'US Intelligence', type: 'page', url: '/us-intel', description: 'Agency profiles and strategic analysis.' },
    { title: 'Market Pulse', type: 'page', url: '/market-pulse', description: 'Capital flow monitoring.' },
    { title: 'Deep Signals', type: 'page', url: '/deep-signals', description: 'Long-form intelligence reports.' },
    { title: 'War Room', type: 'page', url: '/war-room', description: 'Active conflict zone tracking.' },
    { title: 'Lab Tools', type: 'page', url: '/lab-tools', description: 'Access AI analysis tools.' },
    { title: 'LLM Leaderboard', type: 'page', url: '/llms', description: 'Performance metrics for top models.' },

    // Agencies
    { title: 'CIA - Central Intelligence Agency', type: 'agency', url: '/us-intel?agency=CIA', description: 'Foreign intelligence and HUMINT.' },
    { title: 'FBI - Federal Bureau of Investigation', type: 'agency', url: '/us-intel?agency=FBI', description: 'Domestic security and law enforcement.' },
    { title: 'NSA - National Security Agency', type: 'agency', url: '/us-intel?agency=NSA', description: 'SIGINT and cybersecurity.' },
    { title: 'DOD - Department of Defense', type: 'agency', url: '/us-intel?agency=DOD', description: 'Military operations and defense.' },

    // Recent Topics (Static for now, could be dynamic)
    { title: 'Project Stargate', type: 'topic', url: '/deep-signals', description: 'Classified paranormal research review.' },
    { title: 'Semiconductor Supply Chain', type: 'topic', url: '/global-feed', description: 'Critical vulnerability analysis.' },
];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(SEARCH_INDEX);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults(SEARCH_INDEX);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults(SEARCH_INDEX);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = SEARCH_INDEX.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard Navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                router.push(results[selectedIndex].url);
                onClose();
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    }, [results, selectedIndex, router, onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                {/* Search Input */}
                <div className="flex items-center px-4 py-4 border-b border-slate-100">
                    <Search className="w-5 h-5 text-slate-400 mr-3" />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search intelligence, agencies, or analysis..."
                        className="flex-1 text-lg placeholder:text-slate-400 text-slate-900 outline-none bg-transparent font-medium"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 font-mono text-[10px] font-medium text-slate-500">
                            ESC to close
                        </kbd>
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[60vh] overflow-y-auto py-2">
                    {results.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500">
                            <p className="text-sm">No intelligence found matching "{query}"</p>
                        </div>
                    ) : (
                        results.map((result, index) => (
                            <Link
                                key={result.url + index}
                                href={result.url}
                                onClick={onClose}
                                className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors group ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-slate-50'
                                    }`}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg mr-4 ${result.type === 'agency' ? 'bg-slate-100 text-slate-600' :
                                        result.type === 'page' ? 'bg-blue-100 text-blue-600' :
                                            'bg-emerald-100 text-emerald-600'
                                    }`}>
                                    {result.type === 'agency' && <User size={16} />}
                                    {result.type === 'page' && <Globe size={16} />}
                                    {result.type === 'topic' && <FileText size={16} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-semibold ${index === selectedIndex ? 'text-blue-900' : 'text-slate-900'}`}>
                                        {result.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 line-clamp-1">{result.description}</p>
                                </div>
                                {index === selectedIndex && (
                                    <ArrowRight className="w-4 h-4 text-blue-500 animate-in fade-in slide-in-from-left-1" />
                                )}
                            </Link>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase">
                    <span>Novai Intelligence Command</span>
                    <span className="flex items-center gap-1">
                        <Command className="w-3 h-3" /> + K
                    </span>
                </div>
            </div>
        </div>
    );
}
