export type UserSettings = {
  user_id: string;
  currency: Currency;
  locale: string;
  country: string | null;
  city: string | null;
  onboarding_completed: boolean;
  push_enabled: boolean;
  reminder_enabled: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Currency = 'EUR' | 'USD';
