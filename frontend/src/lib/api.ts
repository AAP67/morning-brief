import { UserProfile, GenerateResponse } from './types';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export const api = {
  health: () => request<{ status: string; models: Record<string, string> }>('/health'),

  generateDemo: () =>
    request<GenerateResponse>('/demo/generate', { method: 'POST' }),

  previewBrief: (profile: UserProfile) =>
    request<GenerateResponse>('/briefs/preview', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),

  createProfile: (profile: UserProfile) =>
    request<UserProfile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(profile),
    }),

  getProfile: (uid: string) =>
    request<UserProfile>(`/profiles/${uid}`),

  listBriefs: (uid: string) =>
    request<{ briefs: any[]; count: number }>(`/briefs/${uid}`),
};
