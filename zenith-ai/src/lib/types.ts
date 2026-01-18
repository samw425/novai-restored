export interface ZenithProperty {
    id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
    estimatedValue: number; // In dollars
    equity: number; // In dollars
    motivationScore: number; // 0-100
    status: 'ACTIVE_MARKET' | 'OFF_MARKET' | 'FORECLOSURE_RISK' | 'TAX_DELINQUENT' | 'PRE_FORECLOSURE' | 'FSBO';
    type: 'SFR' | 'MF' | 'APARTMENT' | 'CONDO' | 'LAND' | 'COMMERCIAL';
    ownerName?: string;
    ownerType?: 'INDIVIDUAL' | 'CORPORATE' | 'TRUST' | 'BANK' | 'ABSENTEE';
    lastSaleDate?: string;
    lastSalePrice?: number;
    beds?: number;
    baths?: number;
    squareFeet?: number;
    yearBuilt?: number;
    lotSize?: number; // Acres
    units?: number; // For 2-4 unit classification
    subType?: string; // e.g. "Duplex", "Triplex"
    rentEstimate?: number;
    capRate?: number;
    yieldScore?: number;
    images?: string[]; // Array of image URLs
    county?: string; // Added for ArcGIS/Record keeping
    distressSignal?: {
        type: 'TAX_LIEN' | 'CODE_VIOLATION' | 'PROBATE' | 'ZONING' | 'EQUITY_SPIKE' | 'OTHER';
        description: string;
        severity: number; // 0-100
    };
    leadScore?: number; // 0-100 Wealth IQ
    provenance: {
        base: DataProvenance;
        financial?: DataProvenance;
        contact?: DataProvenance;
    };
    verification?: {
        isValid: boolean;
        confidence: number;
        issues: string[];
        metadata: {
            hasPhotos: boolean;
            isOffMarket: boolean;
            dataSynergy: number;
        };
    };
    recon?: {
        marketAverage: number;
        zenithDelta: number;
        superiorityScore: number;
        competitors: {
            provider: string;
            estimatedValue: number;
            confidence: number;
            lastUpdated: string;
        }[];
    };
    permits?: {
        id: string;
        type: string;
        description: string;
        status: 'COMPLETED' | 'ISSUED' | 'EXPIRED';
        date: string;
        value: number;
    }[];
    alpha?: {
        momentumScore: number;
        projectedGrowth24mo: number;
        exitWindow: string;
        riskProfile: string;
        marketDrivers: string[];
    };
    briefing?: string;

    // Phase 2: Enrichment Data
    neighborhood?: {
        walkScore: number;        // 0-100
        transitScore: number;     // 0-100
        bikeScore: number;        // 0-100
        crimeRating: 'LOW' | 'MEDIUM' | 'HIGH';
        crimeIndex: number;       // 0-100 (lower is safer)
        schools: {
            name: string;
            rating: number;       // 1-10
            type: 'elementary' | 'middle' | 'high';
            distance: string;     // "0.3 mi"
            students?: number;
        }[];
        amenities?: {
            type: 'grocery' | 'restaurant' | 'park' | 'transit';
            name: string;
            distance: string;
        }[];
    };

    taxHistory?: {
        year: number;
        amount: number;
        status: 'PAID' | 'DELINQUENT' | 'PARTIAL';
        dueDate?: string;
        assessedValue?: number;
    }[];

    saleHistory?: {
        date: string;
        price: number;
        buyer?: string;
        seller?: string;
        deedType?: string;
        pricePerSqft?: number;
    }[];
}

export interface DataProvenance {
    source: 'INSTITUTIONAL_CORE' | 'COUNTY_GIS' | 'OSM_GEO' | 'SOCRATA_OPEN_DATA' | 'MOCK_INJECTOR' | 'USER_SUBMITTED' | 'MARKET_DISCOVERY' | 'OMNI_CLIENT_AUTO' | string;
    confidence: number; // 0.0 - 1.0
    verifiedAt: string; // ISO Date
    rawId?: string; // Original ID from source
}
