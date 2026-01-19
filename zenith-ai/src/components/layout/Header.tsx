"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search } from "lucide-react";

interface HeaderProps {
    onSearchOpen?: () => void;
    variant?: "default" | "transparent";
}

export default function Header({ onSearchOpen, variant = "default" }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);

    return (
        <header className={`header ${variant === "transparent" ? "bg-transparent border-transparent" : ""}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <Image
                    src="/zenith-logo.png"
                    alt="Zenith"
                    width={140}
                    height={40}
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                    priority
                />
            </Link>


            {/* Desktop Navigation */}
            <nav className="header-nav">
                <div
                    className="relative"
                    onMouseEnter={() => setBuyDropdownOpen(true)}
                    onMouseLeave={() => setBuyDropdownOpen(false)}
                >
                    <button className="header-nav-link flex items-center gap-1">
                        Buy
                        <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                        {buyDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                className="absolute top-full left-0 mt-2 w-56 bg-white border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
                            >
                                <div className="p-2">
                                    <Link href="/search?type=off-market" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Off-Market Properties
                                    </Link>
                                    <Link href="/search?type=fsbo" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        For Sale by Owner
                                    </Link>
                                    <Link href="/search?type=pre-foreclosure" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Pre-Foreclosure
                                    </Link>
                                    <Link href="/search?type=motivated" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                        Motivated Sellers
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100 p-2">
                                    <Link href="/pricing" className="block px-4 py-2.5 text-sm font-medium text-[var(--zenith-blue)] hover:bg-blue-50 rounded-lg transition-colors">
                                        View Pricing Plans
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Link href="/list-property" className="header-nav-link">
                    Sell
                </Link>

                <Link href="/how-it-works" className="header-nav-link">
                    How It Works
                </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="header-actions">
                <button
                    onClick={onSearchOpen}
                    className="btn btn-ghost btn-sm md:hidden"
                >
                    <Search className="w-5 h-5" />
                </button>

                <Link href="/login" className="btn btn-ghost btn-sm hidden md:flex">
                    Sign In
                </Link>

                <Link href="/list-property" className="btn btn-primary btn-sm hidden md:flex">
                    List Your Property
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-ghost btn-sm md:hidden"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg md:hidden overflow-hidden z-50"
                    >
                        <nav className="p-4 space-y-1">
                            <Link
                                href="/search"
                                className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse Properties
                            </Link>
                            <Link
                                href="/list-property"
                                className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sell Your Property
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/pricing"
                                className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>

                            <div className="border-t border-gray-100 pt-4 mt-4 space-y-2">
                                <Link
                                    href="/login"
                                    className="block w-full text-center px-4 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/list-property"
                                    className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-[#006AFF] to-[#3B82F6] rounded-xl hover:opacity-90 transition-opacity"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    List Your Property — Free
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
