
const { getMarketCalendarData } = require('./src/app/actions/earnings.ts');

async function test() {
    console.log("Testing getMarketCalendarData...");
    try {
        const res = await getMarketCalendarData("all", 0, 5);
        console.log("Count:", res.data.length);
        console.log("First Item:", res.data[0].ticker);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
