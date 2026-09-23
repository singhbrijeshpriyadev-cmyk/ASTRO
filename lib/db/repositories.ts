import { db } from '@/database/db';
import crypto from 'crypto';

export interface UserEntity {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  salt: string;
  role: string;
  created_at: string;
}

export interface BirthProfileEntity {
  id: string;
  user_id: string;
  name: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  birth_second: number;
  latitude: number;
  longitude: number;
  timezone_offset: number;
  location_name: string;
  ayanamsha_system: string;
  notes?: string;
  created_at: string;
}

export interface KundaliRecordEntity {
  id: string;
  user_id: string;
  profile_id?: string;
  chart_name: string;
  julian_day: number;
  ascendant_sidereal: number;
  kundali_payload: any;
  created_at: string;
}

export interface TarotReadingEntity {
  id: string;
  user_id: string;
  spread_name: string;
  question?: string;
  cards_payload: any;
  synthesis_payload?: any;
  created_at: string;
}

// Global In-Memory Fallback Cache (resilient when DATABASE_URL is not yet provisioned)
const memoryUsers = new Map<string, UserEntity>();
const memoryProfiles = new Map<string, BirthProfileEntity[]>();
const memoryKundalis = new Map<string, KundaliRecordEntity[]>();
const memoryTarot = new Map<string, TarotReadingEntity[]>();

export const UserRepository = {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalizedEmail = email.toLowerCase().trim();
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<UserEntity>(
          'SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1',
          [normalizedEmail]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[Kaalika UserRepository] Falling back to memory store:', err);
      }
    }
    return memoryUsers.get(normalizedEmail) || null;
  },

  async findById(id: string): Promise<UserEntity | null> {
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<UserEntity>(
          'SELECT * FROM users WHERE id = $1 LIMIT 1',
          [id]
        );
        return res.rows[0] || null;
      } catch (err) {
        console.warn('[Kaalika UserRepository] Falling back to memory store:', err);
      }
    }
    for (const u of Array.from(memoryUsers.values())) {
      if (u.id === id) return u;
    }
    return null;
  },

  async create(user: Omit<UserEntity, 'id' | 'created_at'>): Promise<UserEntity> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const entity: UserEntity = {
      id,
      email: user.email.toLowerCase().trim(),
      full_name: user.full_name,
      password_hash: user.password_hash,
      salt: user.salt,
      role: user.role || 'practitioner',
      created_at,
    };

    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<UserEntity>(
          `INSERT INTO users (id, email, full_name, password_hash, salt, role, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [id, entity.email, entity.full_name, entity.password_hash, entity.salt, entity.role, created_at]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[Kaalika UserRepository] Error inserting into cloud DB, using memory:', err);
      }
    }

    memoryUsers.set(entity.email, entity);
    return entity;
  },
};

export const ProfileRepository = {
  async listByUser(userId: string): Promise<BirthProfileEntity[]> {
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<BirthProfileEntity>(
          'SELECT * FROM birth_profiles WHERE user_id = $1 ORDER BY created_at DESC',
          [userId]
        );
        return res.rows;
      } catch (err) {
        console.warn('[Kaalika ProfileRepository] Falling back to memory store:', err);
      }
    }
    return memoryProfiles.get(userId) || [];
  },

  async create(profile: Omit<BirthProfileEntity, 'id' | 'created_at'>): Promise<BirthProfileEntity> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const entity: BirthProfileEntity = {
      id,
      ...profile,
      created_at,
    };

    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<BirthProfileEntity>(
          `INSERT INTO birth_profiles 
           (id, user_id, name, birth_year, birth_month, birth_day, birth_hour, birth_minute, birth_second, latitude, longitude, timezone_offset, location_name, ayanamsha_system, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           RETURNING *`,
          [
            id,
            entity.user_id,
            entity.name,
            entity.birth_year,
            entity.birth_month,
            entity.birth_day,
            entity.birth_hour,
            entity.birth_minute,
            entity.birth_second,
            entity.latitude,
            entity.longitude,
            entity.timezone_offset,
            entity.location_name,
            entity.ayanamsha_system,
            entity.notes || null,
            created_at,
          ]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[Kaalika ProfileRepository] Error inserting into cloud DB, using memory:', err);
      }
    }

    const current = memoryProfiles.get(profile.user_id) || [];
    memoryProfiles.set(profile.user_id, [entity, ...current]);
    return entity;
  },

  async delete(id: string, userId: string): Promise<boolean> {
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        await db.query('DELETE FROM birth_profiles WHERE id = $1 AND user_id = $2', [id, userId]);
        return true;
      } catch (err) {
        console.warn('[Kaalika ProfileRepository] Error deleting from cloud DB:', err);
      }
    }
    const current = memoryProfiles.get(userId) || [];
    memoryProfiles.set(
      userId,
      current.filter((p) => p.id !== id)
    );
    return true;
  },
};

export const KundaliRepository = {
  async listByUser(userId: string): Promise<KundaliRecordEntity[]> {
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<KundaliRecordEntity>(
          'SELECT * FROM kundali_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
          [userId]
        );
        return res.rows;
      } catch (err) {
        console.warn('[Kaalika KundaliRepository] Falling back to memory store:', err);
      }
    }
    return memoryKundalis.get(userId) || [];
  },

  async save(record: Omit<KundaliRecordEntity, 'id' | 'created_at'>): Promise<KundaliRecordEntity> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const entity: KundaliRecordEntity = {
      id,
      ...record,
      created_at,
    };

    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<KundaliRecordEntity>(
          `INSERT INTO kundali_records (id, user_id, profile_id, chart_name, julian_day, ascendant_sidereal, kundali_payload, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING *`,
          [
            id,
            entity.user_id,
            entity.profile_id || null,
            entity.chart_name,
            entity.julian_day,
            entity.ascendant_sidereal,
            JSON.stringify(entity.kundali_payload),
            created_at,
          ]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[Kaalika KundaliRepository] Error inserting into cloud DB, using memory:', err);
      }
    }

    const current = memoryKundalis.get(record.user_id) || [];
    memoryKundalis.set(record.user_id, [entity, ...current]);
    return entity;
  },
};

export const TarotRepository = {
  async listByUser(userId: string): Promise<TarotReadingEntity[]> {
    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<TarotReadingEntity>(
          'SELECT * FROM tarot_readings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
          [userId]
        );
        return res.rows;
      } catch (err) {
        console.warn('[Kaalika TarotRepository] Falling back to memory store:', err);
      }
    }
    return memoryTarot.get(userId) || [];
  },

  async save(reading: Omit<TarotReadingEntity, 'id' | 'created_at'>): Promise<TarotReadingEntity> {
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const entity: TarotReadingEntity = {
      id,
      ...reading,
      created_at,
    };

    if (db.isCloudConnected()) {
      try {
        await db.ensureSchema();
        const res = await db.query<TarotReadingEntity>(
          `INSERT INTO tarot_readings (id, user_id, spread_name, question, cards_payload, synthesis_payload, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING *`,
          [
            id,
            entity.user_id,
            entity.spread_name,
            entity.question || null,
            JSON.stringify(entity.cards_payload),
            entity.synthesis_payload ? JSON.stringify(entity.synthesis_payload) : null,
            created_at,
          ]
        );
        return res.rows[0];
      } catch (err) {
        console.warn('[Kaalika TarotRepository] Error inserting into cloud DB, using memory:', err);
      }
    }

    const current = memoryTarot.get(reading.user_id) || [];
    memoryTarot.set(reading.user_id, [entity, ...current]);
    return entity;
  },
};
