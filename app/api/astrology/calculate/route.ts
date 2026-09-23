import { NextRequest, NextResponse } from 'next/server';
import { calculationService } from '@/server/calculation-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await calculationService.computeKundali(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, engine: result.engineVersion },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
