
// Remove require, use global fetch (Node 20+)
async function testYahoo() {
    const symbol = 'AAPL';
    try {
        console.log(`Fetching data for ${symbol}...`);

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };

        // 1. Quote Data (Price, Market Cap)
        const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
        const quoteRes = await fetch(quoteUrl, { headers });
        const quoteText = await quoteRes.text();
        console.log('Quote JSON:', quoteText.substring(0, 200)); // Log start

        try {
            const quoteJson = JSON.parse(quoteText);
            const quote = quoteJson.quoteResponse?.result?.[0];
            console.log('Quote Data:', {
                price: quote?.regularMarketPrice,
                mktCap: quote?.marketCap,
                name: quote?.longName
            });
        } catch (e) { console.log('Quote parse error'); }

        // 2. Quote Summary (Earnings Date)
        const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=calendarEvents`;
        const summaryRes = await fetch(summaryUrl, { headers });
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
