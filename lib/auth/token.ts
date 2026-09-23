import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { config } from '@/lib/config';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

export function signSessionToken(user: { id: string; email: string; name: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadData: AuthSession = {
    userId: user.id,
    email: user.email,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days session
  };
  const payload = Buffer.from(JSON.stringify(payloadData)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.authSecret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): AuthSession | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', config.authSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const session: AuthSession = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (session.exp && session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch (err) {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): AuthSession | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = verifySessionToken(token);
    if (session) return session;
  }

  // 2. Check kaalika_session cookie
  const cookie = req.cookies.get('kaalika_session');
  if (cookie?.value) {
    const session = verifySessionToken(cookie.value);
    if (session) return session;
  }

  return null;
}
