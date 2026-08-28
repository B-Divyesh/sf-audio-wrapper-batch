const SLUG = 'audio-wrapper-batch';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 24 * 60 * 60 * 1000;
export const billingBase = (import.meta.env.VITE_BILLING_BASE as string | undefined) ?? 'https://pilot-api.sociobot.in';
export const checkoutUrl = `${billingBase}/api/v1/products/${SLUG}/checkout`;

interface CachedVerdict {
  valid: boolean;
  checkedAt: number;
  reason?: string;
}

export interface LicenseState {
  token: string | null;
  unlocked: boolean;
  reason?: string;
}

function cachedVerdict(): CachedVerdict | null {
  try {
    const raw = localStorage.getItem(VERDICT_KEY);
    return raw ? JSON.parse(raw) as CachedVerdict : null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function licenseState(): LicenseState {
  const token = localStorage.getItem(LICENSE_KEY);
  const verdict = cachedVerdict();
  if (!token) return { token: null, unlocked: false };
  if (verdict && !verdict.valid) return { token, unlocked: false, reason: verdict.reason };
  return { token, unlocked: true };
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { token: null, unlocked: false };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return { token, unlocked: cached.valid, reason: cached.reason };
  }
  try {
    const response = await fetch(`${billingBase}/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean; reason?: string };
    const verdict = { valid: result.valid, reason: result.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return { token, unlocked: result.valid, reason: result.reason };
  } catch {
    return licenseState();
  }
}
