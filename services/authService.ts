import { supabase } from '../supabase/client';
import type { Session, Provider } from '@supabase/supabase-js';

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signupWithEmail: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    // Supabase sends a confirmation email by default.
    // The error for an existing user is helpful and will be displayed in the UI.
    if (error) throw error;
    return data;
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  getSession: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
  },
  
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
      return subscription;
  },

  sendPasswordResetEmail: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, // Redirect back to the app's base URL
    });
    if (error) throw error;
    return data;
  },

  updateUserPassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  loginWithProvider: async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
        // This flag prevents the Supabase client from automatically redirecting the browser.
        // We need this so we can control the redirect and ensure it happens in the top-level window, not in an iframe.
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      throw error;
    }

    if (data.url) {
      // Manually redirect the top-level window to break out of the iframe.
      // This is the key to fixing the "refused to connect" error with Google OAuth.
      // We use window.open with target '_top' as a more robust way to navigate
      // the top-level window, which is less likely to be blocked by sandboxing policies
      // than a direct assignment to window.top.location.href.
      window.open(data.url, '_top');
    } else {
      throw new Error('Could not get OAuth URL from Supabase.');
    }
  },
};
