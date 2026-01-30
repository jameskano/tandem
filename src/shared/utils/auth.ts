import { supabase } from '../../services/supabase';

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
    redirectTo: `${window.location.origin}/reset-password`,
  });
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
