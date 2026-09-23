import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/token';
import { KundaliRepository } from '@/lib/db/repositories';
import { z } from 'zod';

const chartSaveSchema = z.object({
  chartName: z.string().min(1),
  profileId: z.string().optional(),
  julianDay: z.number(),
  ascendantSidereal: z.number(),
  kundaliPayload: z.any(),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const charts = await KundaliRepository.listByUser(session.userId);
    return NextResponse.json({ charts }, { status: 200 });
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
    const parsed = chartSaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid chart payload' }, { status: 400 });
    }

    const c = parsed.data;
    const record = await KundaliRepository.save({
      user_id: session.userId,
      profile_id: c.profileId,
      chart_name: c.chartName,
      julian_day: c.julianDay,
      ascendant_sidereal: c.ascendantSidereal,
      kundali_payload: c.kundaliPayload,
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
