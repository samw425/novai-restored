---
description: Resume Zenith AI - Complete project state and improvement plan
---

# 🏠 ZENITH AI - COMPLETE PROJECT MASTER PLAN

> **Last Updated:** January 18, 2026  
> **Status:** ✅ 4-PHASE IMPROVEMENT COMPLETE - Ready for Deploy  
> **Live URL:** https://zenith-ai.pages.dev  
> **Project Path:** `/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai`

---

## 📍 CURRENT STATE SUMMARY

### What Zenith AI Is
A P2P off-market real estate discovery platform - "Zillow for off-market properties." Helps investors, wholesalers, and buyers find motivated sellers with distressed properties (tax delinquent, pre-foreclosure, high equity).

### What's Working ✅
| Feature | Status | Location |
|---------|--------|----------|
| Multi-source data oracle | ✅ Live | `src/lib/data/oracle.ts` (488 lines) |
| ArcGIS county tax parcel integration | ✅ Live | `src/lib/data/arcgis.ts` |
| Socrata open data (Chicago, Austin, more) | ✅ Live | `src/lib/data/socrata.ts` |
| OSM nationwide geocoding | ✅ Live | `src/lib/data/osm.ts` |
| Omni-Client adaptive GIS | ✅ Live | `src/lib/data/omni_client.ts` |
| ZenithValuation engine (state medians + zip multipliers) | ✅ Live | `src/lib/data/valuation.ts` |
| Motivation scoring algorithm | ✅ Live | `src/lib/data/motivation-engine.ts` |
| 7 AI agents (Verification, Recon, Zillow, Alpha, Narrative, Permit, Revenue) | ✅ Live | `src/lib/agents/` |
| Property cards with satellite imagery | ✅ Live | `src/components/property/PropertyCard.tsx` |
| Mapbox/Leaflet map integration | ✅ Live | `src/components/map/` |
| Cloudflare Pages deployment | ✅ Live | `wrangler.toml` |
| RentCast AVM integration | ✅ Live | `src/lib/data/avm-service.ts` |
| **PropertyDetailModal (5 tabs)** | ✅ NEW | `src/components/property/PropertyDetailModal.tsx` |
| **Neighborhood Data Service** | ✅ NEW | `src/lib/data/neighborhood-service.ts` |
| **History Service (tax/sales)** | ✅ NEW | `src/lib/data/history-service.ts` |
| **Professional Skip Tracing** | ✅ NEW | `src/lib/data/skip-trace.ts` |
| **Credit System** | ✅ NEW | `src/lib/credits/credit-service.ts` |
| **Multi-Source Image Service** | ✅ NEW | `src/lib/data/image-service.ts` |

### Recently Fixed (Jan 18 Session) ✅
| Issue | Solution |
|-------|----------|
| No Zillow-level property modal | Created PropertyDetailModal.tsx (530 lines) with 5 tabs |
| Skip tracing incomplete | BatchSkipTracing API + caching + credits |
| No neighborhood data | Walk Score, schools, crime via neighborhood-service.ts |
| No tax/sale history | history-service.ts with Socrata integration |
| No street view images | Mapillary + Google Street View via image-service.ts |

---

## 🏗️ CODEBASE ARCHITECTURE

```
zenith-ai/src/
├── app/                          # Next.js pages
│   ├── globals.css               # Elite design system (Tailwind v3)
│   └── page.tsx                  # Main search/map page
├── components/
│   ├── home/                     # Landing page components
│   ├── layout/                   # Header, footer, nav
│   ├── map/                      # Map engine (Mapbox/Leaflet)
│   ├── property/
│   │   └── PropertyCard.tsx      # Property listing card (236 lines)
│   └── ui/
│       └── PremiumCard.tsx       # Alternative premium card style
├── lib/
│   ├── agents/                   # AI agent system
│   │   ├── NarrativeSynthesisAgent.ts  # Executive briefings
│   │   ├── PermitAgent.ts              # Building permit lookup
│   │   ├── PredictiveAlphaAgent.ts     # Future projections
│   │   ├── ReconAgent.ts               # Competitor analysis, comps
│   │   ├── RevenueAgent.ts             # Revenue projections
│   │   ├── VerificationAgent.ts        # Data validation
│   │   └── ZillowAgent.ts              # Zillow data scraping
│   ├── data/
│   │   ├── arcgis.ts             # County GIS integration
│   │   ├── arcgis_registry.json  # Known ArcGIS endpoints
│   │   ├── avm-service.ts        # RentCast AVM integration
│   │   ├── ingestor.ts           # Data normalization
│   │   ├── live-feed.ts          # Real-time property feed
│   │   ├── motivation-engine.ts  # Seller motivation scoring (0-100)
│   │   ├── omni_client.ts        # Adaptive GIS discovery
│   │   ├── oracle.ts             # MAIN DATA HUB (488 lines)
│   │   ├── osm.ts                # OpenStreetMap integration
│   │   ├── skip-trace.ts         # Owner contact lookup (95 lines)
│   │   ├── socrata.ts            # Open data portals
│   │   ├── us_county_directory.json
│   │   └── valuation.ts          # Property value estimation (248 lines)
│   ├── supabase/
│   │   └── client.ts             # Database connection
│   └── types.ts                  # ZenithProperty interface (86 lines)
└── scripts/                      # Build/deploy scripts
```

### Key Interface: ZenithProperty (src/lib/types.ts)
```typescript
interface ZenithProperty {
    id: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
    estimatedValue: number;
    equity: number;
    motivationScore: number;  // 0-100
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
    lotSize?: number;
    units?: number;
    subType?: string;
    rentEstimate?: number;
    capRate?: number;
    images?: string[];
    county?: string;
    distressSignal?: { type: string; description: string; severity: number };
    leadScore?: number;
    provenance: { base: DataProvenance; financial?: DataProvenance; contact?: DataProvenance };
    verification?: { isValid: boolean; confidence: number; issues: string[]; metadata: {...} };
    recon?: { marketAverage: number; zenithDelta: number; superiorityScore: number; competitors: [...] };
    permits?: [...];
    alpha?: { momentumScore: number; projectedGrowth24mo: number; exitWindow: string; ... };
    briefing?: string;
}
```

---

## 🎯 THE 4-PHASE IMPROVEMENT PLAN

---

### PHASE 1: Property Detail Modal (2-3 hours)
**Goal:** Create Zillow-style immersive property view

#### Files to Create
| File | Purpose |
|------|---------|
| `src/components/property/PropertyDetailModal.tsx` | Full-screen modal with tabs |
| `src/components/property/ImageGallery.tsx` | Photo carousel with lightbox |
| `src/components/property/PropertyTabs.tsx` | Tab navigation component |

#### Files to Modify
| File | Changes |
|------|---------|
| `src/components/property/PropertyCard.tsx` | Add onClick to open modal, add state management |

#### Detailed Implementation Steps
1. **Create modal overlay** with Framer Motion slide-up animation
   - Use `AnimatePresence` for enter/exit
   - Full viewport on mobile, centered 90% width on desktop
   - Dark backdrop with blur

2. **Build image gallery**
   - Main hero image (70% height)
   - Thumbnail strip below (scroll horizontal)
   - Lightbox mode on click
   - Lazy loading with placeholder

3. **Implement 5 tabs:**
   - **Overview**: Price, address, beds/baths/sqft, status badges, motivation score
   - **Details**: Year built, lot size, property type, owner info, units
   - **History**: Tax payments, sale history, permit history (Phase 2)
   - **Neighborhood**: Walk Score, schools, crime (Phase 2)
   - **Skip Trace**: Owner contact, unlock button (Phase 3)

4. **Wire click handler** in PropertyCard.tsx:
   ```tsx
   const [selectedProperty, setSelectedProperty] = useState<ZenithProperty | null>(null);
   <PropertyCard onClick={() => setSelectedProperty(property)} />
   {selectedProperty && <PropertyDetailModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
   ```

5. **Add keyboard navigation:**
   - Escape to close modal
   - Left/Right arrows for image gallery
   - Tab for accessibility

6. **Test mobile responsiveness:**
   - Full-screen modal on mobile
   - Swipe gestures for images
   - Sticky tab bar

---

### PHASE 2: Rich Data Enrichment (3-4 hours)
**Goal:** Add neighborhood, school, crime, and history data

#### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/data/neighborhood-service.ts` | Walk Score, schools, crime APIs |
| `src/lib/data/history-service.ts` | Tax and sale history lookup |

#### Files to Modify
| File | Changes |
|------|---------|
| `src/lib/types.ts` | Add `neighborhood`, `taxHistory`, `saleHistory` fields |
| `src/lib/data/oracle.ts` | Call enrichment services in `enrichPropertyDetails()` |

#### New TypeScript Interface Extensions (add to types.ts)
```typescript
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
        students: number;
    }[];
};

taxHistory?: {
    year: number;
    amount: number;
    status: 'PAID' | 'DELINQUENT' | 'PARTIAL';
    dueDate?: string;
}[];

saleHistory?: {
    date: string;
    price: number;
    buyer?: string;
    seller?: string;
    deedType?: string;
}[];
```

#### API Integrations (Free Tiers Available)
| Data | API | Free Tier | Implementation |
|------|-----|-----------|----------------|
| Walk Score | walkscore.com/professional | 5,000/day | `GET /score?lat=X&lon=Y&wsapikey=KEY` |
| Schools | greatschools.org API | Free with attribution | `GET /schools/nearby?lat=X&lon=Y` |
| Schools Alt | NCES public data | Free, no key | Static dataset download |
| Crime | spotcrime.com | 1,000/month | `GET /crimes?lat=X&lon=Y&radius=0.5` |
| Crime Alt | crimeometer.com | 500/month | `GET /v1/incidents/raw-data` |
| Tax History | Socrata county datasets | Free | Query by parcel ID |

#### neighborhood-service.ts Implementation
```typescript
export async function fetchNeighborhoodData(lat: number, lng: number): Promise<NeighborhoodData> {
    const [walkScore, schools, crime] = await Promise.all([
        fetchWalkScore(lat, lng),
        fetchNearbySchools(lat, lng),
        fetchCrimeData(lat, lng)
    ]);
    return { walkScore, transitScore, bikeScore, schools, crimeRating, crimeIndex };
}
```

#### UI Components for Data Display
- **Neighborhood Tab:**
  - Three circular progress indicators (Walk/Transit/Bike Score)
  - School list with rating stars and distance
  - Crime heat indicator bar (green/yellow/red)
  - "Nearby Amenities" section (grocery, restaurants, parks from OSM)

- **History Tab:**
  - Tax payment table (year, amount, status with color coding)
  - Sale history timeline (vertical timeline with price changes, % gain/loss)
  - Permit history cards (from existing PermitAgent)

---

### PHASE 3: Professional Skip Tracing (2-3 hours)
**Goal:** Real phone/email data with credit-based monetization

#### Current Implementation Analysis (skip-trace.ts)
The current `revealOwnerContact()` function:
- Checks for RealityMole API key (usually not present)
- Falls back to public record links (Miami-Dade or Google search)
- Returns OSINT deep links (TruePeopleSearch, FastPeopleSearch)
- **Result:** No actual phone/email data returned

#### Files to Modify
| File | Changes |
|------|---------|
| `src/lib/data/skip-trace.ts` | Integrate professional API, add caching, return real data |

#### Files to Create
| File | Purpose |
|------|---------|
| `src/components/property/SkipTracePanel.tsx` | Dedicated skip trace UI |
| `src/lib/credits/credit-service.ts` | Credit balance management |

#### Skip Trace API Options (DECISION REQUIRED)
| Provider | Cost | Data Quality | API Docs |
|----------|------|--------------|----------|
| **BatchSkipTracing** | $0.12-0.25/record | High - phones, emails, relatives | batchskiptracing.com/api |
| **SkipGenie** | $0.12-0.18/record | High - phones, emails, social | skipgenie.com/api |
| **PropertyShark** | $89/mo for 25 | Premium - very detailed | propertyshark.com |
| **REIPro** | Usage-based | Good - investor focused | reipro.io/api |
| **BeenVerified** | $0.50-1.00/record | Very high quality | beenverified.com/api |

**Recommendation:** BatchSkipTracing at ~$0.15/record for balance of cost and quality.

#### Target skip-trace.ts Rewrite
```typescript
export interface SkipTraceResult {
    ownerName: string;
    mailingAddress?: string;
    phones: {
        number: string;
        type: 'MOBILE' | 'LANDLINE' | 'VOIP';
        confidence: number;  // 0-1
        lastVerified?: string;
    }[];
    emails: {
        address: string;
        verified: boolean;
        type: 'PERSONAL' | 'WORK';
    }[];
    relatives?: string[];
    source: 'BATCHSKIP_LIVE' | 'CACHED' | 'OSINT_FALLBACK';
    creditCost: number;
    cached: boolean;
}

export async function revealOwnerContact(
    propertyId: string,
    ownerName: string,
    address: string,
    userId: string
): Promise<SkipTraceResult | null> {
    // 1. Check cache first (Supabase)
    const cached = await checkCache(propertyId);
    if (cached) return { ...cached, cached: true, creditCost: 0 };

    // 2. Check user credit balance
    const balance = await CreditService.getBalance(userId);
    if (balance < 1) throw new Error('INSUFFICIENT_CREDITS');

    // 3. Call BatchSkipTracing API
    const result = await callBatchSkipAPI(ownerName, address);

    // 4. Deduct credit
    await CreditService.deduct(userId, 1, `Skip trace: ${propertyId}`);

    // 5. Cache result
    await cacheResult(propertyId, result);

    return result;
}
```

#### Credit System Implementation (credit-service.ts)
```typescript
export interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    savings?: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
    { id: 'starter', name: 'Starter', credits: 10, price: 9.99 },
    { id: 'pro', name: 'Pro', credits: 50, price: 39.99, savings: '20% off' },
    { id: 'enterprise', name: 'Enterprise', credits: 200, price: 129.99, savings: '35% off' }
];

export class CreditService {
    static async getBalance(userId: string): Promise<number>;
    static async deduct(userId: string, amount: number, reason: string): Promise<boolean>;
    static async purchase(userId: string, packageId: string, paymentMethodId: string): Promise<void>;
    static async getHistory(userId: string): Promise<CreditTransaction[]>;
}
```

#### SkipTracePanel.tsx Component
```tsx
export function SkipTracePanel({ property, onUnlock }: Props) {
    return (
        <div className="skip-trace-panel">
            {/* Always visible */}
            <div className="owner-info">
                <h3>Owner Information</h3>
                <p><strong>Name:</strong> {property.ownerName || 'Unknown'}</p>
                <p><strong>Mailing:</strong> {property.mailingAddress || 'Same as property'}</p>
            </div>

            {/* Locked section */}
            <div className="contact-info locked">
                <div className="blur-overlay">
                    <p>📞 (XXX) XXX-XXXX</p>
                    <p>📧 owner@xxxxx.com</p>
                </div>
                <button onClick={onUnlock} className="unlock-btn">
                    🔓 Unlock Contact Info (1 Credit)
                </button>
                <p className="balance">Your balance: {credits} credits</p>
            </div>

            {/* Free fallback */}
            <div className="osint-links">
                <p>Free alternatives:</p>
                <a href="truepeoplesearch.com/...">TruePeopleSearch</a>
                <a href="fastpeoplesearch.com/...">FastPeopleSearch</a>
            </div>
        </div>
    );
}
```

---

### PHASE 4: Image Enhancement (2 hours)
**Goal:** Multiple property photos, street view, image gallery

#### Files to Create
| File | Purpose |
|------|---------|
| `src/lib/data/image-service.ts` | Multi-source image fetching |

#### Image Sources (Priority Order)
| Priority | Source | Cost | Quality |
|----------|--------|------|---------|
| 1 | Google Street View API | $7/1000 requests | Best |
| 2 | Mapillary Open Data | Free | Good (crowdsourced) |
| 3 | Bing Maps Streetside | Free tier available | Good |
| 4 | ArcGIS World Imagery | Free | Satellite only |

#### image-service.ts Implementation
```typescript
export async function fetchPropertyImages(
    lat: number,
    lng: number,
    address: string
): Promise<PropertyImages> {
    const images: string[] = [];

    // 1. Try Mapillary (free)
    try {
        const mapillaryUrl = await fetchMapillaryImage(lat, lng);
        if (mapillaryUrl) images.push(mapillaryUrl);
    } catch (e) {}

    // 2. Try Google Street View (if key exists)
    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;
        images.push(streetViewUrl);
    }

    // 3. Always add satellite fallback
    const zoom = 18;
    const tileX = Math.floor((lng + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    images.push(`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`);

    return {
        primary: images[0],
        gallery: images,
        hasStreetView: images.length > 1
    };
}
```

#### Mapillary Integration (Free)
```typescript
async function fetchMapillaryImage(lat: number, lng: number): Promise<string | null> {
    // Mapillary v4 API - requires free access token
    const response = await fetch(
        `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&fields=id,thumb_1024_url&bbox=${lng-0.001},${lat-0.001},${lng+0.001},${lat+0.001}&limit=1`
    );
    const data = await response.json();
    return data.data?.[0]?.thumb_1024_url || null;
}
```

---

## 🔑 API KEYS STATUS

| API | Current Status | Required For | How to Get |
|-----|---------------|--------------|------------|
| RentCast | ✅ Has key | AVM valuations | rentcast.io |
| Nominatim | ✅ No key needed | Geocoding | - |
| ArcGIS | ✅ No key needed | Satellite tiles | - |
| Socrata | ✅ No key needed | Chicago/Austin data | - |
| OSM | ✅ No key needed | Nationwide GIS | - |
| **Skip Trace API** | ❌ NEEDED | Real phone/email | batchskiptracing.com |
| **Walk Score** | ❌ Optional | Neighborhood data | walkscore.com/professional |
| **Google Street View** | ❌ Optional | Property photos | console.cloud.google.com |
| **Mapillary** | ❌ Optional (free) | Street imagery | mapillary.com/developer |
| **GreatSchools** | ❌ Optional | School ratings | greatschools.org/api |

---

## 🚀 DEPLOYMENT

### Current Setup
- **Platform:** Cloudflare Pages
- **Framework:** Next.js 14 with next-on-pages
- **Build:** `npm run pages:build`
- **Deploy:** `npx wrangler pages deploy .vercel/output/static --project-name zenith-ai`

### Quick Start Commands
```bash
# Navigate to project
cd "/Users/sameeraziz/Documents/novai-intelligence (2)/zenith-ai"

# Install dependencies
npm install

# Run local dev server
npm run dev

# OR with edge simulation
npm run pages:dev

# Deploy to production
npm run pages:build && npx wrangler pages deploy .vercel/output/static --project-name zenith-ai
```

### Environment Variables (.env.local)
```env
# Currently configured
NEXT_PUBLIC_RENTCAST_KEY=your_key_here
NEXT_PUBLIC_REALITYMOLE_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Add for improvements
NEXT_PUBLIC_BATCHSKIP_KEY=
NEXT_PUBLIC_WALKSCORE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
NEXT_PUBLIC_MAPILLARY_TOKEN=
```

---

## 📋 DECISIONS PENDING

Before executing Phases 3-4, need answers to:

| Question | Options | Recommendation |
|----------|---------|----------------|
| Skip Trace Provider | BatchSkipTracing / SkipGenie / PropertyShark | BatchSkipTracing ($0.15/record) |
| Monthly Budget | How many lookups? | Start with 100/month ($15) |
| Credit System | UI purchases / Admin-only | Admin-only first, add Stripe later |
| Image APIs | Google ($7/1000) / Mapillary (free) | Mapillary free first |
| Incremental Deploy | Phase 1-2 first / All at once | Phase 1-2 first |

---

## ⏱️ TOTAL ESTIMATED TIME

| Phase | Hours | Priority | Dependencies |
|-------|-------|----------|--------------|
| Phase 1: Modal | 2-3 | HIGH | None |
| Phase 2: Enrichment | 3-4 | HIGH | Phase 1 |
| Phase 3: Skip Trace | 2-3 | HIGH (revenue) | API key decision |
| Phase 4: Images | 2 | MEDIUM | Mapillary token |
| **TOTAL** | **9-12 hrs** | | |

---

## 🔖 HOW TO RESUME

**Command:** `/zenith-resume` or say **"Pull up Zenith"**

**Resume options:**
- "Start with Phase 1" - Property Detail Modal
- "Start with Phase 2" - Data Enrichment
- "Start with Phase 3" - Skip Tracing (need API decision first)
- "Start with Phase 4" - Image Enhancement
- "Deploy current state" - Push latest to Cloudflare
