import { PageHeader } from '@/components/ui/PageHeader';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <PageHeader
                title="Terms of Service"
                description="Rules, regulations, and agreements for using the Novai Intelligence platform."
                icon={<FileText className="w-8 h-8 text-blue-600" />}
            />
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-slate-900 prose-p:text-slate-600">
                <p className="text-sm text-slate-500 mb-8">Last updated: December 1, 2025</p>

                <h3>1. Agreement to Terms</h3>
                <p>
                    By accessing or using the Novai Intelligence platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not access or use our services.
                </p>

                <h3>2. Service Usage License</h3>
                <p>
                    Novai Intelligence grants you a limited, non-exclusive, non-transferable license to access and use the platform for professional intelligence gathering and analysis purposes. This license is strictly conditioned on your compliance with these Terms.
                </p>
                <p>You agree that you will not:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>Use the platform for any illegal purpose or in violation of any local, state, national, or international law.</li>
                    <li>Attempt to reverse engineer, decompile, or disassemble any aspect of the platform.</li>
                    <li>Automate access to the platform (scraping, crawling) without explicit API authorization.</li>
                    <li>Share your account credentials or access with unauthorized third parties.</li>
                </ul>

                <h3>3. Intellectual Property Rights</h3>
                <p>
                    The Novai Intelligence platform, including its algorithms, data aggregation methods, design, and original content, is the exclusive property of Novai Intelligence. All trademarks, service marks, and trade names are proprietary to Novai Intelligence.
                </p>

                <h3>4. Data Accuracy & Reliability</h3>
                <p>
                    While we strive to provide accurate real-time intelligence, Novai Intelligence aggregates data from third-party sources. We do not guarantee the absolute accuracy, completeness, or timeliness of any specific data point. Decisions made based on our intelligence are the sole responsibility of the user.
                </p>

                <h3>5. Limitation of Liability</h3>
                <p>
                    To the maximum extent permitted by law, Novai Intelligence shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or in connection with your use of the platform.
                </p>

                <h3>6. Termination</h3>
                <p>
                    We reserve the right to terminate or suspend your access to the platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h3>7. Changes to Terms</h3>
                <p>
                    We may modify these Terms at any time. We will provide notice of material changes. Your continued use of the platform following the posting of revised Terms means that you accept and agree to the changes.
                </p>

                <h3>8. Contact Information</h3>
                <p>
                    For legal inquiries or questions regarding these Terms, please contact our legal team at contact@usenovai.live.
                </p>
            </div>
        </div>
    );
}
