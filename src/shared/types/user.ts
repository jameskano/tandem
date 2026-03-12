export type UserSettings = {
  user_id: string;
  currency: Currency;
  locale: string;
  use_location: boolean;
  onboarding_completed: boolean;
  push_enabled: boolean;
  reminder_enabled: boolean;
};

export type Currency = 'EUR' | 'USD';
