
// Mock Data for "Austin, TX" Pilot Market
export interface Property {
    id: string;
    address: string;
    lat: number;
    lng: number;
    type: "SFR" | "MF_2" | "MF_3" | "MF_4"; // Single Family, Duplex, Triplex, Quad
    status: "OFF_MARKET" | "PRE_FORECLOSURE" | "TAX_DELINQUENT" | "FSBO";
    motivationScore: number; // 0-100
    estimatedValue: number;
    equity: number;
    ownerType: "INDIVIDUAL" | "CORP" | "ABSENTEE";
    distressSignal?: {
        type: string;
        date: string;
        amount?: number;
        description: string;
    };
    lastSaleDate: string;
}

export type ZenithProperty = Property;

// Mock Data for "Austin, TX" Pilot Market - Expanded Dataset
export const MOCK_PROPERTIES: Property[] = [
    // CRITICAL DISTRESS (Pre-Foreclosure / Tax Delinquent)
    {
        id: "1",
        address: "1204 E 6th St, Austin, TX",
        lat: 30.2645,
        lng: -97.7275,
        type: "MF_4",
        status: "PRE_FORECLOSURE",
        motivationScore: 94,
        estimatedValue: 850000,
        equity: 400000,
        ownerType: "ABSENTEE",
        distressSignal: { type: "LIS_PENDENS", date: "2024-02-15", description: "Foreclosure proceedings initiated by lender." },
        lastSaleDate: "2018-05-20"
    },
    {
        id: "2",
        address: "1102 Robert Browning St",
        lat: 30.2660,
        lng: -97.7300,
        type: "SFR",
        status: "TAX_DELINQUENT",
        motivationScore: 88,
        estimatedValue: 450000,
        equity: 150000,
        ownerType: "INDIVIDUAL",
        distressSignal: { type: "TAX_LIEN", date: "2023-11-10", amount: 12400, description: "Unpaid property taxes for 2+ years." },
        lastSaleDate: "2015-09-12"
    },
    {
        id: "5",
        address: "2401 Longview St",
        lat: 30.2855,
        lng: -97.7490,
        type: "MF_2",
        status: "PRE_FORECLOSURE",
        motivationScore: 91,
        estimatedValue: 725000,
        equity: 210000,
        ownerType: "INDIVIDUAL",
        distressSignal: { type: "NOTICE_OF_DEFAULT", date: "2024-01-05", description: "90 days past due on primary mortgage." },
        lastSaleDate: "2020-03-15"
    },
    {
        id: "6",
        address: "808 W 10th St",
        lat: 30.2725,
        lng: -97.7510,
        type: "SFR",
        status: "TAX_DELINQUENT",
        motivationScore: 85,
        estimatedValue: 1100000,
        equity: 850000,
        ownerType: "ABSENTEE",
        distressSignal: { type: "TAX_SUIT", date: "2023-12-01", amount: 28500, description: "County tax suit filed." },
        lastSaleDate: "1995-06-30"
    },
    {
        id: "7",
        address: "1600 Rosewood Ave",
        lat: 30.2715,
        lng: -97.7215,
        type: "MF_3",
        status: "PRE_FORECLOSURE",
        motivationScore: 89,
        estimatedValue: 650000,
        equity: 120000,
        ownerType: "CORP",
        distressSignal: { type: "LIS_PENDENS", date: "2024-02-20", description: "Commercial lender filing." },
        lastSaleDate: "2021-11-10"
    },

    // HIGH EQUITY / ABSENTEE (Motivation: Cash Out / Tired Landlord)
    {
        id: "3",
        address: "2205 Webville Rd",
        lat: 30.2700,
        lng: -97.7250,
        type: "MF_2",
        status: "FSBO",
        motivationScore: 72,
        estimatedValue: 600000,
        equity: 550000,
        ownerType: "INDIVIDUAL",
        lastSaleDate: "2005-03-01"
    },
    {
        id: "8",
        address: "302 W 35th St",
        lat: 30.3010,
        lng: -97.7390,
        type: "SFR",
        status: "OFF_MARKET",
        motivationScore: 65,
        estimatedValue: 950000,
        equity: 950000,
        ownerType: "ABSENTEE",
        distressSignal: { type: "PROBATE_LIKELY", date: "2023-08-01", description: "Owner deceased per obituary match." },
        lastSaleDate: "1988-04-12"
    },
    {
        id: "9",
        address: "1405 E 12th St",
        lat: 30.2735,
        lng: -97.7265,
        type: "MF_4",
        status: "OFF_MARKET",
        motivationScore: 68,
        estimatedValue: 780000,
        equity: 400000,
        ownerType: "ABSENTEE",
        lastSaleDate: "2010-09-15"
    },
    {
        id: "10",
        address: "2104 Nueces St",
        lat: 30.2840,
        lng: -97.7440,
        type: "MF_3",
        status: "OFF_MARKET",
        motivationScore: 60,
        estimatedValue: 1250000,
        equity: 1100000,
        ownerType: "INDIVIDUAL",
        lastSaleDate: "1999-12-05"
    },

    // STANDARD OFF-MARKET (Context)
    {
        id: "4",
        address: "Hidden Gem Ave",
        lat: 30.2620,
        lng: -97.7200,
        type: "SFR",
        status: "OFF_MARKET",
        motivationScore: 40,
        estimatedValue: 1200000,
        equity: 1200000,
        ownerType: "CORP",
        lastSaleDate: "1998-07-22"
    },
    {
        id: "11",
        address: "505 W 7th St",
        lat: 30.2695,
        lng: -97.7455,
        type: "MF_2",
        status: "OFF_MARKET",
        motivationScore: 45,
        estimatedValue: 1400000,
        equity: 600000,
        ownerType: "CORP",
        lastSaleDate: "2019-01-20"
    },
    {
        id: "12",
        address: "1802 Enfield Rd",
        lat: 30.2810,
        lng: -97.7550,
        type: "SFR",
        status: "OFF_MARKET",
        motivationScore: 35,
        estimatedValue: 2100000,
        equity: 500000,
        ownerType: "INDIVIDUAL",
        lastSaleDate: "2022-06-10"
    },
    {
        id: "13",
        address: "900 Congress Ave",
        lat: 30.2710,
        lng: -97.7410,
        type: "MF_4",
        status: "OFF_MARKET",
        motivationScore: 50,
        estimatedValue: 3500000,
        equity: 3500000,
        ownerType: "CORP",
        lastSaleDate: "2001-02-28"
    },
    {
        id: "14",
        address: "1501 S Congress Ave",
        lat: 30.2490,
        lng: -97.7495,
        type: "SFR",
        status: "OFF_MARKET",
        motivationScore: 42,
        estimatedValue: 1100000,
        equity: 300000,
        ownerType: "INDIVIDUAL",
        lastSaleDate: "2021-08-15"
    },
    {
        id: "15",
        address: "2000 E 6th St",
        lat: 30.2625,
        lng: -97.7180,
        type: "MF_2",
        status: "OFF_MARKET",
        motivationScore: 48,
        estimatedValue: 550000,
        equity: 120000,
        ownerType: "INDIVIDUAL",
        lastSaleDate: "2020-11-30"
    }
];
