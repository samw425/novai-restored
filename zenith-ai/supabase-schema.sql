-- ZENITH: Off-Market Engine Schema
-- Extension for Geospatial Queries
create extension if not exists postgis;

-- 1. Properties Table (The Master Parcel Record)
create table if not exists properties (
    id uuid default gen_random_uuid() primary key,
    parcel_id text unique not null, -- County Parcel ID (R123456)
    address text not null,
    city text default 'Austin',
    state text default 'TX',
    zip_text text,
    
    -- Geospatial Point
    location geography(point, 4326),
    
    -- Physical Attributes
    property_type text, -- Single Family, Multi-Family, etc.
    year_built integer,
    sqft integer,
    lot_size_sqft float,
    
    -- Owner Intel
    owner_name text,
    owner_address text,
    is_absentee boolean default false,
    last_sale_date date,
    
    -- Financials
    assessed_value numeric(12,2),
    estimated_equity numeric(12,2),
    tax_delinquent boolean default false,
    pre_foreclosure boolean default false,
    
    -- Motivation Engine
    motivation_score integer default 0, -- 0-100 calculated by backend
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Index for fast map bounds queries
create index if not exists properties_location_idx on properties using gist(location);

-- 2. Watchlist (User Saves)
create table if not exists watchlist (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id),
    property_id uuid references properties(id),
    created_at timestamp with time zone default now(),
    unique(user_id, property_id)
);

-- 3. Ingestion Logs
create table if not exists ingestion_logs (
    id uuid default gen_random_uuid() primary key,
    source text not null, -- e.g., 'TCAD_DAILY'
    status text,
    rows_processed integer,
    error_message text,
    created_at timestamp with time zone default now()
);

-- Function for Geospatial Viewport Queries
create or replace function get_properties_in_viewport(
    min_lng float, min_lat float, 
    max_lng float, max_lat float
)
returns table (
    id uuid,
    parcel_id text,
    address text,
    property_type text,
    assessed_value numeric,
    estimated_equity numeric,
    is_absentee boolean,
    tax_delinquent boolean,
    pre_foreclosure boolean,
    motivation_score integer,
    lat float,
    lng float
) language plpgsql as $$
begin
    return query
    select 
        p.id, p.parcel_id, p.address, p.property_type, 
        p.assessed_value, p.estimated_equity, p.is_absentee, 
        p.tax_delinquent, p.pre_foreclosure, p.motivation_score,
        st_y(p.location::geometry) as lat,
        st_x(p.location::geometry) as lng
    from properties p
    where p.location && st_makeenvelope(min_lng, min_lat, max_lng, max_lat, 4326);
end;
$$;
