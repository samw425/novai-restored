import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Home, Shield, Users, Scale } from "lucide-react";

export const metadata = {
    title: "Fair Housing Policy | Zenith",
    description: "Zenith's commitment to Fair Housing and equal opportunity in real estate.",
};

export default function FairHousingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="container py-12 max-w-3xl">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 rounded-full bg-[var(--zenith-blue-light)] flex items-center justify-center mx-auto mb-6">
                        <Home className="w-10 h-10 text-[var(--zenith-blue)]" />
                    </div>
                    <h1 className="text-h1 mb-4">Fair Housing Policy</h1>
                    <p className="text-lg text-gray-600">
                        Zenith is committed to equal opportunity in housing for all people.
                    </p>
                </div>

                {/* Equal Housing Logo & Statement */}
                <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-center border border-gray-200">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L20 8v8l-8 4-8-4V8l8-3.82z" />
                            <path d="M12 6a3 3 0 100 6 3 3 0 000-6zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Equal Housing Opportunity</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        We are pledged to the letter and spirit of U.S. policy for the achievement of
                        equal housing opportunity throughout the nation.
                    </p>
                </div>

                <div className="prose prose-gray max-w-none">
                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">The Fair Housing Act</h2>
                        <p className="text-body text-gray-600">
                            The Fair Housing Act prohibits discrimination in the sale, rental, and financing
                            of housing based on:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-6">
                            {[
                                "Race",
                                "Color",
                                "Religion",
                                "Sex",
                                "National Origin",
                                "Disability",
                                "Familial Status",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <Shield className="w-5 h-5 text-[var(--zenith-blue)]" />
                                    <span className="font-medium text-gray-900">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">Our Commitment</h2>
                        <p className="text-body text-gray-600 mb-4">Zenith will:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Provide equal professional service to all persons</li>
                            <li>Prohibit discriminatory language in all property listings</li>
                            <li>Remove listings that violate Fair Housing principles</li>
                            <li>Take action against users who discriminate</li>
                            <li>Educate our community about fair housing rights</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">Prohibited Conduct</h2>
                        <p className="text-body text-gray-600 mb-4">The following are prohibited on Zenith:</p>
                        <ul className="list-disc pl-6 text-body text-gray-600 space-y-2">
                            <li>Refusing to sell or rent based on protected class</li>
                            <li>Setting different terms or conditions based on protected class</li>
                            <li>Advertising preferences or limitations based on protected class</li>
                            <li>Steering buyers to certain neighborhoods based on protected class</li>
                            <li>Asking about protected characteristics during inquiries</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">Listing Guidelines</h2>
                        <p className="text-body text-gray-600 mb-4">
                            When creating a listing, describe the property—not the ideal buyer. Examples:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="font-bold text-red-600 text-sm mb-2">❌ Not Allowed</p>
                                <ul className="text-sm text-red-700 space-y-1">
                                    <li>"Perfect for singles"</li>
                                    <li>"Great Christian neighborhood"</li>
                                    <li>"No children"</li>
                                    <li>"Walking distance to church"</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="font-bold text-green-600 text-sm mb-2">✓ Allowed</p>
                                <ul className="text-sm text-green-700 space-y-1">
                                    <li>"Open floor plan"</li>
                                    <li>"Quiet neighborhood"</li>
                                    <li>"Near parks and schools"</li>
                                    <li>"Recently renovated"</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-h2 mb-4">Report Discrimination</h2>
                        <p className="text-body text-gray-600 mb-4">
                            If you believe you have experienced discrimination:
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[var(--zenith-blue-light)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--zenith-blue)] font-bold">1</span>
                                </div>
                                <div>
                                    <p className="font-medium">Report to Zenith</p>
                                    <p className="text-sm text-gray-500">Email: fairhousing@zenith.homes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[var(--zenith-blue-light)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--zenith-blue)] font-bold">2</span>
                                </div>
                                <div>
                                    <p className="font-medium">File with HUD</p>
                                    <p className="text-sm text-gray-500">
                                        U.S. Department of Housing and Urban Development<br />
                                        1-800-669-9777 | hud.gov/fairhousing
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-[var(--zenith-blue-light)] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[var(--zenith-blue)] font-bold">3</span>
                                </div>
                                <div>
                                    <p className="font-medium">Contact a Fair Housing Organization</p>
                                    <p className="text-sm text-gray-500">nationalfairhousing.org</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
