import { NextResponse } from 'next/server';
import { Resend } from 'resend';
export const runtime = 'edge';


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Log the request
        console.log('--- NEW FEEDBACK/SIGNUP RECEIVED ---');
        console.log(`From: ${name} <${email}>`);
        console.log(`Subject: ${subject}`);
        console.log('-----------------------------');

        let emailSent = false;

        // 1. Try Resend (Professional/Reliable)
        if (resend) {
            try {
                const data = await resend.emails.send({
                    from: 'Novai Intelligence <onboarding@resend.dev>', // Default Resend testing domain
                    to: ['saziz4250@gmail.com'],
                    subject: `[Novai] ${subject || 'New Subscriber'}`,
                    html: `
                        <h1>New Submission</h1>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
                            ${message}
                        </blockquote>
                    `
                });
                console.log('✅ Email sent via Resend:', data);
                emailSent = true;
            } catch (resendError) {
                console.error('⚠️ Resend failed, falling back to FormSubmit:', resendError);
            }
        } else {
            console.log('ℹ️ RESEND_API_KEY not found. Using FormSubmit.co fallback.');
        }

        // 2. Fallback to FormSubmit.co
        if (!emailSent) {
            try {
                const formSubmitResponse = await fetch('https://formsubmit.co/ajax/22bfde7008713e559bd8ac55808d9e8a', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `[Novai Signup] ${subject || 'New Subscriber'}`,
                        name: name || 'Anonymous',
                        email: email,
                        subject: subject || 'New Signup',
                        message: message || 'User signed up via landing page.',
                        _template: 'table',
                        _captcha: "false",
                        _replyto: email
                    })
                });

                if (!formSubmitResponse.ok) {
                    throw new Error(`FormSubmit.co failed: ${formSubmitResponse.status}`);
                }

                console.log('✅ Feedback email sent via FormSubmit.co');
            } catch (emailError) {
                console.error('⚠️ All email delivery methods failed:', emailError);
                // We still return success to not break UI, but log heavily
            }
        }

        return NextResponse.json({ success: true, message: 'Feedback received' });
    } catch (error) {
        console.error('Feedback API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process feedback' },
            { status: 500 }
        );
    }
}
