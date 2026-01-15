import { supabase } from "../supabase/client";
import { calculateMotivationScore } from "./motivation-engine";

/**
 * INGESTOR ENGINE (Alpha-1)
 * 
 * Logic to process Travis County tax/appraisal records.
 * Currently supports manual CSV processing + API structure.
 */

export interface TCADRecord {
    parcel_id: string;
    address: string;
    owner_name: string;
    property_type: "SFR" | "MF_2" | "MF_3" | "MF_4";
    assessed_value: number;
    estimated_equity: number;
    last_sale_date?: string;
    is_tax_delinquent: boolean;
    is_absentee: boolean;
    lat: number;
    lng: number;
}

export async function ingestTCADProperties(records: TCADRecord[]) {
    console.log(`ZENITH: Processing ${records.length} records...`);

    const propertiesToUpsert = records.map(record => {
        // Calculate Motivation Score on the fly
        const score = calculateMotivationScore({
            isTaxDelinquent: record.is_tax_delinquent,
            isPreForeclosure: false, // Default for now
            isAbsenteeOwner: record.is_absentee,
            yearsOwned: record.last_sale_date ? calculateYearsOwned(record.last_sale_date) : 5,
            equityPercent: 40 // Mock equity for Alpha-1
        });

        return {
            parcel_id: record.parcel_id,
            address: record.address,
            owner_name: record.owner_name,
            property_type: record.property_type,
            assessed_value: record.assessed_value,
            estimated_equity: record.estimated_equity,
            is_absentee: record.is_absentee,
            tax_delinquent: record.is_tax_delinquent,
            motivation_score: score,
            location: `POINT(${record.lng} ${record.lat})`,
            updated_at: new Date().toISOString()
        };
    });

    const { error } = await supabase
        .from('properties')
        .upsert(propertiesToUpsert, { onConflict: 'parcel_id' });

    if (error) {
        console.error("ZENITH Ingestion Error:", error);
        return { success: false, error };
    }

    return { success: true, count: records.length };
}

function calculateYearsOwned(saleDate: string): number {
    const sale = new Date(saleDate);
    const now = new Date();
    return now.getFullYear() - sale.getFullYear();
}
