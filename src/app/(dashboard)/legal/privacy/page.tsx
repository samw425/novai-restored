import { PageHeader } from '@/components/ui/PageHeader';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <PageHeader
                title="Privacy Policy"
                description="How Novai Intelligence protects, manages, and respects your data."
                icon={<Shield className="w-8 h-8 text-blue-600" />}
            />
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-slate-900 prose-p:text-slate-600">
                <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

                <h3>1. Introduction</h3>
                <p>
                    Novai Intelligence ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our intelligence platform.
                </p>

                <h3>2. Information We Collect</h3>
                <p>We collect information that you provide directly to us, as well as data collected automatically when you use our services.</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Account Information:</strong> Name, email address, and professional affiliation when you register.</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our platform, including search queries, feed preferences, and time spent on specific modules.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system.</li>
                </ul>

                <h3>3. How We Use Your Information</h3>
                <p>We use the collected data for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>To provide, maintain, and improve our intelligence services.</li>
                    <li>To personalize your experience and deliver relevant content.</li>
                    <li>To analyze usage patterns and optimize our algorithms.</li>
                    <li>To communicate with you regarding updates, security alerts, and support.</li>
                    <li>To enforce our terms, conditions, and policies.</li>
                </ul>

                <h3>4. Data Sharing and Disclosure</h3>
                <p>
                    We do not sell your personal data. We may share information only in the following circumstances:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform (e.g., cloud hosting, analytics).</li>
                    <li><strong>Legal Compliance:</strong> When required by law, subpoena, or other legal process.</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, sale, or asset transfer.</li>
                </ul>

                <h3>5. Data Security</h3>
                <p>
                    We employ military-grade encryption (AES-256) for data at rest and in transit. We implement strict access controls and regular security audits to protect against unauthorized access, alteration, or destruction of data.
                </p>

                <h3>6. Your Rights</h3>
                <p>
                    Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact our Data Protection Officer at saziz4250@gmail.com.
                </p>

                <h3>7. Changes to This Policy</h3>
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                </p>

                <h3>8. Contact Us</h3>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                    <br />
                    <strong>Novai Intelligence</strong>
                    <br />
                    Los Angeles, CA
                    <br />
                    Email: saziz4250@gmail.com
                </p>
            </div>
        </div>
    );
}
