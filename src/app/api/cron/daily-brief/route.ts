import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Optional Supabase
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    : null;

export async function GET(request: Request) {
    try {
        // Verify cron secret to prevent unauthorized access
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch top 10 articles from past 24 hours
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/feed/live?category=All&limit=10`);
        const data = await response.json();
        const articles = data.articles || [];

        // Get all active subscribers
        let subscribers: any[] = [];
        if (supabase) {
            const { data: subs, error } = await supabase
                .from('subscribers')
                .select('email, name')
                .eq('active', true);

            if (subs) subscribers = subs;
        }

        // Fallback: send to admin if no subscribers
        if (subscribers.length === 0) {
            subscribers = [{ email: 'saziz4250@gmail.com', name: 'Admin' }];
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        if (!RESEND_API_KEY) {
            return NextResponse.json({ error: 'Resend API key not configured' }, { status: 500 });
        }

        // Generate HTML email
        const emailHTML = generateDailyBriefHTML(articles);

        // Send to all subscribers
        let sentCount = 0;
        for (const subscriber of subscribers) {
            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Novai Intelligence <daily@novai.ai>',
                        to: subscriber.email,
                        subject: `🤖 Daily AI Brief - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                        html: emailHTML.replace('{{name}}', subscriber.name || 'there')
                    })
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send to ${subscriber.email}:`, err);
            }
        }

        console.log(`✅ Daily brief sent to ${sentCount} subscribers`);

        return NextResponse.json({
            success: true,
            sent: sentCount,
            articles: articles.length
        });

    } catch (error) {
        console.error('Daily brief cron error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function generateDailyBriefHTML(articles: any[]): string {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Categorize articles
    const categorized = {
        ai: articles.filter(a => a.category === 'AI').slice(0, 4),
        robotics: articles.filter(a => a.category === 'Robotics').slice(0, 3),
        policy: articles.filter(a => a.category === 'Policy').slice(0, 3)
    };

    const renderArticles = (arts: any[], emoji: string) => arts.map(article => `
        <div style="margin-bottom: 20px; padding-left: 20px; border-left: 3px solid #e5e7eb;">
            <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
                ${emoji} <a href="${article.url}" style="color: #2563eb; text-decoration: none;">
                    ${article.title}
                </a>
            </h3>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                ${article.source}
            </div>
            <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">
                ${article.summary || ''}
            </p>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, system-ui, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); padding: 32px 24px;">
            <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">
                NOVAI INTELLIGENCE
            </h1>
            <p style="margin: 4px 0 0 0; color: #e0e7ff; font-size: 13px; font-weight: 500;">
                Daily Intelligence Brief • ${date}
            </p>
        </div>

        <!-- Executive Summary -->
        <div style="padding: 24px; background-color: #f8f9fa; border-bottom: 2px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.6; font-weight: 500;">
                <strong>Today's Intelligence:</strong> ${articles.length} developments across AI research, robotics deployment, and policy frameworks. Key movements in foundation models, autonomous systems, and regulatory enforcement.
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
            
            ${categorized.ai.length > 0 ? `
            <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                    🤖 Artificial Intelligence
                </h2>
                ${renderArticles(categorized.ai, '•')}
            </div>
            ` : ''}

            ${categorized.robotics.length > 0 ? `
            <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                    🦾 Robotics & Automation
                </h2>
                ${renderArticles(categorized.robotics, '•')}
            </div>
            ` : ''}

            ${categorized.policy.length > 0 ? `
            <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                    📜 Policy & Regulation
                </h2>
                ${renderArticles(categorized.policy, '•')}
            </div>
            ` : ''}

            <!-- CTA -->
            <div style="margin-top: 40px; padding: 24px; background: linear-gradient(135deg, #f8f9fa 0%, #e5e7eb 100%); border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #475569; font-weight: 500;">
                    Access the full intelligence platform
                </p>
                <a href="${process.env.NEXT_PUBLIC_URL || 'https://novai.ai'}/global-feed" 
                   style="display: inline-block; padding: 12px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                    View Live Feed →
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="padding: 24px; background-color: #0f172a; text-align: center;">
            <p style="margin: 0 0 4px 0; font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.5px;">
                NOVAI INTELLIGENCE
            </p>
            <p style="margin: 0 0 12px 0; font-size: 11px; color: #64748b;">
                Real-time intelligence • 75+ sources • Delivered daily
            </p>
            <p style="margin: 0; font-size: 11px;">
                <a href="{{unsubscribe}}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

