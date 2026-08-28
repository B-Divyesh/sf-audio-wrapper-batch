import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

describe('license verification', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    vi.resetModules();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('does not unlock an unverified pasted token when verification is unavailable', async () => {
    const license = await import('../src/license');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')));
    license.storeLicense('arbitrary-unverified-token');

    expect(license.licenseState()).toEqual({ token: 'arbitrary-unverified-token', unlocked: false, reason: 'unverified' });
    await expect(license.verifyLicense(true)).resolves.toEqual({ token: 'arbitrary-unverified-token', unlocked: false, reason: 'unverified' });
  });

  it('retains only a previously verified Studio license during an outage', async () => {
    const license = await import('../src/license');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')));
    license.storeLicense('previously-verified-token');
    storage.setItem('sb_license_verdict:audio-wrapper-batch', JSON.stringify({ valid: true, checkedAt: Date.now(), reason: 'ok' }));

    await expect(license.verifyLicense(true)).resolves.toEqual({ token: 'previously-verified-token', unlocked: true });
  });
});
