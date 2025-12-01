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
                <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

                <h3>1. Acceptance of Terms</h3>
                <p>
                    By accessing or using the Novai Intelligence platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
                </p>

                <h3>2. Use License</h3>
                <p>
                    Novai grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal or internal business purposes, subject to these Terms.
                </p>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li>Modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on the Service.</li>
                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                    <li>Use the Service for any illegal or unauthorized purpose.</li>
                </ul>

                <h3>3. Intellectual Property</h3>
                <p>
                    The Service and its original content, features, and functionality are and will remain the exclusive property of Novai Intelligence and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                </p>

                <h3>4. User Accounts</h3>
                <p>
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>

                <h3>5. Disclaimer of Warranties</h3>
                <p>
                    The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Novai Intelligence makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h3>6. Limitation of Liability</h3>
                <p>
                    In no event shall Novai Intelligence, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>

                <h3>7. Governing Law</h3>
                <p>
                    These Terms shall be governed and construed in accordance with the laws of California, United States, without regard to its conflict of law provisions.
                </p>

                <h3>8. Changes</h3>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </p>

                <h3>9. Contact Us</h3>
                <p>
                    If you have any questions about these Terms, please contact us at legal@novai.com.
                </p>
            </div>
        </div>
    );
}
