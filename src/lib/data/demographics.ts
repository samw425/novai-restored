export interface DemographicData {
    id: string;
    name: string;
    population: number;
    growth_rate: number; // Annual growth rate in percentage
    poverty_rate: number; // Percentage living below poverty line
    median_age: number;
    ethnicity: { group: string; percentage: number }[];
    religion: { group: string; percentage: number }[];
    last_updated: string;
}

export const GLOBAL_DEMOGRAPHICS: Record<string, DemographicData> = {
    'US': {
        id: 'US',
        name: 'United States',
        population: 341814420,
        growth_rate: 0.5,
        poverty_rate: 11.5,
        median_age: 38.9,
        ethnicity: [
            { group: 'White', percentage: 58.9 },
            { group: 'Hispanic/Latino', percentage: 19.1 },
            { group: 'Black/African American', percentage: 13.6 },
            { group: 'Asian', percentage: 6.3 },
            { group: 'Other/Mixed', percentage: 2.1 }
        ],
        religion: [
            { group: 'Christian', percentage: 63.0 },
            { group: 'Unaffiliated', percentage: 29.0 },
            { group: 'Jewish', percentage: 2.0 },
            { group: 'Muslim', percentage: 1.0 },
            { group: 'Other', percentage: 5.0 }
        ],
        last_updated: '2025-01-15T08:00:00Z'
    },
    'CN': {
        id: 'CN',
        name: 'China',
        population: 1425671352,
        growth_rate: -0.1,
        poverty_rate: 13.0, // Relative poverty
        median_age: 39.0,
        ethnicity: [
            { group: 'Han Chinese', percentage: 91.1 },
            { group: 'Zhuang', percentage: 1.3 },
            { group: 'Other (55 groups)', percentage: 7.6 }
        ],
        religion: [
            { group: 'Unaffiliated/Folk', percentage: 51.8 },
            { group: 'Buddhist', percentage: 18.2 },
            { group: 'Christian', percentage: 5.1 },
            { group: 'Muslim', percentage: 1.8 },
            { group: 'Other', percentage: 23.1 }
        ],
        last_updated: '2025-01-15T08:00:00Z'
    },
    'IN': {
        id: 'IN',
        name: 'India',
        population: 1441719852,
        growth_rate: 0.9,
        poverty_rate: 16.4, // Multidimensional
        median_age: 28.7,
        ethnicity: [
            { group: 'Indo-Aryan', percentage: 72.0 },
            { group: 'Dravidian', percentage: 25.0 },
            { group: 'Mongoloid/Other', percentage: 3.0 }
        ],
        religion: [
            { group: 'Hindu', percentage: 79.8 },
            { group: 'Muslim', percentage: 14.2 },
            { group: 'Christian', percentage: 2.3 },
            { group: 'Sikh', percentage: 1.7 },
            { group: 'Other', percentage: 2.0 }
        ],
        last_updated: '2025-01-15T08:00:00Z'
    },
    'NG': {
        id: 'NG',
        name: 'Nigeria',
        population: 229152217,
        growth_rate: 2.4,
        poverty_rate: 40.1,
        median_age: 18.6,
        ethnicity: [
            { group: 'Hausa', percentage: 30.0 },
            { group: 'Yoruba', percentage: 15.5 },
            { group: 'Igbo', percentage: 15.2 },
            { group: 'Fulani', percentage: 6.0 },
            { group: 'Other', percentage: 33.3 }
        ],
        religion: [
            { group: 'Muslim', percentage: 53.5 },
            { group: 'Christian', percentage: 45.9 },
            { group: 'Other', percentage: 0.6 }
        ],
        last_updated: '2025-01-15T08:00:00Z'
    },
    'BR': {
        id: 'BR',
        name: 'Brazil',
        population: 217637297,
        growth_rate: 0.5,
        poverty_rate: 29.6,
        median_age: 33.5,
        ethnicity: [
            { group: 'White', percentage: 47.7 },
            { group: 'Mixed (Pardo)', percentage: 43.1 },
            { group: 'Black', percentage: 7.6 },
            { group: 'Asian', percentage: 1.1 },
            { group: 'Indigenous', percentage: 0.4 }
        ],
        religion: [
            { group: 'Catholic', percentage: 64.6 },
            { group: 'Protestant', percentage: 22.2 },
            { group: 'No Religion', percentage: 8.0 },
            { group: 'Spiritist', percentage: 2.0 },
            { group: 'Other', percentage: 3.2 }
        ],
        last_updated: '2025-01-15T08:00:00Z'
    }
};
