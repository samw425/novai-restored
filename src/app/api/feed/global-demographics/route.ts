import { NextResponse } from 'next/server';

// Mock Data for Global Demographics
const COUNTRIES = [
    { id: 'chn', name: 'China', lat: 35.8617, lng: 104.1954, population: 1425671352, growth: -0.02, medianAge: 38.4, fertility: 1.2, urban: 61 },
    { id: 'ind', name: 'India', lat: 20.5937, lng: 78.9629, population: 1428627663, growth: 0.81, medianAge: 28.7, fertility: 2.0, urban: 35 },
    { id: 'usa', name: 'United States', lat: 37.0902, lng: -95.7129, population: 339996563, growth: 0.50, medianAge: 38.5, fertility: 1.6, urban: 83 },
    { id: 'idn', name: 'Indonesia', lat: -0.7893, lng: 113.9213, population: 277534122, growth: 0.74, medianAge: 29.9, fertility: 2.1, urban: 57 },
    { id: 'pak', name: 'Pakistan', lat: 30.3753, lng: 69.3451, population: 240485658, growth: 1.98, medianAge: 20.6, fertility: 3.3, urban: 37 },
    { id: 'nga', name: 'Nigeria', lat: 9.0820, lng: 8.6753, population: 223804632, growth: 2.41, medianAge: 18.6, fertility: 5.1, urban: 53 },
    { id: 'bra', name: 'Brazil', lat: -14.2350, lng: -51.9253, population: 216422446, growth: 0.52, medianAge: 33.5, fertility: 1.6, urban: 87 },
    { id: 'bgd', name: 'Bangladesh', lat: 23.6850, lng: 90.3563, population: 172954319, growth: 1.03, medianAge: 27.9, fertility: 1.9, urban: 39 },
    { id: 'rus', name: 'Russia', lat: 61.5240, lng: 105.3188, population: 144444359, growth: -0.19, medianAge: 40.3, fertility: 1.5, urban: 75 },
    { id: 'mex', name: 'Mexico', lat: 23.6345, lng: -102.5528, population: 128455567, growth: 0.75, medianAge: 29.3, fertility: 1.8, urban: 81 },
    { id: 'jpn', name: 'Japan', lat: 36.2048, lng: 138.2529, population: 123294513, growth: -0.53, medianAge: 48.6, fertility: 1.3, urban: 92 },
    { id: 'eth', name: 'Ethiopia', lat: 9.1450, lng: 40.4897, population: 126527060, growth: 2.55, medianAge: 19.5, fertility: 3.9, urban: 22 },
    { id: 'phl', name: 'Philippines', lat: 12.8797, lng: 121.7740, population: 117337368, growth: 1.54, medianAge: 25.7, fertility: 2.4, urban: 47 },
    { id: 'egy', name: 'Egypt', lat: 26.8206, lng: 30.8025, population: 112716598, growth: 1.56, medianAge: 24.8, fertility: 2.9, urban: 43 },
    { id: 'vnm', name: 'Vietnam', lat: 14.0583, lng: 108.2772, population: 98858950, growth: 0.68, medianAge: 32.7, fertility: 1.9, urban: 38 },
    { id: 'cod', name: 'DR Congo', lat: -4.0383, lng: 21.7587, population: 102262808, growth: 3.29, medianAge: 15.6, fertility: 6.1, urban: 46 },
    { id: 'tur', name: 'Turkey', lat: 38.9637, lng: 35.2433, population: 85816199, growth: 0.56, medianAge: 31.8, fertility: 1.9, urban: 77 },
    { id: 'irn', name: 'Iran', lat: 32.4279, lng: 53.6880, population: 89172767, growth: 0.70, medianAge: 33.0, fertility: 1.7, urban: 76 },
    { id: 'deu', name: 'Germany', lat: 51.1657, lng: 10.4515, population: 83294633, growth: -0.09, medianAge: 46.7, fertility: 1.5, urban: 77 },
    { id: 'tha', name: 'Thailand', lat: 15.8700, lng: 100.9925, population: 71801279, growth: 0.14, medianAge: 39.0, fertility: 1.3, urban: 53 },
    { id: 'gbr', name: 'United Kingdom', lat: 55.3781, lng: -3.4360, population: 67736802, growth: 0.34, medianAge: 40.6, fertility: 1.6, urban: 84 },
    { id: 'fra', name: 'France', lat: 46.2276, lng: 2.2137, population: 64756584, growth: 0.20, medianAge: 42.4, fertility: 1.8, urban: 81 },
    { id: 'ita', name: 'Italy', lat: 41.8719, lng: 12.5674, population: 58870762, growth: -0.28, medianAge: 46.5, fertility: 1.2, urban: 71 },
    { id: 'zaf', name: 'South Africa', lat: -30.5595, lng: 22.9375, population: 60414495, growth: 0.87, medianAge: 28.0, fertility: 2.3, urban: 68 },
    { id: 'kor', name: 'South Korea', lat: 35.9078, lng: 127.7669, population: 51784059, growth: -0.06, medianAge: 43.2, fertility: 0.8, urban: 81 },
    { id: 'col', name: 'Colombia', lat: 4.5709, lng: -74.2973, population: 52085168, growth: 0.67, medianAge: 31.2, fertility: 1.7, urban: 82 },
    { id: 'esp', name: 'Spain', lat: 40.4637, lng: -3.7492, population: 47519628, growth: -0.08, medianAge: 43.9, fertility: 1.2, urban: 81 },
    { id: 'arg', name: 'Argentina', lat: -38.4161, lng: -63.6167, population: 45773884, growth: 0.58, medianAge: 32.4, fertility: 1.9, urban: 92 },
    { id: 'can', name: 'Canada', lat: 56.1304, lng: -106.3468, population: 38781291, growth: 0.85, medianAge: 41.1, fertility: 1.4, urban: 82 },
    { id: 'sau', name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, population: 36947025, growth: 1.48, medianAge: 32.4, fertility: 2.2, urban: 84 },
    { id: 'aus', name: 'Australia', lat: -25.2744, lng: 133.7751, population: 26439111, growth: 1.02, medianAge: 37.5, fertility: 1.6, urban: 86 }
];

export async function GET() {
    // Simulate real-time flux
    const countriesWithFlux = COUNTRIES.map(c => {
        // Add a tiny random variation to simulate live counting
        const flux = Math.floor(Math.random() * 10) - 3;
        return {
            ...c,
            population: c.population + flux
        };
    });

    // Calculate Global Stats
    const totalPopulation = countriesWithFlux.reduce((acc, curr) => acc + curr.population, 0) + 1500000000; // Adding buffer for rest of world
    const avgGrowth = countriesWithFlux.reduce((acc, curr) => acc + curr.growth, 0) / countriesWithFlux.length;

    return NextResponse.json({
        countries: countriesWithFlux,
        globalStats: {
            totalPopulation,
            avgGrowth,
            timestamp: new Date().toISOString()
        }
    });
}
