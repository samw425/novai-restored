import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Terms of Service | Zenith",
    description: "Terms of Service for using the Zenith P2P real estate marketplace platform.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="container py-12 max-w-3xl">
                <h1 className="text-h1 mb-8">Terms of Service</h1>
                <p className="text-sm text-gray-500 mb-8">Last Updated: January 17, 2026</p>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">1. Platform Description</h2>
                        <p className="text-body text-gray-600 mb-4">
                            Zenith ("Platform," "we," "us," or "our") is a technology platform that connects
                            property buyers and sellers directly. Zenith is <strong>not a licensed real estate
                                broker, agent, or brokerage</strong>. We do not represent buyers or sellers in any
                            real estate transaction.
                        </p>
                        <p className="text-body text-gray-600">
                            The Platform provides tools and data to facilitate direct communication between
                            private parties. All negotiations, agreements, and transactions are solely between
                            the buyer and seller.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">2. User Responsibilities</h2>
                        <p className="text-body text-gray-600 mb-4">By using Zenith, you agree to:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Provide accurate information about yourself and any properties you list</li>
                            <li>Only list properties you legally own or have authority to sell</li>
                            <li>Comply with all applicable federal, state, and local laws</li>
                            <li>Not use the Platform for fraudulent or illegal purposes</li>
                            <li>Conduct your own due diligence before any transaction</li>
                            <li>Engage licensed professionals (attorneys, inspectors, title companies) as needed</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">3. No Professional Advice</h2>
                        <p className="text-body text-gray-600">
                            Zenith does not provide legal, financial, tax, or real estate advice. Property
                            valuations ("ZenEstimate") are automated estimates and are <strong>not appraisals</strong>.
                            You should consult licensed professionals for any matters requiring professional expertise.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">4. Skip Trace Data Usage</h2>
                        <p className="text-body text-gray-600 mb-4">
                            If you access owner contact information through our skip trace feature, you agree to:
                        </p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Use this information solely for legitimate real estate inquiries</li>
                            <li>Not use the data for harassment, stalking, debt collection, or any illegal purpose</li>
                            <li>Comply with the Telephone Consumer Protection Act (TCPA) and Do Not Call regulations</li>
                            <li>Not resell, redistribute, or share this data with third parties</li>
                        </ul>
                        <p className="text-body text-gray-600 mt-4">
                            Violation of these terms will result in immediate account termination and may
                            result in legal action.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">5. Limitation of Liability</h2>
                        <p className="text-body text-gray-600">
                            Zenith is not responsible for:
                        </p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2 mt-4">
                            <li>The accuracy of property listings or user-provided information</li>
                            <li>The outcome of any transaction between users</li>
                            <li>Property conditions, title issues, or undisclosed defects</li>
                            <li>Disputes between buyers and sellers</li>
                            <li>Any losses arising from use of the Platform</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">6. Fair Housing Compliance</h2>
                        <p className="text-body text-gray-600">
                            All users must comply with the Fair Housing Act. Discrimination based on race,
                            color, religion, sex, national origin, disability, or familial status is strictly
                            prohibited. Listings containing discriminatory language will be removed, and users
                            may be banned from the Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">7. Account Termination</h2>
                        <p className="text-body text-gray-600">
                            We reserve the right to suspend or terminate accounts that violate these Terms,
                            engage in fraudulent activity, or otherwise abuse the Platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">8. Changes to Terms</h2>
                        <p className="text-body text-gray-600">
                            We may update these Terms at any time. Continued use of the Platform after changes
                            constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">9. Contact</h2>
                        <p className="text-body text-gray-600">
                            For questions about these Terms, contact us at legal@zenith.homes
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
