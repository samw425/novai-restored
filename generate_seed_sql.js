const fs = require('fs');
const path = require('path');

const aiCompanies = require('./src/lib/supabase/seeds/ai_companies.json');
const sp500 = require('./src/lib/supabase/seeds/sp500_tickers.json');

let sql = `-- Seed Data for Earnings Hub\n\n`;

// AI Companies
sql += `-- AI Companies\n`;
sql += `INSERT INTO companies (ticker, name, is_ai, featured_rank, sector) VALUES\n`;
sql += aiCompanies.map(c =>
    `('${c.ticker}', '${c.name.replace(/'/g, "''")}', ${c.is_ai}, ${c.featured_rank}, '${c.sector}')`
).join(',\n') + `\nON CONFLICT (ticker) DO UPDATE SET is_ai = EXCLUDED.is_ai, featured_rank = EXCLUDED.featured_rank;\n\n`;

// S&P 500
sql += `-- S&P 500 Companies\n`;
sql += `INSERT INTO companies (ticker, name, is_sp500, sector) VALUES\n`;
sql += sp500.map(c =>
    `('${c.ticker}', '${c.name.replace(/'/g, "''")}', ${c.is_sp500 || true}, '${c.sector}')`
).join(',\n') + `\nON CONFLICT (ticker) DO UPDATE SET is_sp500 = EXCLUDED.is_sp500;\n`;

fs.writeFileSync('./src/lib/supabase/seed.sql', sql);
console.log('Seed SQL generated at ./src/lib/supabase/seed.sql');
