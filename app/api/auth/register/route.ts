import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/db/repositories';
import { hashPassword, signSessionToken } from '@/lib/auth/token';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);
    const user = await UserRepository.create({
      email,
      full_name: name,
      password_hash: hash,
      salt,
      role: 'practitioner',
    });

    const token = signSessionToken({
      id: user.id,
      email: user.email,
      name: user.full_name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
      token,
    });

    response.cookies.set('kaalika_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
