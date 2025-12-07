
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from '@react-email/components';
import React from 'react';

interface DailyBriefEmailProps {
    date: string;
    analystNotes: { title: string; summary: string; link: string }[];
    warRoomAlert?: { title: string; summary: string; link: string };
    marketImpact?: { title: string; summary: string; link: string };
    extraLinks?: { label: string; url: string }[];
}

export default function DailyBriefEmail({
    date,
    analystNotes,
    warRoomAlert,
    marketImpact,
    extraLinks,
}: DailyBriefEmailProps) {

    return (
        <Html>
            <Head />
            <Preview>Novai Daily Intelligence Brief — {date}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Heading style={logo}>Novai Daily Intelligence</Heading>
                        <Text style={dateText}>{date}</Text>
                    </Section>

                    <Hr style={divider} />

                    {/* Section 1: Analyst Notes */}
                    <Section style={section}>
                        <Heading style={sectionHeader}>KEY SIGNALS (ANALYST NOTES)</Heading>
                        {analystNotes && analystNotes.map((note, idx) => (
                            <div key={idx} style={{ marginBottom: '24px' }}>
                                <Heading style={itemTitle}>{note.title}</Heading>
                                <Text style={itemSummary}>{note.summary}</Text>
                                <Link href={note.link} style={readMoreLink}>Read more →</Link>
                            </div>
                        ))}
                    </Section>

                    {/* Section 2: War Room Alert */}
                    {warRoomAlert && (
                        <>
                            <Hr style={divider} />
                            <Section style={section}>
                                <Heading style={sectionHeader}>WAR ROOM ALERT</Heading>
                                <Heading style={itemTitle}>{warRoomAlert.title}</Heading>
                                <Text style={itemSummary}>{warRoomAlert.summary}</Text>
                                <Link href={warRoomAlert.link} style={readMoreLink}>View related signals →</Link>
                            </Section>
                        </>
                    )}

                    {/* Section 3: Market Impact */}
                    {marketImpact && (
                        <>
                            <Hr style={divider} />
                            <Section style={section}>
                                <Heading style={sectionHeader}>MARKET IMPACT</Heading>
                                <Heading style={itemTitle}>{marketImpact.title}</Heading>
                                <Text style={itemSummary}>{marketImpact.summary}</Text>
                                <Link href={marketImpact.link} style={readMoreLink}>View market detail →</Link>
                            </Section>
                        </>
                    )}

                    {/* Section 4: Deeper Intelligence */}
                    <Hr style={divider} />
                    <Section style={section}>
                        <Heading style={sectionHeader}>DEEPER INTELLIGENCE</Heading>
                        <ul style={linkList}>
                            {extraLinks && extraLinks.map((link, idx) => (
                                <li key={idx} style={linkListItem}>
                                    <Link href={link.url} style={deepLink}>{link.label} →</Link>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            You’re receiving this because you signed up for Novai Daily Briefs.
                        </Text>
                        <Link href="mailto:contact@novai.ai?subject=UNSUBSCRIBE" style={footerLink}>
                            Reply 'UNSUBSCRIBE' or contact us to opt out.
                        </Link>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0',
    maxWidth: '600px',
    border: '1px solid #e0e0e0',
};

const header = {
    padding: '32px 24px',
    backgroundColor: '#0f172a',
};

const logo = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0',
};

const dateText = {
    color: '#94a3b8',
    fontSize: '13px',
    marginTop: '4px',
    fontWeight: '500',
};

const section = {
    padding: '24px 24px 8px',
};

const sectionHeader = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    marginBottom: '16px',
};

const itemTitle = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px',
    lineHeight: '1.4',
};

const itemSummary = {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
    margin: '0 0 8px',
};

const readMoreLink = {
    fontSize: '13px',
    color: '#2563eb',
    fontWeight: '500',
    textDecoration: 'none',
};

const divider = {
    borderColor: '#e2e8f0',
    margin: '0',
};

const linkList = {
    padding: '0',
    margin: '0',
    listStyleType: 'none',
};

const linkListItem = {
    marginBottom: '12px',
};

const deepLink = {
    fontSize: '14px',
    color: '#0f172a',
    fontWeight: '600',
    textDecoration: 'none',
};

const footer = {
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #e2e8f0',
    padding: '24px',
    textAlign: 'center' as const,
};

const footerText = {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '8px',
};

const footerLink = {
    fontSize: '11px',
    color: '#94a3b8',
    textDecoration: 'underline',
};
