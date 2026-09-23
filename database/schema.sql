-- Kaalika Production PostgreSQL Relational Schema
-- Supports high-precision birth data storage, cached ephemeris vectors, client records, and tarot sanctuary readings

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users / Practitioners Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'practitioner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Client Birth Profiles (Multi-device synced)
CREATE TABLE IF NOT EXISTS birth_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    birth_year INT NOT NULL,
    birth_month INT NOT NULL,
    birth_day INT NOT NULL,
    birth_hour INT NOT NULL,
    birth_minute INT NOT NULL,
    birth_second INT DEFAULT 0,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    timezone_offset DECIMAL(4, 2) NOT NULL,
    location_name VARCHAR(255),
    ayanamsha_system VARCHAR(50) DEFAULT 'Lahiri',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ephemeris Cache (Avoids redundant orbital mechanics recalculations)
CREATE TABLE IF NOT EXISTS ephemeris_cache (
    epoch_timestamp BIGINT PRIMARY KEY,
    julian_day DOUBLE PRECISION NOT NULL,
    ayanamsha_lahiri DOUBLE PRECISION NOT NULL,
    planetary_vectors JSONB NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Kundali Calculation Snapshots
CREATE TABLE IF NOT EXISTS kundali_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES birth_profiles(id) ON DELETE SET NULL,
    chart_name VARCHAR(150),
    julian_day DOUBLE PRECISION NOT NULL,
    ascendant_sidereal DOUBLE PRECISION NOT NULL,
    kundali_payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tarot Sanctuary Readings (Multi-device synced)
CREATE TABLE IF NOT EXISTS tarot_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    spread_name VARCHAR(100) NOT NULL,
    question TEXT,
    cards_payload JSONB NOT NULL,
    synthesis_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning-fast multi-device query execution
CREATE INDEX IF NOT EXISTS idx_birth_profiles_user ON birth_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kundali_records_user ON kundali_records(user_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_user ON tarot_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_ephemeris_cache_jd ON ephemeris_cache(julian_day);
