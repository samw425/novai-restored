import { PageHeader } from '@/components/ui/PageHeader';
import { Database } from 'lucide-react';

export default function DataGovernance() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <PageHeader
                title="Data Governance"
                description="Our standards for data integrity, verification, and ethical handling."
                icon={<Database className="w-8 h-8 text-blue-600" />}
            />
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-slate-900 prose-p:text-slate-600">
                <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

                <h3>1. Data Integrity & Verification</h3>
                <p>
                    Novai Intelligence is committed to the highest standards of data accuracy. Our "Truth-First" architecture ensures that every signal ingested into our platform undergoes a rigorous verification process.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Source Validation:</strong> We only ingest data from a curated list of 109+ verified sources, including government agencies, accredited research labs, and primary industry reports.</li>
                    <li><strong>Cross-Referencing:</strong> Critical intelligence is cross-referenced against multiple independent sources before being flagged as high-confidence.</li>
                    <li><strong>Provenance Tracking:</strong> Every data point retains a clear lineage to its original source, allowing for complete auditability.</li>
                </ul>

                <h3>2. Data Retention & Archiving</h3>
                <p>
                    We maintain a structured data lifecycle policy to ensure performance and compliance:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Real-Time Feeds:</strong> Raw feed data is retained in our hot storage for 30 days to support immediate analysis and trend detection.</li>
                    <li><strong>Synthesized Intelligence:</strong> Generated reports, summaries, and vector embeddings are archived permanently in cold storage for historical analysis and long-term trend mapping.</li>
                    <li><strong>User Data:</strong> User search history and preferences are retained as long as the account is active, or until a deletion request is received.</li>
                </ul>

                <h3>3. Ethical AI & Bias Mitigation</h3>
                <p>
                    Our synthesis engine is designed with safeguards to minimize bias and ensure objective reporting:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Algorithmic Transparency:</strong> We regularly audit our vector ranking algorithms to identify and correct for potential systemic biases.</li>
                    <li><strong>Neutral Tone:</strong> Our summarization models are fine-tuned to prioritize factual, neutral language over sensationalism.</li>
                </ul>

                <h3>4. Security & Compliance</h3>
                <p>
                    We adhere to strict security protocols to protect the integrity of our intelligence data:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Encryption:</strong> All data is encrypted at rest and in transit using industry-standard protocols (AES-256, TLS 1.3).</li>
                    <li><strong>Access Control:</strong> Internal access to raw data is strictly limited to authorized personnel on a need-to-know basis.</li>
                </ul>

                <h3>5. Contact</h3>
                <p>
                    For inquiries regarding our data governance practices, please contact our Data Officer at governance@novai.com.
                </p>
            </div>
        </div>
    );
}
