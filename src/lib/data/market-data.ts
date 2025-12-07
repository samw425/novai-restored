export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    sector: 'Hardware' | 'Software' | 'Robotics' | 'Energy';
    marketCap: string;
}

export const AI_MARKET_DATA: StockData[] = [
    // Hardware / Chips
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 145.60, change: 4.20, changePercent: 2.95, volume: '45M', sector: 'Hardware', marketCap: '3.6T' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 178.30, change: -2.10, changePercent: -1.15, volume: '12M', sector: 'Hardware', marketCap: '280B' },
    { symbol: 'TSM', name: 'Taiwan Semi', price: 192.45, change: 3.15, changePercent: 1.65, volume: '8M', sector: 'Hardware', marketCap: '950B' },
    { symbol: 'INTC', name: 'Intel Corp', price: 24.50, change: -0.40, changePercent: -1.60, volume: '35M', sector: 'Hardware', marketCap: '105B' },
    { symbol: 'ARM', name: 'Arm Holdings', price: 142.00, change: 5.50, changePercent: 4.05, volume: '5M', sector: 'Hardware', marketCap: '145B' },
    { symbol: 'AVGO', name: 'Broadcom', price: 165.20, change: 1.20, changePercent: 0.75, volume: '2M', sector: 'Hardware', marketCap: '780B' },

    // Software / Cloud / Models
    { symbol: 'MSFT', name: 'Microsoft', price: 425.00, change: 2.50, changePercent: 0.60, volume: '15M', sector: 'Software', marketCap: '3.1T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 175.40, change: -1.20, changePercent: -0.65, volume: '18M', sector: 'Software', marketCap: '2.2T' },
    { symbol: 'META', name: 'Meta Platforms', price: 585.20, change: 8.40, changePercent: 1.45, volume: '10M', sector: 'Software', marketCap: '1.5T' },
    { symbol: 'PLTR', name: 'Palantir', price: 62.50, change: 3.20, changePercent: 5.40, volume: '40M', sector: 'Software', marketCap: '140B' },
    { symbol: 'SNOW', name: 'Snowflake', price: 145.00, change: -4.50, changePercent: -3.05, volume: '4M', sector: 'Software', marketCap: '48B' },
    { symbol: 'ORCL', name: 'Oracle', price: 172.00, change: 1.10, changePercent: 0.65, volume: '6M', sector: 'Software', marketCap: '470B' },

    // Robotics / Physical AI
    { symbol: 'TSLA', name: 'Tesla Inc', price: 345.00, change: 12.50, changePercent: 3.75, volume: '80M', sector: 'Robotics', marketCap: '1.1T' },
    { symbol: 'BSY', name: 'Bentley Systems', price: 52.40, change: -0.20, changePercent: -0.40, volume: '1M', sector: 'Robotics', marketCap: '15B' },
    { symbol: 'PATH', name: 'UiPath', price: 12.50, change: -0.50, changePercent: -3.85, volume: '5M', sector: 'Robotics', marketCap: '7B' },

    // Energy / Infrastructure
    { symbol: 'VRT', name: 'Vertiv', price: 115.00, change: 4.20, changePercent: 3.80, volume: '3M', sector: 'Energy', marketCap: '42B' },
    { symbol: 'ETN', name: 'Eaton', price: 340.00, change: 2.10, changePercent: 0.60, volume: '1M', sector: 'Energy', marketCap: '135B' },
];
