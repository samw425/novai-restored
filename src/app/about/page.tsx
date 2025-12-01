import { Shield, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <Shield className="w-16 h-16 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Novai</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Novai is an intelligence engine designed to help you separate signal from noise in the rapidly evolving AI landscape.
                </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We believe that access to high-quality, real-time intelligence is the key to navigating the AI era. Our platform aggregates data from thousands of sources, uses advanced models to classify and rank information, and presents it in high-density dashboards designed for professionals.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">Core Capabilities</h3>
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Real-time global news aggregation</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Predictive signal analysis</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Market sentiment tracking</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Risk and incident monitoring</span>
                    </li>
                </ul>
            </div>

            {/* Coverage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-blue-600 mb-2">70+</div>
                    <div className="text-sm text-gray-600">Global Sources</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-blue-600 mb-2">6</div>
                    <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-sm">
                    <div className="text-4xl font-bold text-blue-600 mb-2">5 min</div>
                    <div className="text-sm text-gray-600">Update Frequency</div>
                </div>
            </div>
        </div>
    );
}
