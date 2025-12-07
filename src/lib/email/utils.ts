import { Resend } from 'resend';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { render } from '@react-email/render';

// ----------------------------------------------------------------------------
// EMAIL CLIENTS
// ----------------------------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);
const mailersend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || '',
});

/**
 * Get the sender address for Resend (admin notifications).
 */
export function getResendSenderAddress(): string {
    return process.env.RESEND_FROM_EMAIL || 'Novai Daily Intelligence <briefing@resend.dev>';
}

/**
 * Gets the Resend Audience ID, either from env or by listing/creating one.
 */
export async function getResendAudienceId(): Promise<string | null> {
    let audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
        try {
            const audiences = await resend.audiences.list();
            if (audiences.data && audiences.data.data && audiences.data.data.length > 0) {
                audienceId = audiences.data.data[0].id;
            } else {
                // Create one if none exist
                const newAudience = await resend.audiences.create({ name: 'Novai Subscribers' });
                audienceId = newAudience.data?.id;
            }
        } catch (e) {
            console.warn('[EmailUtils] Failed to manage audiences:', e);
            return null;
        }
    }
    return audienceId || null;
}

/**
 * Adds a subscriber to the Resend audience (for tracking).
 */
export async function addSubscriber(
    email: string,
    firstName?: string,
    lastName?: string
): Promise<boolean> {
    const audienceId = await getResendAudienceId();
    if (!audienceId) {
        console.warn('[EmailUtils] No Audience ID available, cannot add subscriber.');
        return false;
    }

    try {
        await resend.contacts.create({
            email: email,
            audienceId: audienceId,
            unsubscribed: false,
            firstName: firstName,
            lastName: lastName,
        });
        console.log(`[EmailUtils] Added ${email} (${firstName || 'no name'}) to Resend Audience ${audienceId}`);
        return true;
    } catch (e: any) {
        // Check for duplicate contact error (not actually a failure)
        if (e?.message?.includes('already exists')) {
            console.log(`[EmailUtils] ${email} already exists in audience.`);
            return true;
        }
        console.warn('[EmailUtils] Failed to add contact:', e);
        return false;
    }
}

/**
 * Fetches the list of subscribed emails from the Resend audience.
 */
export async function getSubscribers(): Promise<string[]> {
    const audienceId = await getResendAudienceId();
    if (!audienceId) {
        console.warn('[EmailUtils] No Audience ID available, cannot fetch subscribers.');
        return [];
    }

    try {
        const contacts = await resend.contacts.list({ audienceId });
        if (contacts.data && contacts.data.data) {
            return contacts.data.data
                .filter((c: any) => !c.unsubscribed)
                .map((c: any) => c.email);
        }
        return [];
    } catch (e) {
        console.error('[EmailUtils] Subscriber fetch failed:', e);
        return [];
    }
}

/**
 * Sends an email to ADMIN via Resend (for notifications).
 */
export async function sendAdminEmail(
    to: string | string[],
    subject: string,
    htmlContent: string
): Promise<{ id: string | null; error: string | null }> {
    const toArray = Array.isArray(to) ? to : [to];
    try {
        const { data, error } = await resend.emails.send({
            from: getResendSenderAddress(),
            to: toArray,
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error('[EmailUtils] Admin email error:', error);
            return { id: null, error: error.message };
        }
        return { id: data?.id || null, error: null };
    } catch (e: any) {
        console.error('[EmailUtils] Admin email exception:', e);
        return { id: null, error: e.message || 'Unknown error' };
    }
}

/**
 * Sends an email to SUBSCRIBERS via Mailersend.
 */
export async function sendSubscriberEmail(
    to: string,
    subject: string,
    reactElement: React.ReactElement
): Promise<{ id: string | null; error: string | null }> {
    try {
        // Render React email to HTML
        const htmlContent = await render(reactElement);

        const sentFrom = new Sender('noreply@trial-pxkjn41nymjgz781.mlsender.net', 'Novai Daily Intelligence');
        const recipients = [new Recipient(to, to)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(htmlContent);

        const response = await mailersend.email.send(emailParams);

        console.log(`[EmailUtils] Subscriber email sent to ${to}`);
        return { id: response.body?.message_id || null, error: null };
    } catch (e: any) {
        console.error('[EmailUtils] Subscriber email error:', e);
        return { id: null, error: e.message || 'Unknown error' };
    }
}
