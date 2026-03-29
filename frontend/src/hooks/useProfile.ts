import { useState, useEffect } from 'react';
import { UserProfile } from '../lib/types';

const STORAGE_KEY = 'morning-brief-profile';

const DEFAULT_PROFILE: UserProfile = {
  uid: 'demo',
  name: 'Demo User',
  role: 'Startup Founder',
  industry: 'AI/ML',
  topics: ['LLMs', 'fundraising', 'product-market fit', 'AI agents'],
  companies_tracked: ['OpenAI', 'Anthropic', 'Mistral'],
  sources_enabled: ['news', 'markets', 'industry'],
  tone: 'executive',
  length: 'medium',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  delivery_channel: 'app',
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [hasCustomProfile, setHasCustomProfile] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const saveProfile = (updated: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProfile(updated);
    setHasCustomProfile(true);
  };

  const clearProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
    setHasCustomProfile(false);
  };

  return { profile, hasCustomProfile, saveProfile, clearProfile };
}