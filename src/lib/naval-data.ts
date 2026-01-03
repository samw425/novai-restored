export interface NavalFacility {
    id: string;
    name: string;
    country: string;
    type: 'base' | 'shipyard' | 'hq';
    location: {
        lat: number;
        lng: number;
        region: string;
    };
    description: string;
}

export interface MajorCarrier {
    id: string;
    name: string;
    hullNumber: string;
    country: 'US' | 'CN' | 'RU' | 'UK' | 'FR' | 'IN';
    class: string;
    homeport: string;
    status: 'deployed' | 'port' | 'maintenance';
}

export const NAVAL_FACILITIES: NavalFacility[] = [
    // UNITED STATES
    { id: 'norfolk', name: 'Naval Station Norfolk', country: 'US', type: 'base', location: { lat: 36.9472, lng: -76.3014, region: 'Virginia, USA' }, description: 'World\'s largest naval station, home to Atlantic Fleet.' },
    { id: 'san-diego', name: 'Naval Base San Diego', country: 'US', type: 'base', location: { lat: 32.6847, lng: -117.1213, region: 'California, USA' }, description: 'Principal homeport of the Pacific Fleet.' },
    { id: 'pearl-harbor', name: 'Joint Base Pearl Harbor-Hickam', country: 'US', type: 'base', location: { lat: 21.3445, lng: -157.9748, region: 'Hawaii, USA' }, description: 'Strategic hub in the Central Pacific.' },
    { id: 'yokosuka', name: 'Commander Fleet Activities Yokosuka', country: 'US', type: 'base', location: { lat: 35.2931, lng: 139.6732, region: 'Yokosuka, Japan' }, description: 'Forward-deployed base for the US 7th Fleet.' },
    { id: 'guam', name: 'Naval Base Guam', country: 'US', type: 'base', location: { lat: 13.4443, lng: 144.6628, region: 'Guam' }, description: 'Deep-water port supporting US subs and surface ships in the Pacific.' },
    { id: 'rota', name: 'Naval Station Rota', country: 'US', type: 'base', location: { lat: 36.6158, lng: -6.3400, region: 'Spain' }, description: 'Strategic gateway to the Mediterranean.' },

    // CHINA (PLAN)
    { id: 'yulin', name: 'Yulin Naval Base', country: 'CN', type: 'base', location: { lat: 18.2166, lng: 109.5244, region: 'Sanya, Hainan, China' }, description: 'Strategic base for PLAN Submarines and Carriers in the South China Sea.' },
    { id: 'shenzhen-base', name: 'Shenzhen Naval Base', country: 'CN', type: 'base', location: { lat: 22.5431, lng: 114.0579, region: 'Guangdong, China' }, description: 'Major PLAN base for South Sea Fleet.' },
    { id: 'jiangnan', name: 'Jiangnan Shipyard', country: 'CN', type: 'shipyard', location: { lat: 31.3533, lng: 121.7372, region: 'Shanghai, China' }, description: 'Primary construction site for PLAN high-tech warships and carriers.' },
    { id: 'qingdao', name: 'Guzhenkou Naval Base', country: 'CN', type: 'base', location: { lat: 35.7161, lng: 120.0163, region: 'Qingdao, China' }, description: 'Northern homeport for the Liaoning carrier.' },

    // RUSSIA
    { id: 'severomorsk', name: 'Severomorsk Naval Base', country: 'RU', type: 'base', location: { lat: 69.0689, lng: 33.4168, region: 'Murmansk, Russia' }, description: 'HQ of the Russian Northern Fleet.' },
    { id: 'sevastopol', name: 'Sevastopol Naval Base', country: 'RU', type: 'base', location: { lat: 44.6167, lng: 33.5250, region: 'Crimea' }, description: 'HQ of the Black Sea Fleet (Disputed).' },
    { id: 'vladivostok', name: 'Vladivostok Naval Base', country: 'RU', type: 'base', location: { lat: 43.1155, lng: 131.8855, region: 'Vladivostok, Russia' }, description: 'HQ of the Pacific Fleet.' },

    // UNITED KINGDOM
    { id: 'portsmouth', name: 'HMNB Portsmouth', country: 'UK', type: 'base', location: { lat: 50.8037, lng: -1.0970, region: 'Portsmouth, UK' }, description: 'Home of the Royal Navy and the Queen Elizabeth class carriers.' },

    // FRANCE
    { id: 'toulon', name: 'Toulon Naval Base', country: 'FR', type: 'base', location: { lat: 43.1167, lng: 5.9167, region: 'Toulon, France' }, description: 'Major Mediterranean base, homeport of Charles de Gaulle.' },

    // INDIA
    { id: 'karwar', name: 'INS Kadamba', country: 'IN', type: 'base', location: { lat: 14.7766, lng: 74.1281, region: 'Karwar, India' }, description: 'Major base on India\'s west coast, homeport for INS Vikramaditya.' }
];

export const MAJOR_CARRIERS: MajorCarrier[] = [
    { id: 'cvn-78', name: 'USS Gerald R. Ford', hullNumber: 'CVN-78', country: 'US', class: 'Ford', homeport: 'Norfolk', status: 'deployed' },
    { id: 'cvn-68', name: 'USS Nimitz', hullNumber: 'CVN-68', country: 'US', class: 'Nimitz', homeport: 'Bremerton', status: 'port' },
    { id: 'cvn-69', name: 'USS Dwight D. Eisenhower', hullNumber: 'CVN-69', country: 'US', class: 'Nimitz', homeport: 'Norfolk', status: 'deployed' },
    { id: 'cvn-70', name: 'USS Carl Vinson', hullNumber: 'CVN-70', country: 'US', class: 'Nimitz', homeport: 'San Diego', status: 'port' },
    { id: 'cvn-71', name: 'USS Theodore Roosevelt', hullNumber: 'CVN-71', country: 'US', class: 'Nimitz', homeport: 'San Diego', status: 'deployed' },
    { id: 'cvn-72', name: 'USS Abraham Lincoln', hullNumber: 'CVN-72', country: 'US', class: 'Nimitz', homeport: 'San Diego', status: 'port' },
    { id: 'cvn-73', name: 'USS George Washington', hullNumber: 'CVN-73', country: 'US', class: 'Nimitz', homeport: 'Yokosuka', status: 'deployed' },
    { id: 'cvn-74', name: 'USS John C. Stennis', hullNumber: 'CVN-74', country: 'US', class: 'Nimitz', homeport: 'Norfolk', status: 'maintenance' },
    { id: 'cvn-75', name: 'USS Harry S. Truman', hullNumber: 'CVN-75', country: 'US', class: 'Nimitz', homeport: 'Norfolk', status: 'port' },
    { id: 'cvn-76', name: 'USS Ronald Reagan', hullNumber: 'CVN-76', country: 'US', class: 'Nimitz', homeport: 'San Diego', status: 'maintenance' },
    { id: 'cvn-77', name: 'USS George H.W. Bush', hullNumber: 'CVN-77', country: 'US', class: 'Nimitz', homeport: 'Norfolk', status: 'port' },

    { id: 'plan-16', name: 'Liaoning', hullNumber: '16', country: 'CN', class: 'Type 001', homeport: 'Qingdao', status: 'deployed' },
    { id: 'plan-17', name: 'Shandong', hullNumber: '17', country: 'CN', class: 'Type 002', homeport: 'Sanya', status: 'deployed' },
    { id: 'plan-18', name: 'Fujian', hullNumber: '18', country: 'CN', class: 'Type 003', homeport: 'Shanghai', status: 'maintenance' },

    { id: 'ru-kuz', name: 'Admiral Kuznetsov', hullNumber: '063', country: 'RU', class: 'Kuznetsov', homeport: 'Murmansk', status: 'maintenance' },

    { id: 'uk-r08', name: 'HMS Queen Elizabeth', hullNumber: 'R08', country: 'UK', class: 'Queen Elizabeth', homeport: 'Portsmouth', status: 'port' },
    { id: 'uk-r09', name: 'HMS Prince of Wales', hullNumber: 'R09', country: 'UK', class: 'Queen Elizabeth', homeport: 'Portsmouth', status: 'deployed' },

    { id: 'fr-r91', name: 'Charles de Gaulle', hullNumber: 'R91', country: 'FR', class: 'Charles de Gaulle', homeport: 'Toulon', status: 'port' }
];
