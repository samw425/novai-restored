-- Seed Data for Earnings Hub

-- AI Companies
INSERT INTO companies (ticker, name, is_ai, featured_rank, sector) VALUES
('NVDA', 'NVIDIA Corporation', true, 1, 'Technology'),
('MSFT', 'Microsoft Corporation', true, 2, 'Technology'),
('GOOGL', 'Alphabet Inc.', true, 3, 'Technology'),
('AMD', 'Advanced Micro Devices, Inc.', true, 4, 'Technology'),
('TSM', 'Taiwan Semiconductor Manufacturing', true, 5, 'Technology'),
('AVGO', 'Broadcom Inc.', true, 6, 'Technology'),
('META', 'Meta Platforms, Inc.', true, 7, 'Technology'),
('AMZN', 'Amazon.com, Inc.', true, 8, 'Consumer Cyclical'),
('ORCL', 'Oracle Corporation', true, 9, 'Technology'),
('PLTR', 'Palantir Technologies Inc.', true, 10, 'Technology'),
('CRM', 'Salesforce, Inc.', true, 11, 'Technology'),
('ADBE', 'Adobe Inc.', true, 12, 'Technology'),
('INTC', 'Intel Corporation', true, 13, 'Technology'),
('QCOM', 'Qualcomm Incorporated', true, 14, 'Technology'),
('IBM', 'International Business Machines', true, 15, 'Technology'),
('MU', 'Micron Technology, Inc.', true, 16, 'Technology'),
('ARM', 'Arm Holdings plc', true, 17, 'Technology'),
('SMCI', 'Super Micro Computer, Inc.', true, 18, 'Technology'),
('AAPL', 'Apple Inc.', true, 19, 'Technology'),
('TSLA', 'Tesla, Inc.', true, 20, 'automotive')
ON CONFLICT (ticker) DO UPDATE SET is_ai = EXCLUDED.is_ai, featured_rank = EXCLUDED.featured_rank;

-- S&P 500 Companies
INSERT INTO companies (ticker, name, is_sp500, sector) VALUES
('JPM', 'JPMorgan Chase & Co.', true, 'Financial Taxes'),
('V', 'Visa Inc.', true, 'Financial Services'),
('JNJ', 'Johnson & Johnson', true, 'Healthcare'),
('WMT', 'Walmart Inc.', true, 'Consumer Defensive'),
('PG', 'Procter & Gamble Company', true, 'Consumer Defensive'),
('MA', 'Mastercard Incorporated', true, 'Financial Services'),
('HD', 'The Home Depot, Inc.', true, 'Consumer Cyclical'),
('CVX', 'Chevron Corporation', true, 'Energy'),
('MRK', 'Merck & Co., Inc.', true, 'Healthcare'),
('KO', 'The Coca-Cola Company', true, 'Consumer Defensive'),
('PEP', 'PepsiCo, Inc.', true, 'Consumer Defensive'),
('BAC', 'Bank of America Corporation', true, 'Financial Services'),
('COST', 'Costco Wholesale Corporation', true, 'Consumer Defensive'),
('MCD', 'McDonald''s Corporation', true, 'Consumer Cyclical'),
('CSCO', 'Cisco Systems, Inc.', true, 'Technology'),
('ACN', 'Accenture plc', true, 'Technology'),
('LIN', 'Linde plc', true, 'Basic Materials'),
('ABT', 'Abbott Laboratories', true, 'Healthcare'),
('TMUS', 'T-Mobile US, Inc.', true, 'Communication Services'),
('DIS', 'The Walt Disney Company', true, 'Communication Services')
ON CONFLICT (ticker) DO UPDATE SET is_sp500 = EXCLUDED.is_sp500;
