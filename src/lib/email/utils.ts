import { Resend } from 'resend';
import { render } from '@react-email/render';

// ----------------------------------------------------------------------------
// EMAIL CLIENTS
// ----------------------------------------------------------------------------
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Get the sender address for Resend (admin notifications).
 */
export function getResendSenderAddress(): string {
    // FORCE default sender for now to avoid domain issues
    return 'Novai Intelligence <onboarding@resend.dev>';
}

/**
 * Gets the Resend Audience ID, either from env or by listing/creating one.
 */
export async function getResendAudienceId(): Promise<string | null> {
    let audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!audienceId) {
        if (!resend) {
            console.warn('[EmailUtils] Resend client not initialized (missing API key)');
            return null;
        }

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
        if (!resend) return false;

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
        if (!resend) return [];
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

    if (!resend) {
        return { id: null, error: 'Resend not initialized' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: getResendSenderAddress(),
            to: toArray,
            replyTo: 'saziz4250@gmail.com',
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            return { id: null, error: error.message };
        }

        return { id: data?.id || null, error: null };
    } catch (e: any) {
        return { id: null, error: e.message };
    }
}

/**
 * Sends an email to SUBSCRIBERS via Resend.
 */
export async function sendSubscriberEmail(
    to: string,
    subject: string,
    reactElement: React.ReactElement
): Promise<{ id: string | null; error: string | null }> {
    if (!resend) {
        return { id: null, error: 'Resend not initialized' };
    }

    try {
        const htmlContent = await render(reactElement);

        const { data, error } = await resend.emails.send({
            from: getResendSenderAddress(),
            to: [to],
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            return { id: null, error: error.message };
        }

        return { id: data?.id || null, error: null };
    } catch (e: any) {
        return { id: null, error: e.message || 'Unknown error' };
    }
}

/**
 * Sends a BATCH of emails to subscribers via Resend Batch API.
 */
export async function sendSubscriberEmailBatch(
    recipients: { email: string; name?: string }[],
    subject: string,
    reactElement: React.ReactElement
): Promise<{ successCount: number; failCount: number; errors: string[] }> {
    if (!resend) {
        return { successCount: 0, failCount: recipients.length, errors: ['Resend not initialized'] };
    }

    try {
        const htmlContent = await render(reactElement);

        const BATCH_SIZE = 50;
        const chunks = [];
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            chunks.push(recipients.slice(i, i + BATCH_SIZE));
        }

        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        for (const [index, chunk] of chunks.entries()) {
            try {
                const batchPayload = chunk.map(r => ({
                    from: getResendSenderAddress(),
                    to: [r.email],
                    subject: subject,
                    html: htmlContent
                }));

                const { data, error } = await resend.batch.send(batchPayload);

                if (error) {
                    failCount += chunk.length;
                    errors.push(`Batch ${index}: ${error.message}`);
                } else {
                    successCount += (data?.data?.length || 0);
                }
            } catch (e: any) {
                failCount += chunk.length;
                errors.push(e.message);
            }
        }

        return { successCount, failCount, errors };
    } catch (e: any) {
        return { successCount: 0, failCount: recipients.length, errors: [e.message] };
    }
}
