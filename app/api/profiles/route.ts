import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/token';
import { ProfileRepository } from '@/lib/db/repositories';
import { z } from 'zod';

const birthProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthYear: z.number().int().min(1800).max(2100),
  birthMonth: z.number().int().min(1).max(12),
  birthDay: z.number().int().min(1).max(31),
  birthHour: z.number().int().min(0).max(23),
  birthMinute: z.number().int().min(0).max(59),
  birthSecond: z.number().int().min(0).max(59).optional().default(0),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezoneOffset: z.number().min(-12).max(14),
  locationName: z.string().min(1),
  ayanamshaSystem: z.string().default('Lahiri'),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profiles = await ProfileRepository.listByUser(session.userId);
    return NextResponse.json({ profiles }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = birthProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid profile data' }, { status: 400 });
    }

    const p = parsed.data;
    const created = await ProfileRepository.create({
      user_id: session.userId,
      name: p.name,
      birth_year: p.birthYear,
      birth_month: p.birthMonth,
      birth_day: p.birthDay,
      birth_hour: p.birthHour,
      birth_minute: p.birthMinute,
      birth_second: p.birthSecond,
      latitude: p.latitude,
      longitude: p.longitude,
      timezone_offset: p.timezoneOffset,
      location_name: p.locationName,
      ayanamsha_system: p.ayanamshaSystem,
      notes: p.notes,
    });

    return NextResponse.json({ success: true, profile: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    await ProfileRepository.delete(id, session.userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
