import { N8N_LOGIN_WEBHOOK_URL, N8N_SIGNUP_WEBHOOK_URL } from '../config';

export const authService = {
  /**
   * Sends user credentials to an n8n webhook, navigating ngrok and CORS issues.
   * This function is carefully crafted to solve a browser/webhook Catch-22:
   * 1. ngrok's free tier requires a custom 'ngrok-skip-browser-warning' header.
   * 2. Adding a custom header triggers a browser CORS preflight (OPTIONS) request.
   * 3. The n8n webhook cannot handle the OPTIONS preflight, causing a 500 error.
   *
   * The solution is to use `mode: 'no-cors'`, which sends the POST request
   * with our custom header but prevents the browser from sending the problematic
   * OPTIONS preflight. We also let the browser handle the Content-Type for
   * maximum compatibility.
   */
  loginWithEmail: async (email: string, password: string): Promise<void> => {
    if (N8N_LOGIN_WEBHOOK_URL.includes('PASTE_YOUR_NEW_N8N_WEBHOOK_URL_HERE') || N8N_LOGIN_WEBHOOK_URL.includes('your-webhook-id')) {
      throw new Error('Please update the N8N_LOGIN_WEBHOOK_URL in config.ts with your actual ngrok webhook URL.');
    }
    
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    await fetch(N8N_LOGIN_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // Prevents CORS preflight which n8n webhook doesn't handle.
        headers: {
            // Necessary to bypass the ngrok free tier browser warning page.
            'ngrok-skip-browser-warning': 'true',
        },
        // Let the browser automatically set the 'Content-Type' header
        // by passing the URLSearchParams object directly.
        body: formData,
    });

    // NOTE: With 'mode: no-cors', we cannot inspect the response status or body.
    // We must optimistically assume the request succeeded if fetch() itself does not
    // throw a network error.
  },

  signupWithEmail: async (email: string, password: string): Promise<void> => {
    if (N8N_SIGNUP_WEBHOOK_URL.includes('PASTE_YOUR_NEW_N8N_WEBHOOK_URL_HERE') || N8N_SIGNUP_WEBHOOK_URL.includes('your-signup-webhook-id')) {
      throw new Error('Please update the N8N_SIGNUP_WEBHOOK_URL in config.ts with your actual ngrok webhook URL.');
    }
    
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    await fetch(N8N_SIGNUP_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
    });
  },
};
