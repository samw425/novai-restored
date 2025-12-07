import { Resend } from 'resend';

// ----------------------------------------------------------------------------
// RESEND CLIENT
// ----------------------------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Get the sender address. Uses a custom domain if RESEND_FROM_EMAIL is set,
 * otherwise defaults to the Resend testing domain.
 */
export function getSenderAddress(): string {
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
 * Adds a subscriber to the Resend audience.
 * Returns true on success, false otherwise.
 */
export async function addSubscriber(email: string): Promise<boolean> {
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
        });
        console.log(`[EmailUtils] Added ${email} to Resend Audience ${audienceId}`);
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
 * Sends an email via Resend.
 * @param to - recipient email address(es)
 * @param subject - email subject
 * @param reactElement - the React email component to render
 * @returns The email ID on success, or null on failure.
 */
export async function sendEmail(
    to: string | string[],
    subject: string,
    reactElement: React.ReactElement
): Promise<{ id: string | null; error: string | null }> {
    const toArray = Array.isArray(to) ? to : [to];
    try {
        const { data, error } = await resend.emails.send({
            from: getSenderAddress(),
            to: toArray,
            subject: subject,
            react: reactElement,
        });

        if (error) {
            console.error('[EmailUtils] Email send error:', error);
            return { id: null, error: error.message };
        }
        return { id: data?.id || null, error: null };
    } catch (e: any) {
        console.error('[EmailUtils] Email send exception:', e);
        return { id: null, error: e.message || 'Unknown error' };
    }
}
