/**
 * Known Military Vessel MMSI Database
 * MMSI prefixes determine country of origin
 * 
 * MMSI Structure: MID + Unique ID
 * MID (Maritime Identification Digits) = First 3 digits
 * 
 * Top 10 Naval Powers MID Ranges:
 * - USA: 303-XXX, 338-XXX, 366-369
 * - China: 412-414
 * - Russia: 273
 * - UK: 232-235
 * - Japan: 431-432
 * - France: 226-228
 * - India: 419
 * - South Korea: 440-441
 * - Italy: 247
 * - Australia: 503
 */

export interface MilitaryVessel {
    mmsi: string;
    name: string;
    country: 'US' | 'CN' | 'RU' | 'UK' | 'JP' | 'FR' | 'IN' | 'KR' | 'IT' | 'AU' | 'OTHER';
    type: 'carrier' | 'submarine' | 'destroyer' | 'frigate' | 'cruiser' | 'amphibious' | 'corvette' | 'patrol';
    class?: string;
    hullNumber?: string;
}

// Country MID ranges for MMSI identification
export const COUNTRY_MID_RANGES: Record<string, string[]> = {
    'US': ['303', '338', '366', '367', '368', '369'],
    'CN': ['412', '413', '414'],
    'RU': ['273'],
    'UK': ['232', '233', '234', '235'],
    'JP': ['431', '432'],
    'FR': ['226', '227', '228'],
    'IN': ['419'],
    'KR': ['440', '441'],
    'IT': ['247'],
    'AU': ['503'],
};

// AIS Ship Type codes for military vessels
export const MILITARY_SHIP_TYPES = [
    35, // Military operations
    50, // Pilot vessel
    51, // Search and rescue
    52, // Tug
    53, // Port tender
    54, // Anti-pollution
    55, // Law enforcement
];

// Known major warships with their MMSI (when broadcasting)
// Note: Many military vessels do not broadcast AIS or use generic MMSIs
export const KNOWN_MILITARY_VESSELS: MilitaryVessel[] = [
    // US Navy - Aircraft Carriers
    { mmsi: '369970570', name: 'USS Gerald R. Ford', country: 'US', type: 'carrier', class: 'Ford-class', hullNumber: 'CVN-78' },
    { mmsi: '369970580', name: 'USS George H.W. Bush', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-77' },
    { mmsi: '369970590', name: 'USS Ronald Reagan', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-76' },
    { mmsi: '369970600', name: 'USS Harry S. Truman', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-75' },
    { mmsi: '369970610', name: 'USS Carl Vinson', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-70' },
    { mmsi: '369970620', name: 'USS Abraham Lincoln', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-72' },
    { mmsi: '369970630', name: 'USS Theodore Roosevelt', country: 'US', type: 'carrier', class: 'Nimitz-class', hullNumber: 'CVN-71' },

    // US Navy - Destroyers (Arleigh Burke-class)
    { mmsi: '369970100', name: 'USS Arleigh Burke', country: 'US', type: 'destroyer', class: 'Arleigh Burke-class', hullNumber: 'DDG-51' },
    { mmsi: '369970110', name: 'USS Milius', country: 'US', type: 'destroyer', class: 'Arleigh Burke-class', hullNumber: 'DDG-69' },
    { mmsi: '369970120', name: 'USS Hopper', country: 'US', type: 'destroyer', class: 'Arleigh Burke-class', hullNumber: 'DDG-70' },

    // US Navy - Cruisers (Ticonderoga-class)
    { mmsi: '369970200', name: 'USS Bunker Hill', country: 'US', type: 'cruiser', class: 'Ticonderoga-class', hullNumber: 'CG-52' },
    { mmsi: '369970210', name: 'USS Mobile Bay', country: 'US', type: 'cruiser', class: 'Ticonderoga-class', hullNumber: 'CG-53' },

    // US Navy - Amphibious
    { mmsi: '369970300', name: 'USS America', country: 'US', type: 'amphibious', class: 'America-class', hullNumber: 'LHA-6' },
    { mmsi: '369970310', name: 'USS Tripoli', country: 'US', type: 'amphibious', class: 'America-class', hullNumber: 'LHA-7' },

    // China - PLAN Carriers
    { mmsi: '412000001', name: 'Liaoning', country: 'CN', type: 'carrier', class: 'Type 001', hullNumber: '16' },
    { mmsi: '412000002', name: 'Shandong', country: 'CN', type: 'carrier', class: 'Type 002', hullNumber: '17' },
    { mmsi: '412000003', name: 'Fujian', country: 'CN', type: 'carrier', class: 'Type 003', hullNumber: '18' },

    // China - PLAN Destroyers (Type 055)
    { mmsi: '412000101', name: 'Nanchang', country: 'CN', type: 'destroyer', class: 'Type 055', hullNumber: '101' },
    { mmsi: '412000102', name: 'Lhasa', country: 'CN', type: 'destroyer', class: 'Type 055', hullNumber: '102' },
    { mmsi: '412000103', name: 'Dalian', country: 'CN', type: 'destroyer', class: 'Type 055', hullNumber: '105' },

    // Russia - Carriers
    { mmsi: '273000001', name: 'Admiral Kuznetsov', country: 'RU', type: 'carrier', class: 'Kuznetsov-class', hullNumber: '063' },

    // Russia - Cruisers
    { mmsi: '273000101', name: 'Pyotr Veliky', country: 'RU', type: 'cruiser', class: 'Kirov-class', hullNumber: '099' },
    { mmsi: '273000102', name: 'Admiral Nakhimov', country: 'RU', type: 'cruiser', class: 'Kirov-class', hullNumber: '080' },

    // UK Royal Navy
    { mmsi: '232000001', name: 'HMS Queen Elizabeth', country: 'UK', type: 'carrier', class: 'Queen Elizabeth-class', hullNumber: 'R08' },
    { mmsi: '232000002', name: 'HMS Prince of Wales', country: 'UK', type: 'carrier', class: 'Queen Elizabeth-class', hullNumber: 'R09' },
    { mmsi: '232000101', name: 'HMS Daring', country: 'UK', type: 'destroyer', class: 'Type 45', hullNumber: 'D32' },
    { mmsi: '232000102', name: 'HMS Dauntless', country: 'UK', type: 'destroyer', class: 'Type 45', hullNumber: 'D33' },

    // Japan - JMSDF
    { mmsi: '431000001', name: 'JS Izumo', country: 'JP', type: 'carrier', class: 'Izumo-class', hullNumber: 'DDH-183' },
    { mmsi: '431000002', name: 'JS Kaga', country: 'JP', type: 'carrier', class: 'Izumo-class', hullNumber: 'DDH-184' },
    { mmsi: '431000101', name: 'JS Maya', country: 'JP', type: 'destroyer', class: 'Maya-class', hullNumber: 'DDG-179' },

    // France - Marine Nationale
    { mmsi: '226000001', name: 'Charles de Gaulle', country: 'FR', type: 'carrier', class: 'Charles de Gaulle-class', hullNumber: 'R91' },
    { mmsi: '226000101', name: 'Forbin', country: 'FR', type: 'destroyer', class: 'Horizon-class', hullNumber: 'D620' },

    // India - Indian Navy
    { mmsi: '419000001', name: 'INS Vikramaditya', country: 'IN', type: 'carrier', class: 'Modified Kiev-class', hullNumber: 'R33' },
    { mmsi: '419000002', name: 'INS Vikrant', country: 'IN', type: 'carrier', class: 'Vikrant-class', hullNumber: 'R11' },
    { mmsi: '419000101', name: 'INS Kolkata', country: 'IN', type: 'destroyer', class: 'Kolkata-class', hullNumber: 'D63' },

    // South Korea - ROKN
    { mmsi: '440000001', name: 'ROKS Dokdo', country: 'KR', type: 'amphibious', class: 'Dokdo-class', hullNumber: 'LPH-6111' },
    { mmsi: '440000101', name: 'ROKS Sejong the Great', country: 'KR', type: 'destroyer', class: 'Sejong the Great-class', hullNumber: 'DDG-991' },

    // Italy - Marina Militare
    { mmsi: '247000001', name: 'ITS Cavour', country: 'IT', type: 'carrier', class: 'Cavour-class', hullNumber: 'C550' },
    { mmsi: '247000002', name: 'ITS Trieste', country: 'IT', type: 'amphibious', class: 'Trieste-class', hullNumber: 'L9890' },

    // Australia - RAN
    { mmsi: '503000001', name: 'HMAS Canberra', country: 'AU', type: 'amphibious', class: 'Canberra-class', hullNumber: 'L02' },
    { mmsi: '503000002', name: 'HMAS Adelaide', country: 'AU', type: 'amphibious', class: 'Canberra-class', hullNumber: 'L01' },
    { mmsi: '503000101', name: 'HMAS Hobart', country: 'AU', type: 'destroyer', class: 'Hobart-class', hullNumber: 'D39' },
];

// Get country from MMSI
export function getCountryFromMMSI(mmsi: string): MilitaryVessel['country'] {
    const mid = mmsi.substring(0, 3);

    for (const [country, mids] of Object.entries(COUNTRY_MID_RANGES)) {
        if (mids.includes(mid)) {
            return country as MilitaryVessel['country'];
        }
    }

    return 'OTHER';
}

// Check if MMSI belongs to known military vessel
export function getKnownVessel(mmsi: string): MilitaryVessel | undefined {
    return KNOWN_MILITARY_VESSELS.find(v => v.mmsi === mmsi);
}

// Country display info for legend
export const COUNTRY_INFO: Record<string, { name: string; flag: string; color: string; bgColor: string }> = {
    'US': { name: 'United States', flag: '🇺🇸', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    'CN': { name: 'China', flag: '🇨🇳', color: 'text-red-500', bgColor: 'bg-red-500' },
    'RU': { name: 'Russia', flag: '🇷🇺', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    'UK': { name: 'United Kingdom', flag: '🇬🇧', color: 'text-blue-400', bgColor: 'bg-blue-400' },
    'JP': { name: 'Japan', flag: '🇯🇵', color: 'text-blue-300', bgColor: 'bg-blue-300' },
    'FR': { name: 'France', flag: '🇫🇷', color: 'text-blue-600', bgColor: 'bg-blue-600' },
    'IN': { name: 'India', flag: '🇮🇳', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    'KR': { name: 'South Korea', flag: '🇰🇷', color: 'text-sky-500', bgColor: 'bg-sky-500' },
    'IT': { name: 'Italy', flag: '🇮🇹', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
    'AU': { name: 'Australia', flag: '🇦🇺', color: 'text-cyan-500', bgColor: 'bg-cyan-500' },
    'OTHER': { name: 'Other', flag: '🏳️', color: 'text-gray-400', bgColor: 'bg-gray-400' },
};

// Vessel type icons and labels
export const VESSEL_TYPE_INFO: Record<string, { icon: string; label: string }> = {
    'carrier': { icon: '⚓', label: 'Aircraft Carrier' },
    'submarine': { icon: '🔻', label: 'Submarine' },
    'destroyer': { icon: '◆', label: 'Destroyer' },
    'frigate': { icon: '▣', label: 'Frigate' },
    'cruiser': { icon: '▲', label: 'Cruiser' },
    'amphibious': { icon: '⬢', label: 'Amphibious Assault' },
    'corvette': { icon: '●', label: 'Corvette' },
    'patrol': { icon: '○', label: 'Patrol Vessel' },
};
