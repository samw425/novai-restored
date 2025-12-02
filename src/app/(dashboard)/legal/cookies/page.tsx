import { PageHeader } from '@/components/ui/PageHeader';
import { Cookie } from 'lucide-react';

export default function CookiePolicy() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <PageHeader
                title="Cookie Policy"
                description="Information about how we use cookies and tracking technologies."
                icon={<Cookie className="w-8 h-8 text-blue-600" />}
            />
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h3:text-slate-900 prose-p:text-slate-600">
                <p className="text-sm text-slate-500">Last updated: December 1, 2025</p>

                <h3>1. What Are Cookies?</h3>
                <p>
                    Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                </p>

                <h3>2. How We Use Cookies</h3>
                <p>We use cookies for the following purposes:</p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Essential Cookies:</strong> These are necessary for the website to function (e.g., logging in, secure areas). They cannot be switched off.</li>
                    <li><strong>Performance & Analytics Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information these cookies collect is aggregated and anonymous.</li>
                    <li><strong>Functionality Cookies:</strong> These enable the website to provide enhanced functionality and personalization (e.g., remembering your region or preferences).</li>
                </ul>

                <h3>3. Third-Party Cookies</h3>
                <p>
                    In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Google Analytics:</strong> Used to understand how you use the site and ways that we can improve your experience.</li>
                    <li><strong>Vercel Analytics:</strong> Used to monitor real-time performance and site health.</li>
                </ul>

                <h3>4. Managing Cookies</h3>
                <p>
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-blue-600 hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
                </p>
                <p>
                    Please note that deleting or blocking cookies may affect the functionality of the Service.
                </p>

                <h3>5. Contact Us</h3>
                <p>
                    If you have questions about our use of cookies, please contact us at privacy@novai.com.
                </p>
            </div>
        </div>
    );
}
