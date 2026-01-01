
export function getWelcomeDailyBriefHtml() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Welcome to Novai — Your Daily Intelligence Brief</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { background-color: #ffffff; margin: 0 auto; padding: 40px 20px; max-width: 600px; border: 1px solid #e0e0e0; }
            h1 { color: #0f172a; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; margin: 0 0 24px; }
            p { color: #475569; font-size: 16px; line-height: 26px; margin-bottom: 16px; }
            ul { color: #475569; font-size: 16px; line-height: 26px; padding-left: 24px; margin-bottom: 24px; }
            li { margin-bottom: 8px; }
            .signature { color: #0f172a; font-weight: 600; margin-top: 32px; font-size: 16px; line-height: 26px; }
            .footer { border-top: 1px solid #e0e0e0; margin-top: 32px; padding-top: 32px; }
            .footer-text { font-size: 12px; color: #94a3b8; margin-bottom: 8px; }
            .footer-link { font-size: 12px; color: #94a3b8; text-decoration: underline; }
        </style>
    </head>
    <body>
        <div style="background-color: #f8f9fa; padding: 20px;">
            <div class="container">
                <h1>Novai Daily Intelligence</h1>
                <p>Welcome to Novai.</p>
                <p>You’re now subscribed to Novai’s Daily Intelligence Brief — a high-signal summary of the most important developments shaping AI, policy, markets, and global activity.</p>
                <p>Each morning at 8:00 AM EST, you’ll receive:</p>
                <ul>
                    <li><strong>3 Analyst Notes</strong> — what actually changed and why it matters.</li>
                    <li><strong>1 War Room Alert</strong> — key geopolitical or real-world moves worth watching.</li>
                    <li><strong>1 Market Impact Signal</strong> — how capital, chips, and robotics are reacting.</li>
                </ul>
                <p>No noise. No filler. Just the core signals, with links to deeper coverage when you want to go further.</p>
                <p>Your first brief will arrive in your inbox tomorrow at 8:00 AM EST.</p>
                <div class="signature">
                    — Novai<br />
                    The Citizen Intelligence Agency
                </div>
                <div class="footer">
                    <p class="footer-text">You’re receiving this because you subscribed to Novai Daily Briefs.</p>
                    <a href="mailto:contact@novai.ai?subject=Unsubscribe" class="footer-link">Unsubscribe</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

interface DailyBriefEmailProps {
    date: string;
    analystNotes: { title: string; summary: string; link: string }[];
    warRoomAlert?: { title: string; summary: string; link: string };
    marketImpact?: { title: string; summary: string; link: string };
    extraLinks?: { label: string; url: string }[];
}

export function getDailyBriefHtml({ date, analystNotes, warRoomAlert, marketImpact, extraLinks }: DailyBriefEmailProps) {
    const notesHtml = analystNotes.map(note => `
        <div style="margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; line-height: 1.4;">${note.title}</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 8px;">${note.summary}</p>
            <a href="${note.link}" style="font-size: 13px; color: #2563eb; font-weight: 500; text-decoration: none;">Read more →</a>
        </div>
    `).join('');

    const warRoomHtml = warRoomAlert ? `
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <div style="padding: 24px 24px 8px;">
            <h4 style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">WAR ROOM ALERT</h4>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; line-height: 1.4;">${warRoomAlert.title}</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 8px;">${warRoomAlert.summary}</p>
            <a href="${warRoomAlert.link}" style="font-size: 13px; color: #2563eb; font-weight: 500; text-decoration: none;">View related signals →</a>
        </div>
    ` : '';

    const marketHtml = marketImpact ? `
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <div style="padding: 24px 24px 8px;">
            <h4 style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">MARKET IMPACT</h4>
            <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 8px; line-height: 1.4;">${marketImpact.title}</h3>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 8px;">${marketImpact.summary}</p>
            <a href="${marketImpact.link}" style="font-size: 13px; color: #2563eb; font-weight: 500; text-decoration: none;">View market detail →</a>
        </div>
    ` : '';

    const extraLinksHtml = extraLinks && extraLinks.length > 0 ? `
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <div style="padding: 24px 24px 8px;">
            <h4 style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px;">DEEPER INTELLIGENCE</h4>
            <ul style="padding: 0; margin: 0; list-style-type: none;">
                ${extraLinks.map(link => `
                    <li style="margin-bottom: 12px;">
                        <a href="${link.url}" style="font-size: 14px; color: #0f172a; font-weight: 600; text-decoration: none;">${link.label} →</a>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Novai Daily Intelligence Brief — ${date}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
            .container { background-color: #ffffff; margin: 0 auto; padding: 0; max-width: 600px; border: 1px solid #e0e0e0; }
            .header { padding: 32px 24px; background-color: #0f172a; }
            .logo { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; }
            .date-text { color: #94a3b8; font-size: 13px; margin-top: 4px; font-weight: 500; }
            .section { padding: 24px 24px 8px; }
            .section-header { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
            .footer { background-color: #f8f9fa; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; }
            .footer-text { font-size: 12px; color: #94a3b8; margin-bottom: 8px; }
            .footer-link { font-size: 11px; color: #94a3b8; text-decoration: underline; }
        </style>
    </head>
    <body>
        <div style="background-color: #f8f9fa; padding: 20px;">
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <div class="logo">Novai Daily Intelligence</div>
                    <div class="date-text">${date}</div>
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 0;" />

                <!-- Analyst Notes -->
                <div class="section">
                    <h4 class="section-header">KEY SIGNALS (ANALYST NOTES)</h4>
                    ${notesHtml}
                </div>

                <!-- War Room -->
                ${warRoomHtml}

                <!-- Market Impact -->
                ${marketHtml}

                <!-- Deeper Links -->
                ${extraLinksHtml}

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">You’re receiving this because you signed up for Novai Daily Briefs.</p>
                    <a href="mailto:contact@novai.ai?subject=UNSUBSCRIBE" class="footer-link">Reply 'UNSUBSCRIBE' or contact us to opt out.</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}
