/**
 * Sends a backup email notification directly from the client (browser) via FormSubmit.co.
 * This ensures that even if the Vercel backend / Resend fails, the admin still gets the lead.
 */
export async function sendFormSubmitBackup(data: {
    name?: string;
    email: string;
    subject: string;
    message?: string;
    source?: string;
}) {
    try {
        console.log('[BackupEmail] Attempting client-side backup send...');
        await fetch('https://formsubmit.co/ajax/22bfde7008713e559bd8ac55808d9e8a', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `[Backup] ${data.subject}`,
                name: data.name || 'Anonymous',
                email: data.email,
                message: `
                    Source: ${data.source || 'Unknown'}
                    Message: ${data.message || 'N/A'}
                    
                    (This is a backup email sent directly from the browser to ensure delivery)
                `,
                _template: 'table',
                _captcha: "false"
            })
        });
        console.log('[BackupEmail] Success.');
        return true;
    } catch (error) {
        console.error('[BackupEmail] Failed:', error);
        return false;
    }
}
