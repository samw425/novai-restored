import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Log the request
        console.log('--- NEW FEEDBACK RECEIVED ---');
        console.log(`From: ${name} <${email}>`);
        console.log(`Subject: ${subject}`);
        console.log('-----------------------------');

        // Use FormSubmit.co for reliable delivery
        try {
            await fetch('https://formsubmit.co/ajax/saziz4250@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `[Novai Feedback] ${subject}`,
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _template: 'table',
                    _captcha: "false",
                    _replyto: email
                })
            });
            console.log('✅ Feedback email sent via FormSubmit.co');
        } catch (emailError) {
            console.error('⚠️ Email delivery failed:', emailError);
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
