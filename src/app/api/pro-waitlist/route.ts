import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, feature } = body;

        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email and name are required' },
                { status: 400 }
            );
        }

        // Log the request
        console.log('--- NEW PRO WAITLIST SIGNUP ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Feature: ${feature || 'General'}`);
        console.log('-------------------------------');

        const adminEmail = 'saziz4250@gmail.com';
        const subject = `[Novai Pro] New Waitlist Signup: ${name}`;

        let emailSent = false;

        // 1. Try Resend
        if (resend) {
            try {
                const data = await resend.emails.send({
                    from: 'Novai Intelligence <onboarding@resend.dev>',
                    to: [adminEmail],
                    subject: subject,
                    html: `
                        <h1>🎯 New Pro Waitlist Signup</h1>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Feature of Interest:</strong> ${feature || 'General'}</p>
                        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                        <hr />
                        <p style="font-size: 12px; color: #666;">Sent from Novai Intelligence Platform</p>
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

        // 2. Fallback to FormSubmit.co if Resend failed or key is missing
        if (!emailSent) {
            try {
                const formSubmitResponse = await fetch('https://formsubmit.co/ajax/22bfde7008713e559bd8ac55808d9e8a', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: subject,
                        name: name,
                        email: email,
                        feature: feature || 'General',
                        message: `New Pro Waitlist Signup\nName: ${name}\nEmail: ${email}\nFeature: ${feature || 'General'}`,
                        _template: 'table',
                        _captcha: "false",
                        _replyto: email
                    })
                });

                if (formSubmitResponse.ok) {
                    console.log('✅ Pro waitlist notification sent via FormSubmit.co fallback');
                } else {
                    console.error('⚠️ FormSubmit.co failed:', await formSubmitResponse.text());
                }
            } catch (fallbackError) {
                console.error('⚠️ All email delivery methods failed:', fallbackError);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully joined waitlist',
        });

    } catch (error) {
        console.error('Error processing waitlist signup:', error);
        return NextResponse.json(
            { error: 'Failed to process signup' },
            { status: 500 }
        );
    }
}

