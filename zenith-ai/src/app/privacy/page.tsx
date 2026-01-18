import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Privacy Policy | Zenith",
    description: "Privacy Policy for the Zenith P2P real estate marketplace platform.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="container py-12 max-w-3xl">
                <h1 className="text-h1 mb-8">Privacy Policy</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: January 17, 2026</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">1. Information We Collect</h2>
                        <p className="text-body text-gray-600 mb-4">We collect information you provide directly:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li><strong>Account Information:</strong> Name, email, phone number</li>
                            <li><strong>Property Listings:</strong> Address, photos, descriptions, pricing</li>
                            <li><strong>Transaction Data:</strong> Inquiries, messages, saved searches</li>
                            <li><strong>Payment Information:</strong> Processed securely via Stripe</li>
                        </ul>

                        <p className="text-body text-gray-600 mt-4 mb-4">We automatically collect:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                            <li>Usage patterns and search history</li>
                            <li>Cookies and similar technologies</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Provide and improve the Platform</li>
                            <li>Connect buyers and sellers</li>
                            <li>Send transaction-related communications</li>
                            <li>Personalize your experience</li>
                            <li>Prevent fraud and enforce our Terms</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">3. Information Sharing</h2>
                        <p className="text-body text-gray-600 mb-4">We may share information with:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li><strong>Other Users:</strong> When you list a property or send an inquiry</li>
                            <li><strong>Service Providers:</strong> For payment processing, analytics, hosting</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                        </ul>
                        <p className="text-body text-gray-600 mt-4">
                            We do <strong>not</strong> sell your personal information to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">4. Skip Trace Data</h2>
                        <p className="text-body text-gray-600">
                            Owner contact information provided through skip trace services is sourced from
                            public records and third-party data providers. This data is provided for legitimate
                            real estate inquiry purposes only. We maintain logs of skip trace requests for
                            compliance and abuse prevention.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">5. Your Rights (CCPA/GDPR)</h2>
                        <p className="text-body text-gray-600 mb-4">Depending on your jurisdiction, you may have the right to:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Access your personal data</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of data sales (we don't sell data)</li>
                            <li>Request data portability</li>
                            <li>Correct inaccurate information</li>
                        </ul>
                        <p className="text-body text-gray-600 mt-4">
                            To exercise these rights, contact privacy@zenith.homes
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">6. Data Security</h2>
                        <p className="text-body text-gray-600">
                            We implement industry-standard security measures including encryption, secure
                            data storage, and access controls. However, no system is completely secure,
                            and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">7. Cookies</h2>
                        <p className="text-body text-gray-600">
                            We use cookies and similar technologies for authentication, preferences, and
                            analytics. You can control cookies through your browser settings, though some
                            features may not function properly without them.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">8. Children's Privacy</h2>
                        <p className="text-body text-gray-600">
                            Zenith is not intended for users under 18 years of age. We do not knowingly
                            collect information from children.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">9. Contact Us</h2>
                        <p className="text-body text-gray-600">
                            For privacy-related questions: privacy@zenith.homes
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
