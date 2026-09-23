import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/token';
import { TarotRepository } from '@/lib/db/repositories';
import { z } from 'zod';

const tarotSaveSchema = z.object({
  spreadName: z.string().min(1),
  question: z.string().optional(),
  cardsPayload: z.any(),
  synthesisPayload: z.any().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const readings = await TarotRepository.listByUser(session.userId);
    return NextResponse.json({ readings }, { status: 200 });
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
    const parsed = tarotSaveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid tarot payload' }, { status: 400 });
    }

    const t = parsed.data;
    const reading = await TarotRepository.save({
      user_id: session.userId,
      spread_name: t.spreadName,
      question: t.question,
      cards_payload: t.cardsPayload,
      synthesis_payload: t.synthesisPayload,
    });

    return NextResponse.json({ success: true, reading }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
