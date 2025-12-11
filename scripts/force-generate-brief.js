const fetch = require('node-fetch'); // Needs to be installed or use native if Node 18+

async function triggerCron() {
    console.log('Triggering actual Cron Job...');
    try {
        const cronSecret = process.env.CRON_SECRET || 'dev_secret_key_123'; // Make sure this matches .env.local
        const response = await fetch('http://localhost:3000/api/cron/daily-brief', {
            headers: {
                'Authorization': `Bearer ${cronSecret}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Cron Job Success:', data);
        } else {
            console.error('Cron Job Failed:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error triggering cron:', error);
    }
}

triggerCron();
