import { ProductionTarotReading, SavedTarotReading } from './types';

const STORAGE_KEY = 'kaalika_tarot_readings_v1';
const MAX_SAVED_READINGS = 50;

/**
 * In-memory fallback if localStorage is disabled or running on server.
 */
let memoryHistory: SavedTarotReading[] = [];

export function getSavedReadings(): SavedTarotReading[] {
  if (typeof window === 'undefined') {
    return memoryHistory;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return memoryHistory;
  }
}

export function saveTarotReading(reading: ProductionTarotReading): SavedTarotReading {
  const savedItem: SavedTarotReading = {
    readingId: reading.readingId,
    createdAt: reading.timestamp,
    question: reading.question,
    topic: reading.topic,
    topicLabel: reading.topicLabel,
    spreadName: reading.spreadName,
    cardSummaries: reading.cards.map(c => ({
      name: c.name,
      orientation: c.orientation,
      positionName: c.positionName,
      imageUrl: c.imageUrl,
      keywords: c.keywords,
    })),
    reading,
  };

  const existing = getSavedReadings();
  // Filter out duplicate if already saved
  const filtered = existing.filter(r => r.readingId !== reading.readingId);
  const updated = [savedItem, ...filtered].slice(0, MAX_SAVED_READINGS);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Quota exceeded or storage restricted
    }
  }

  memoryHistory = updated;
  return savedItem;
}

export function deleteSavedReading(readingId: string): SavedTarotReading[] {
  const existing = getSavedReadings();
  const updated = existing.filter(r => r.readingId !== readingId);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignored
    }
  }

  memoryHistory = updated;
  return updated;
}

export function clearAllSavedReadings(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  }
  memoryHistory = [];
}
