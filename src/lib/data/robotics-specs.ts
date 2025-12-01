export interface RobotSpec {
    id: string;
    name: string;
    company: string;
    status: 'PROTOTYPE' | 'DEVELOPMENT' | 'PRODUCTION' | 'RETIRED';
    height: string;
    weight: string;
    actuators: string;
    battery: string;
    vision: string;
    compute: string;
    description: string;
    imageUrl: string;
    website: string;
}

export const ROBOT_SPECS: RobotSpec[] = [
    {
        id: 'optimus-gen2',
        name: 'Optimus Gen 2',
        company: 'Tesla',
        status: 'DEVELOPMENT',
        height: '5\'8" (1.73m)',
        weight: '125 lbs (57kg)',
        actuators: 'Tesla-designed electromechanical',
        battery: '2.3 kWh (Tesla Integrated)',
        vision: 'Tesla Vision (End-to-End Neural Net)',
        compute: 'Tesla FSD Chip',
        description: 'General purpose humanoid designed to perform unsafe, repetitive or boring tasks. Features 11 DoF hands with tactile sensing and faster walking speed than Gen 1.',
        imageUrl: '/images/robotics/optimus-gen2.png',
        website: 'https://www.tesla.com/AI'
    },
    {
        id: 'atlas-electric',
        name: 'Atlas (Electric)',
        company: 'Boston Dynamics',
        status: 'PROTOTYPE',
        height: '5\'11" (1.8m)',
        weight: '196 lbs (89kg)',
        actuators: 'Custom Electric High-Torque',
        battery: 'Unknown',
        vision: 'Depth sensors + RGB cameras',
        compute: 'Onboard Custom Stack',
        description: 'The next generation of Atlas. Fully electric, stronger, and more agile than the hydraulic predecessor. Designed for real-world applications.',
        imageUrl: '/images/robotics/atlas-electric.png',
        website: 'https://bostondynamics.com/atlas'
    },
    {
        id: 'figure-02',
        name: 'Figure 02',
        company: 'Figure AI',
        status: 'DEVELOPMENT',
        height: '5\'6" (1.68m)',
        weight: '132 lbs (60kg)',
        actuators: 'Electric',
        battery: '5+ Hours Runtime',
        vision: 'AI-powered Vision Language Models',
        compute: 'Onboard + Cloud (OpenAI Integration)',
        description: 'The world\'s first commercially viable autonomous humanoid robot. Features OpenAI integration for speech-to-speech reasoning and 3x computing power of Figure 01.',
        imageUrl: '/images/robotics/figure-02.png',
        website: 'https://www.figure.ai/'
    },
    {
        id: 'digit-v4',
        name: 'Digit',
        company: 'Agility Robotics',
        status: 'PRODUCTION',
        height: '5\'9" (1.75m)',
        weight: '140 lbs (63.5kg)',
        actuators: 'Electric',
        battery: 'Unknown',
        vision: 'LiDAR + Stereo Cameras',
        compute: 'Onboard',
        description: 'Designed for logistics and warehouse work. The first humanoid robot to be mass-produced and deployed in real commercial environments (Amazon).',
        imageUrl: '/images/robotics/digit-v4.png',
        website: 'https://agilityrobotics.com/'
    },
    {
        id: 'ameca',
        name: 'Ameca',
        company: 'Engineered Arts',
        status: 'PRODUCTION',
        height: '6\'2" (1.87m)',
        weight: '108 lbs (49kg)',
        actuators: 'Pneumatic + Electric Hybrid',
        battery: 'Mains Power (Stationary)',
        vision: 'Binocular Eye Cameras',
        compute: 'Tritium Robot OS',
        description: 'The world\'s most advanced human-shaped robot for human-robot interaction. Focuses on realistic facial expressions and gesture generation.',
        imageUrl: '/images/robotics/ameca.png',
        website: 'https://www.engineeredarts.co.uk/robot/ameca/'
    },
    {
        id: 'unitree-g1',
        name: 'Unitree G1',
        company: 'Unitree',
        status: 'PRODUCTION',
        height: '4\'2" (1.27m)',
        weight: '77 lbs (35kg)',
        actuators: 'High-performance joint motors',
        battery: '2 Hours',
        vision: '3D LiDAR + Depth Camera',
        compute: '8-core High Performance CPU',
        description: 'Humanoid agent AI avatar. Capable of extreme flexibility and dynamic movement. Priced for mass adoption/research ($16k).',
        imageUrl: '/images/robotics/unitree-g1.png',
        website: 'https://shop.unitree.com/products/unitree-g1'
    }
];
