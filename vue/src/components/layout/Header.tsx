import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { VueBrand } from '../brand/Logo';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Movies', path: '/movies' },
        { label: 'TV Shows', path: '/tv' },
        { label: 'Trending', path: '/trending' },
    ];

    const browseItems = [
        { label: 'What to Watch', path: '/what-to-watch' },
        { label: 'New Releases', path: '/new-releases' },
        { label: 'Critics\' Picks', path: '/critics-picks' },
        { label: 'Audience Favorites', path: '/audience-favorites' },
        { label: 'YouTube', path: '/youtube' },
    ];

    const platformItems = [
        { key: 'netflix', label: 'Netflix' },
        { key: 'prime', label: 'Prime Video' },
        { key: 'disney', label: 'Disney+' },
        { key: 'max', label: 'Max' },
        { key: 'hulu', label: 'Hulu' },
        { key: 'apple', label: 'Apple TV+' },
        { key: 'paramount', label: 'Paramount+' },
        { key: 'peacock', label: 'Peacock' },
        { key: 'tubi', label: 'Tubi' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-vue-black/90 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <VueBrand size={28} />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${location.pathname === item.path
                                        ? 'bg-vue-maroon text-white'
                                        : 'text-white/70 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Browse dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                Browse <ChevronDown size={14} />
                            </button>
                            <div className="absolute top-full left-0 mt-2 py-2 w-48 bg-vue-black border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {browseItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Platforms dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all">
                                Platforms <ChevronDown size={14} />
                            </button>
                            <div className="absolute top-full left-0 mt-2 py-2 w-48 bg-vue-black border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                {platformItems.map((p) => (
                                    <Link
                                        key={p.key}
                                        to={`/platform/${p.key}`}
                                        className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5"
                                    >
                                        {p.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-48 pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-vue-maroon/50 focus:w-64 transition-all"
                            />
                        </div>
                    </form>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-vue-black border-t border-white/10">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5"
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <p className="px-4 py-2 text-xs text-white/30 uppercase">Browse</p>
                            {browseItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <p className="px-4 py-2 text-xs text-white/30 uppercase">Platforms</p>
                            {platformItems.slice(0, 5).map((p) => (
                                <Link
                                    key={p.key}
                                    to={`/platform/${p.key}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5"
                                >
                                    {p.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
