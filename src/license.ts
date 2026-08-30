const SLUG = 'audio-wrapper-batch';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 24 * 60 * 60 * 1000;
const VERIFY_TIMEOUT_MS = 4_000;
let demoScope = false;
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

function scopedKey(key: string): string {
  return demoScope ? `demo:${key}` : key;
}

/** Keep a demo from ever reading or changing a visitor's real license state. */
export function setLicenseStorageScope(demo: boolean): void {
  demoScope = demo;
}

function cachedVerdict(): CachedVerdict | null {
  try {
    const raw = localStorage.getItem(scopedKey(VERDICT_KEY));
    return raw ? JSON.parse(raw) as CachedVerdict : null;
  } catch {
    return null;
  }
}

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return;
  storeLicense(token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function licenseState(): LicenseState {
  const token = localStorage.getItem(scopedKey(LICENSE_KEY));
  const verdict = cachedVerdict();
  if (!token) return { token: null, unlocked: false };
  // A token is only evidence of a purchase after the billing service has
  // verified it.  Offline use may retain a *cached positive* verdict, but an
  // arbitrary pasted/returned token must never unlock Studio before then.
  if (verdict?.valid) return { token, unlocked: true };
  return { token, unlocked: false, reason: verdict?.reason ?? 'unverified' };
}

export function storeLicense(token: string): void {
  const normalized = token.trim();
  const licenseKey = scopedKey(LICENSE_KEY);
  const tokenChanged = localStorage.getItem(licenseKey) !== normalized;
  localStorage.setItem(licenseKey, normalized);
  // Re-entering the same token must retain its fresh verdict. This keeps the
  // visible Verify action inside the documented one-check-per-day policy.
  if (tokenChanged) localStorage.removeItem(scopedKey(VERDICT_KEY));
}

export async function verifyLicense(force = false): Promise<LicenseState> {
  const token = localStorage.getItem(scopedKey(LICENSE_KEY));
  if (!token) return { token: null, unlocked: false };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) {
    return { token, unlocked: cached.valid, reason: cached.reason };
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const response = await fetch(`${billingBase}/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Verification service unavailable');
    const result = await response.json() as { valid: boolean; reason?: string };
    const verdict = { valid: result.valid, reason: result.reason, checkedAt: Date.now() };
    localStorage.setItem(scopedKey(VERDICT_KEY), JSON.stringify(verdict));
    return { token, unlocked: result.valid, reason: result.reason };
  } catch {
    return licenseState();
  } finally {
    clearTimeout(timeout);
  }
}
