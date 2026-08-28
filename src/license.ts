const SLUG = 'audio-wrapper-batch';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 24 * 60 * 60 * 1000;
/** Production is the safe default; a staging build must explicitly use pilot. */
export const billingBase = (import.meta.env.VITE_BILLING_BASE as string | undefined) ?? 'https://api.sociobot.in';
export const checkoutUrl = `${billingBase}/api/v1/products/${SLUG}/checkout`;
/** Keep an unregistered checkout from becoming a dead public purchase link. */
export const studioCheckoutAvailable = import.meta.env.VITE_STUDIO_CHECKOUT_ENABLED === 'true';

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
  // A token is only evidence of a purchase after the billing service has
  // verified it.  Offline use may retain a *cached positive* verdict, but an
  // arbitrary pasted/returned token must never unlock Studio before then.
  if (verdict?.valid) return { token, unlocked: true };
  return { token, unlocked: false, reason: verdict?.reason ?? 'unverified' };
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
