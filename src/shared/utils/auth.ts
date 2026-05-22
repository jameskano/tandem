import { supabase } from '../../services/supabase';

const buildAuthRedirectUrl = (path: string) =>
  `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return '';
};

const normalizeErrorMessage = (error: unknown) =>
  getErrorMessage(error).trim().toLowerCase();

export const isEmailNotConfirmedError = (error: unknown) =>
  normalizeErrorMessage(error).includes('email not confirmed');

export const getAuthErrorMessage = (
  error: unknown,
  t: (key: string) => string,
  fallbackKey: string
) => {
  const normalizedMessage = normalizeErrorMessage(error);

  if (normalizedMessage.includes('email not confirmed')) {
    return t('auth.emailNotConfirmed');
  }

  if (normalizedMessage.includes('invalid login credentials')) {
    return t('auth.invalidCredentials');
  }

  if (
    normalizedMessage.includes('user already registered') ||
    normalizedMessage.includes('already registered') ||
    normalizedMessage.includes('already exists')
  ) {
    return t('auth.emailInUse');
  }

  return t(fallbackKey);
};

export async function signOut() {
  const { error } = await supabase!.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase!.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase!.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase!.auth.signInWithOAuth({
    provider: 'google',
  });
  if (error) throw error;
  return data;
};

export const deleteUserAccount = async (userId: string) => {
  const { data, error } = await supabase!.auth.admin.deleteUser(userId);
  if (error) throw error;
  return data;
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase!.auth.resetPasswordForEmail(email, {
    redirectTo: buildAuthRedirectUrl('/reset-password'),
  });
  if (error) throw error;
  return data;
};

export const resendSignupConfirmation = async (email: string) => {
  const { data, error } = await supabase!.auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw error;
  return data;
};

export const updateEmail = async (newEmail: string) => {
  const { data, error } = await supabase!.auth.updateUser(
    {
      email: newEmail,
    },
    {
      emailRedirectTo: buildAuthRedirectUrl('/settings'),
    }
  );
  if (error) throw error;
  return data;
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase!.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};
