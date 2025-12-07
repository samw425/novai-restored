
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
} from '@react-email/components';
import React from 'react';

export default function WelcomeDailyBriefEmail() {
    return (
        <Html>
            <Head />
            <Preview>Welcome to Novai — Your Daily Intelligence Brief</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Novai Daily Intelligence</Heading>

                    <Text style={text}>Welcome to Novai.</Text>

                    <Text style={text}>
                        You’re now subscribed to Novai’s Daily Intelligence Brief — a high-signal summary of the most important developments shaping AI, policy, markets, and global activity.
                    </Text>

                    <Text style={text}>
                        Each morning at 8:00 AM EST, you’ll receive:
                    </Text>

                    <ul style={list}>
                        <li style={listItem}><strong>3 Analyst Notes</strong> — what actually changed and why it matters.</li>
                        <li style={listItem}><strong>1 War Room Alert</strong> — key geopolitical or real-world moves worth watching.</li>
                        <li style={listItem}><strong>1 Market Impact Signal</strong> — how capital, chips, and robotics are reacting.</li>
                    </ul>

                    <Text style={text}>
                        No noise. No filler. Just the core signals, with links to deeper coverage when you want to go further.
                    </Text>

                    <Text style={text}>
                        Your first brief will arrive in your inbox tomorrow at 8:00 AM EST.
                    </Text>

                    <Text style={signature}>
                        — Novai<br />
                        The Citizen Intelligence Agency
                    </Text>

                    <Section style={footer}>
                        <Text style={footerText}>
                            You’re receiving this because you subscribed to Novai Daily Briefs.
                        </Text>
                        <Link href="mailto:contact@novai.ai?subject=Unsubscribe" style={footerLink}>
                            Unsubscribe
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
    padding: '40px 20px',
    maxWidth: '600px',
    border: '1px solid #e0e0e0',
};

const h1 = {
    color: '#0f172a',
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    margin: '0 0 24px',
};

const text = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '26px',
    marginBottom: '16px',
};

const list = {
    color: '#475569',
    fontSize: '16px',
    lineHeight: '26px',
    paddingLeft: '24px',
    marginBottom: '24px',
};

const listItem = {
    marginBottom: '8px',
};

const signature = {
    ...text,
    color: '#0f172a',
    fontWeight: '600',
    marginTop: '32px',
};

const footer = {
    borderTop: '1px solid #e0e0e0',
    marginTop: '32px',
    paddingTop: '32px',
};

const footerText = {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '8px',
};

const footerLink = {
    fontSize: '12px',
    color: '#94a3b8',
    textDecoration: 'underline',
};
