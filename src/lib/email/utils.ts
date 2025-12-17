import { Resend } from 'resend';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { render } from '@react-email/render';

// ----------------------------------------------------------------------------
// EMAIL CLIENTS
// ----------------------------------------------------------------------------
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const mailersend = process.env.MAILERSEND_API_KEY ? new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
}) : null;

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
    let resendError = null;

    // 1. Try Resend
    if (resend) {
        try {
            const { data, error } = await resend.emails.send({
                from: getResendSenderAddress(),
                to: toArray,
                replyTo: 'saziz4250@gmail.com',
                subject: subject,
                html: htmlContent,
            });

            if (!error && data) {
                console.log(`[EmailUtils] Resend success. ID: ${data.id}`);
                return { id: data.id, error: null };
            }
            resendError = error?.message || 'Unknown error';
            console.warn(`[EmailUtils] Resend failed (${resendError}), trying Mailersend fallback...`);
        } catch (e: any) {
            resendError = e.message;
            console.warn(`[EmailUtils] Resend exception (${resendError}), trying Mailersend fallback...`);
        }
    } else {
        console.warn('[EmailUtils] Resend not initialized, trying Mailersend directly...');
    }

    // 2. Fallback to Mailersend
    if (mailersend) {
        try {
            const sentFrom = new Sender('noreply@test-86org8ek12ngew13.mlsender.net', 'Novai Notifications');
            const recipients = toArray.map(email => new Recipient(email, email));

            const emailParams = new EmailParams()
                .setFrom(sentFrom)
                .setTo(recipients)
                .setSubject(subject + ' (via Mailersend Backup)')
                .setHtml(htmlContent);

            const response = await mailersend.email.send(emailParams);
            console.log('[EmailUtils] Admin email sent via Mailersend backup');
            return { id: response.body?.message_id || 'mailersend_backup', error: null };
        } catch (me: any) {
            console.error('[EmailUtils] Mailersend fallback failed:', me);
            return { id: null, error: `Resend: ${resendError}, Mailersend: ${me.message}` };
        }
    }

    return { id: null, error: resendError || 'No email providers initialized' };
}

/**
 * Sends an email to SUBSCRIBERS via Mailersend.
 */
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

        const sentFrom = new Sender('noreply@test-86org8ek12ngew13.mlsender.net', 'Novai Daily Intelligence');
        const recipients = [new Recipient(to, to)];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(subject)
            .setHtml(htmlContent);

        if (!mailersend) {
            console.warn('[EmailUtils] Mailersend client not initialized');
            return { id: null, error: 'Mailersend API key missing' };
        }

        const response = await mailersend.email.send(emailParams);

        console.log(`[EmailUtils] Subscriber email sent to ${to}`);
        return { id: response.body?.message_id || null, error: null };
    } catch (e: any) {
        console.error('[EmailUtils] Subscriber email error:', e);
        return { id: null, error: e.message || 'Unknown error' };
    }
}

/**
 * Sends a BATCH of emails to subscribers via Resend Batch API.
 * Automatically chunks requests to respect Cloudflare limits (50 subrequests).
 */
export async function sendSubscriberEmailBatch(
    recipients: { email: string; name?: string }[],
    subject: string,
    reactElement: React.ReactElement
): Promise<{ successCount: number; failCount: number; errors: string[] }> {
    try {
        // Render React email to HTML once
        const htmlContent = await render(reactElement);

        // Chunking Logic (Limit: 50 per batch to be safe with provider limits)
        const BATCH_SIZE = 50;
        const chunks = [];
        for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
            chunks.push(recipients.slice(i, i + BATCH_SIZE));
        }

        console.log(`[EmailUtils] Processing ${recipients.length} emails in ${chunks.length} batches...`);

        let successCount = 0;
        let failCount = 0;
        const errors: string[] = [];

        // Process chunks sequentially
        for (const [index, chunk] of chunks.entries()) {
            try {
                if (resend) {
                    const batchPayload = chunk.map(r => ({
                        from: getResendSenderAddress(),
                        to: [r.email],
                        subject: subject,
                        html: htmlContent
                    }));

                    const { data, error } = await resend.batch.send(batchPayload);

                    if (error) {
                        console.error(`[EmailUtils] Batch ${index} failed:`, error);
                        failCount += chunk.length;
                        errors.push(`Batch ${index}: ${error.message}`);
                    } else {
                        console.log(`[EmailUtils] Batch ${index} sent successfully (${data?.data?.length || 0})`);
                        successCount += (data?.data?.length || 0);
                    }
                } else {
                    console.warn('[EmailUtils] Resend missing. Using Loop fallback (Risk of Edge limit).');
                    // Fallback to loop if Resend is missing (Should catch in dev)
                    await Promise.all(chunk.map(r => sendSubscriberEmail(r.email, subject, reactElement)));
                    successCount += chunk.length;
                }
            } catch (e: any) {
                console.error(`[EmailUtils] Batch ${index} critical error:`, e);
                failCount += chunk.length;
                errors.push(e.message);
            }
        }

        return { successCount, failCount, errors };

    } catch (e: any) {
        console.error('[EmailUtils] Batch Setup Error:', e);
        return { successCount: 0, failCount: recipients.length, errors: [e.message] };
    }
}
