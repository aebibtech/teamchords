import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const getSessionFromStorage = () => {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};

// eslint-disable-next-line no-unused-vars
export const useAuthStore = create((set, get) => ({
  session: getSessionFromStorage(),
  setSession: (session) => {
    localStorage.setItem('session', JSON.stringify(session));
    set({ session });
  },
  signUpNewUser: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
    });
    if (error) return { success: false, error };
    return { success: true, data };
  },
  signInUser: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },
  signInWithProvider: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local'});
    sessionStorage.clear();
    localStorage.clear();
    if (error) {
      console.error('Error signing out:', error);
    }
    set({ session: null });
  },
}));

// Listen to auth state changes
document.addEventListener('DOMContentLoaded', () => {
  supabase.auth.onAuthStateChange((_event, session) => {
    localStorage.setItem('session', JSON.stringify(session));
    useAuthStore.getState().setSession(session);
  });
});
