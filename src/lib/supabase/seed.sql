-- Seed Data for Earnings Hub v2
-- Run this AFTER running earnings_hub_schema.sql

-- Enable pg_trgm extension for fuzzy search (run once in Supabase SQL editor)
-- create extension if not exists pg_trgm;

-- AI/Featured Companies (Priority Tier 1)
INSERT INTO companies (ticker, name, is_ai, is_featured, featured_rank, sector) VALUES
('NVDA', 'NVIDIA Corporation', true, true, 1, 'Technology'),
('MSFT', 'Microsoft Corporation', true, true, 2, 'Technology'),
('GOOGL', 'Alphabet Inc.', true, true, 3, 'Technology'),
('AMD', 'Advanced Micro Devices', true, true, 4, 'Technology'),
('TSM', 'Taiwan Semiconductor', true, true, 5, 'Technology'),
('AVGO', 'Broadcom Inc.', true, true, 6, 'Technology'),
('META', 'Meta Platforms', true, true, 7, 'Technology'),
('AMZN', 'Amazon.com Inc.', true, true, 8, 'Consumer Cyclical'),
('ORCL', 'Oracle Corporation', true, true, 9, 'Technology'),
('PLTR', 'Palantir Technologies', true, true, 10, 'Technology'),
('CRM', 'Salesforce Inc.', true, true, 11, 'Technology'),
('ADBE', 'Adobe Inc.', true, true, 12, 'Technology'),
('INTC', 'Intel Corporation', true, true, 13, 'Technology'),
('QCOM', 'Qualcomm Inc.', true, true, 14, 'Technology'),
('IBM', 'IBM Corporation', true, true, 15, 'Technology'),
('MU', 'Micron Technology', true, true, 16, 'Technology'),
('ARM', 'Arm Holdings', true, true, 17, 'Technology'),
('SMCI', 'Super Micro Computer', true, true, 18, 'Technology'),
('AAPL', 'Apple Inc.', true, true, 19, 'Technology'),
('TSLA', 'Tesla Inc.', true, true, 20, 'Automotive')
ON CONFLICT (ticker) DO UPDATE SET 
  is_ai = EXCLUDED.is_ai, 
  is_featured = EXCLUDED.is_featured,
  featured_rank = EXCLUDED.featured_rank,
  name = EXCLUDED.name;

-- S&P 500 Companies (Priority Tier 2)
INSERT INTO companies (ticker, name, is_sp500, sector) VALUES
('JPM', 'JPMorgan Chase', true, 'Financial Services'),
('V', 'Visa Inc.', true, 'Financial Services'),
('JNJ', 'Johnson & Johnson', true, 'Healthcare'),
('WMT', 'Walmart Inc.', true, 'Consumer Defensive'),
('PG', 'Procter & Gamble', true, 'Consumer Defensive'),
('MA', 'Mastercard Inc.', true, 'Financial Services'),
('HD', 'Home Depot', true, 'Consumer Cyclical'),
('CVX', 'Chevron Corporation', true, 'Energy'),
('MRK', 'Merck & Co.', true, 'Healthcare'),
('KO', 'Coca-Cola Company', true, 'Consumer Defensive'),
('PEP', 'PepsiCo Inc.', true, 'Consumer Defensive'),
('BAC', 'Bank of America', true, 'Financial Services'),
('COST', 'Costco Wholesale', true, 'Consumer Defensive'),
('MCD', 'McDonald''s Corporation', true, 'Consumer Cyclical'),
('CSCO', 'Cisco Systems', true, 'Technology'),
('ACN', 'Accenture plc', true, 'Technology'),
('LIN', 'Linde plc', true, 'Basic Materials'),
('ABT', 'Abbott Laboratories', true, 'Healthcare'),
('TMUS', 'T-Mobile US', true, 'Communication Services'),
('DIS', 'Walt Disney Company', true, 'Communication Services'),
('NFLX', 'Netflix Inc.', true, 'Communication Services'),
('UNH', 'UnitedHealth Group', true, 'Healthcare'),
('XOM', 'Exxon Mobil', true, 'Energy'),
('GS', 'Goldman Sachs', true, 'Financial Services'),
('MS', 'Morgan Stanley', true, 'Financial Services')
ON CONFLICT (ticker) DO UPDATE SET 
  is_sp500 = EXCLUDED.is_sp500,
  name = EXCLUDED.name;

-- Seed next_earnings for featured companies (initial data - will be updated by ingestion)
-- Using placeholder dates - actual dates come from ingestion
INSERT INTO next_earnings (company_id, next_earnings_at, earnings_time, confidence, updated_at)
SELECT 
  c.id,
  NULL, -- TBA until we fetch real data
  'TBA',
  'UNKNOWN',
  NOW()
FROM companies c
WHERE c.is_featured = true
ON CONFLICT (company_id) DO NOTHING;
