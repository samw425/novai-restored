"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                {/* Company */}
                <div className="footer-section">
                    <h4>Company</h4>
                    <div className="footer-links">
                        <Link href="/about" className="footer-link">About Zenith</Link>
                        <Link href="/how-it-works" className="footer-link">How It Works</Link>
                        <Link href="/pricing" className="footer-link">Pricing</Link>
                        <Link href="/careers" className="footer-link">Careers</Link>
                        <Link href="/press" className="footer-link">Press</Link>
                    </div>
                </div>

                {/* For Buyers */}
                <div className="footer-section">
                    <h4>For Buyers</h4>
                    <div className="footer-links">
                        <Link href="/search" className="footer-link">Browse Properties</Link>
                        <Link href="/search?type=fsbo" className="footer-link">FSBO Listings</Link>
                        <Link href="/search?type=off-market" className="footer-link">Off-Market Deals</Link>
                        <Link href="/buyer-dashboard" className="footer-link">Buyer Dashboard</Link>
                        <Link href="/education" className="footer-link">Buyer Resources</Link>
                    </div>
                </div>

                {/* For Sellers */}
                <div className="footer-section">
                    <h4>For Sellers</h4>
                    <div className="footer-links">
                        <Link href="/list-property" className="footer-link">List Your Property</Link>
                        <Link href="/home-value" className="footer-link">Get Your Home Value</Link>
                        <Link href="/seller-dashboard" className="footer-link">Seller Dashboard</Link>
                        <Link href="/fsbo-guide" className="footer-link">FSBO Guide</Link>
                        <Link href="/pricing" className="footer-link">Seller Pricing</Link>
                    </div>
                </div>

                {/* Legal */}
                <div className="footer-section">
                    <h4>Legal</h4>
                    <div className="footer-links">
                        <Link href="/terms" className="footer-link">Terms of Service</Link>
                        <Link href="/privacy" className="footer-link">Privacy Policy</Link>
                        <Link href="/fair-housing" className="footer-link">Fair Housing</Link>
                        <Link href="/dmca" className="footer-link">DMCA Policy</Link>
                        <Link href="/accessibility" className="footer-link">Accessibility</Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-900 hover:opacity-80 transition-opacity">
                        <Image
                            src="/zenith-logo.png"
                            alt="Zenith"
                            width={100}
                            height={28}
                            className="h-7 w-auto object-contain"
                        />
                    </Link>
                    <span className="footer-copyright">
                        © {new Date().getFullYear()} Zenith Real Estate Technologies, Inc.
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Fair Housing Badge */}
                    <div className="fair-housing-badge">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8v8l-8 4-8-4V8l8-3.82z" />
                            <path d="M12 6a3 3 0 100 6 3 3 0 000-6zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span>Equal Housing Opportunity</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--zenith-blue)] transition-colors">
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--zenith-blue)] transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--zenith-blue)] transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[var(--zenith-blue)] transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="disclaimer-banner mt-6">
                Zenith is not a licensed real estate broker. We provide a technology platform connecting buyers and sellers directly.
                All negotiations and transactions are between private parties. Consult a licensed professional for legal/financial advice.
            </div>
        </footer>
    );
}
