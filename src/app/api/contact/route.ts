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
        // We use the AJAX endpoint to avoid redirects
        try {
            const formSubmitResponse = await fetch('https://formsubmit.co/ajax/saziz4250@gmail.com', {
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
                    _replyto: email // Important for replying directly
                })
            });

            if (!formSubmitResponse.ok) {
                const errorText = await formSubmitResponse.text();
                console.error('❌ FormSubmit.co error:', formSubmitResponse.status, errorText);
                throw new Error(`FormSubmit.co failed: ${formSubmitResponse.status}`);
            }

            console.log('✅ Feedback email sent via FormSubmit.co');
        } catch (emailError) {
            console.error('⚠️ Email delivery failed:', emailError);
            // We still return success to the client so the UI doesn't break, 
            // but we log the error on the server.
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
