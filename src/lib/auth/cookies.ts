import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'auth-token';
const REFRESH_COOKIE_NAME = 'refresh-token';
const CSRF_COOKIE_NAME = 'csrf-token';

const COOKIE_MAX_AGE = 15 * 60;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
const CSRF_COOKIE_MAX_AGE = 24 * 60 * 60;

function getSecureCookieSettings(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge,
    path: '/',
  };
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(
    AUTH_COOKIE_NAME,
    token,
    getSecureCookieSettings(COOKIE_MAX_AGE)
  );
}

export function setRefreshCookie(
  response: NextResponse,
  refreshToken: string
): void {
  response.cookies.set(
    REFRESH_COOKIE_NAME,
    refreshToken,
    getSecureCookieSettings(REFRESH_COOKIE_MAX_AGE)
  );
}

export function setCSRFCookie(response: NextResponse, csrfToken: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    ...getSecureCookieSettings(CSRF_COOKIE_MAX_AGE),
    httpOnly: false,
  });
}

export function setAuthCookies(
  response: NextResponse,
  token: string,
  refreshToken: string,
  csrfToken?: string
): void {
  setAuthCookie(response, token);
  setRefreshCookie(response, refreshToken);

  if (csrfToken) {
    setCSRFCookie(response, csrfToken);
  }
}

export function getAuthCookie(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
  } catch (error) {
    return null;
  }
}

export function getRefreshCookie(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
  } catch (error) {
    return null;
  }
}

export function getCSRFCookie(): string | null {
  try {
    const cookieStore = cookies();
    return cookieStore.get(CSRF_COOKIE_NAME)?.value || null;
  } catch (error) {
    return null;
  }
}

export function getAuthCookieFromRequest(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value || null;
}

export function getRefreshCookieFromRequest(
  request: NextRequest
): string | null {
  return request.cookies.get(REFRESH_COOKIE_NAME)?.value || null;
}

export function getCSRFCookieFromRequest(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null;
}

export function clearAuthCookies(response: NextResponse): void {
  const cookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set(AUTH_COOKIE_NAME, '', cookieSettings);
  response.cookies.set(REFRESH_COOKIE_NAME, '', cookieSettings);
  response.cookies.set(CSRF_COOKIE_NAME, '', {
    ...cookieSettings,
    httpOnly: false,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    ...getSecureCookieSettings(0),
    maxAge: 0,
  });
}

export function clearRefreshCookie(response: NextResponse): void {
  response.cookies.set(REFRESH_COOKIE_NAME, '', {
    ...getSecureCookieSettings(0),
    maxAge: 0,
  });
}

export function validateCookieSettings(): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // if (process.env.NODE_ENV === 'production') {
  //   if (!process.env.HTTPS) {
  //     issues.push('Secure cookies require HTTPS in production')
  //   }
  // }

  // if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
  //   issues.push('JWT_SECRET environment variable must be set to a secure value')
  // }

  // if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'your-refresh-secret-key') {
  //   issues.push('JWT_REFRESH_SECRET environment variable must be set to a secure value')
  // }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  if (typeof require !== 'undefined') {
    try {
      const crypto = require('crypto');
      return crypto.randomBytes(32).toString('hex');
    } catch (error) {}
  }

  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).substring(2);
  const random2 = Math.random().toString(36).substring(2);
  const random3 = Math.random().toString(36).substring(2);

  return `${timestamp}-${random1}-${random2}-${random3}`;
}

export function verifyCSRFToken(
  tokenFromHeader: string | null,
  tokenFromCookie: string | null
): boolean {
  if (!tokenFromHeader || !tokenFromCookie) {
    return false;
  }

  return tokenFromHeader === tokenFromCookie;
}

export function getCookieNames() {
  return {
    AUTH_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    CSRF_COOKIE_NAME,
  };
}
