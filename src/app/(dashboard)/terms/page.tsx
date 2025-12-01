export default function TermsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-sm text-gray-500">Last Updated: December 1, 2025</p>
                </div>

                <div className="prose prose-slate max-w-none">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            By accessing and using Novai ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">2. Description of Service</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Novai is an advanced open-source intelligence aggregation platform that monitors AI developments, global threats, and critical infrastructure in real-time. The Service provides curated intelligence feeds, analysis, and insights from verified global sources.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">3. User Responsibilities</h2>
                        <p className="text-gray-600 leading-relaxed">You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-600">
                            <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                            <li>Not use the Service to transmit any unlawful, harassing, defamatory, abusive, or fraudulent content</li>
                            <li>Not attempt to gain unauthorized access to any portion of the Service</li>
                            <li>Not interfere with or disrupt the Service or servers connected to the Service</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">4. Intelligence Data</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The intelligence data provided through Novai is aggregated from publicly available sources. While we strive for accuracy, we make no warranties regarding the completeness, accuracy, or reliability of any information provided. Users should independently verify critical information.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property</h2>
                        <p className="text-gray-600 leading-relaxed">
                            The Service and its original content, features, and functionality are owned by Novai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Content aggregated from third-party sources remains the property of those respective owners.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">6. Disclaimer of Warranties</h2>
                        <p className="text-gray-600 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NOVAI DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            IN NO EVENT SHALL NOVAI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">8. Changes to Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">9. Governing Law</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">10. Contact</h2>
                        <p className="text-gray-600 leading-relaxed">
                            If you have any questions about these Terms, please contact us through our <a href="/feedback" className="text-blue-600 hover:underline">feedback page</a>.
                        </p>
                    </section>
                </div>

                <div className="pt-8 border-t border-gray-200">
                    <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
