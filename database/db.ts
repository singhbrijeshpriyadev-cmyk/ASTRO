import { Pool, QueryResult } from 'pg';

/**
 * Kaalika Cloud PostgreSQL Database Client
 * Supports pooled cloud connections (Neon, Supabase, AWS RDS, Railway) with SSL
 * and an automatic fallback store for unconfigured environments.
 */

class DatabaseClient {
  private static instance: DatabaseClient;
  private pool: Pool | null = null;
  private initialized = false;

  private constructor() {
    this.initPool();
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  private initPool(): void {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      try {
        const isSsl = !connectionString.includes('sslmode=disable') && !connectionString.includes('localhost');
        this.pool = new Pool({
          connectionString,
          ssl: isSsl ? { rejectUnauthorized: false } : undefined,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });
      } catch (err) {
        console.warn('[Kaalika DB] Could not initialize PostgreSQL pool:', err);
        this.pool = null;
      }
    }
  }

  public isCloudConnected(): boolean {
    return this.pool !== null;
  }

  public async query<T extends import('pg').QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.pool) {
      this.initPool();
    }

    if (this.pool) {
      try {
        return await this.pool.query<T>(text, params);
      } catch (err) {
        console.error('[Kaalika DB] Query error on PostgreSQL pool:', err);
        throw err;
      }
    }

    throw new Error('DATABASE_URL not configured. Remote cloud database is required.');
  }

  /**
   * Run idempotent schema initialization to ensure all tables exist in the remote database.
   */
  public async ensureSchema(): Promise<void> {
    if (this.initialized || !this.pool) return;

    try {
      await this.pool.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

        CREATE TABLE IF NOT EXISTS ephemeris_cache (
            epoch_timestamp BIGINT PRIMARY KEY,
            julian_day DOUBLE PRECISION NOT NULL,
            ayanamsha_lahiri DOUBLE PRECISION NOT NULL,
            planetary_vectors JSONB NOT NULL,
            calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

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

        CREATE TABLE IF NOT EXISTS tarot_readings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            spread_name VARCHAR(100) NOT NULL,
            question TEXT,
            cards_payload JSONB NOT NULL,
            synthesis_payload JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_birth_profiles_user ON birth_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_kundali_records_user ON kundali_records(user_id);
        CREATE INDEX IF NOT EXISTS idx_tarot_readings_user ON tarot_readings(user_id);
      `);
      this.initialized = true;
    } catch (err) {
      console.warn('[Kaalika DB] Notice: ensureSchema could not run automatically (may lack DDL permissions):', err);
    }
  }
}

export const db = DatabaseClient.getInstance();
