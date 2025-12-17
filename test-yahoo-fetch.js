
const fetch = require('node-fetch'); // Assuming node env, or use global fetch in newer node

async function testYahoo() {
    const symbol = 'AAPL';
    try {
        console.log(`Fetching data for ${symbol}...`);

        // 1. Quote Data (Price, Market Cap)
        const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const quoteRes = await fetch(quoteUrl);
        const quoteJson = await quoteRes.json();
        const quote = quoteJson.quoteResponse?.result?.[0];

        console.log('Quote Data:', {
            price: quote?.regularMarketPrice,
            mktCap: quote?.marketCap,
            name: quote?.longName
        });

        // 2. Quote Summary (Earnings Date)
        const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=calendarEvents`;
        const summaryRes = await fetch(summaryUrl);
        const summaryJson = await summaryRes.json();
        const calendar = summaryJson.quoteSummary?.result?.[0]?.calendarEvents;

        console.log('Calendar Events:', {
            earningsDate: calendar?.earnings?.earningsDate
        });

    } catch (e) {
        console.error('Error:', e);
    }
}

testYahoo();
