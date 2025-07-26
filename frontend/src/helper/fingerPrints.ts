'use client';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null;

export async function getFingerprint() {
  if (typeof window === 'undefined') return null;
  const cached = localStorage.getItem('fingerprint');
  if (cached) return cached;
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }

  const fp = await fpPromise;
  const result = await fp.get();
  localStorage.setItem('fingerprint', result.visitorId);
  return result.visitorId;
}
