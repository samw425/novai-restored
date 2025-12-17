import { NextResponse } from 'next/server';
export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Log the request
        console.log('--- NEW CONTACT/FEEDBACK RECEIVED ---');
        console.log(`From: ${name} <${email}>`);
        console.log(`Subject: ${subject}`);
        console.log('-----------------------------');

        let emailSent = false;

        // PRIMARY: Always try FormSubmit.co first (most reliable, no API key needed)
        try {
            const formSubmitResponse = await fetch('https://formsubmit.co/ajax/22bfde7008713e559bd8ac55808d9e8a', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `[Novai Contact] ${subject || 'New Message'}`,
                    name: name || 'Anonymous',
                    email: email,
                    subject: subject || 'Contact Form',
                    message: message || 'No message provided.',
                    source: 'Contact Form',
                    timestamp: new Date().toISOString(),
                    _template: 'table',
                    _captcha: 'false',
                    _replyto: email
                })
            });

            if (formSubmitResponse.ok) {
                emailSent = true;
                console.log('✅ Contact email sent via FormSubmit.co');
            } else {
                console.warn('FormSubmit.co returned non-OK:', formSubmitResponse.status);
            }
        } catch (formErr) {
            console.error('FormSubmit.co failed:', formErr);
        }

        // BACKUP: Try Resend if FormSubmit failed and API key is available
        if (!emailSent && process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'Novai Intelligence <onboarding@resend.dev>',
                    to: ['saziz4250@gmail.com'],
                    subject: `[Novai Contact] ${subject || 'New Message'}`,
                    html: `
                        <h1>New Contact Form Submission</h1>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
                            ${message}
                        </blockquote>
                        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                    `
                });
                emailSent = true;
                console.log('✅ Contact email sent via Resend');
            } catch (resendErr) {
                console.error('Resend failed:', resendErr);
            }
        }

        if (!emailSent) {
            console.error('⚠️ All email delivery methods failed for contact from:', email);
        }

        return NextResponse.json({ success: true, message: 'Feedback received' });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process feedback' },
            { status: 500 }
        );
    }
}

