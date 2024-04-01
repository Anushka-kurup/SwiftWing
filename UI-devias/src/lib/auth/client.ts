'use client';

import type { User } from '@/types/user';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
  role: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
      return { error: 'Social authentication failed' };
    
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password, role } = params;
    // Make API request
    try {
      const response = await fetch('http://localhost:5000/auth/login',
      {method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      },
      body: JSON.stringify({
        email,
        password,
        role
      })});
      const data = await response.json();
      console.log(data);
      if (data.detail === "Authentication failed") {
        return { error: 'Invalid credentials'}
      }
      const token = data.access_token;
      localStorage.setItem('custom-auth-token', token);
      return {};
      } catch (error) {
        return { error: 'Server down. try again later' }
      }
    }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');
    if (!token) {
      return { data: null };
    }
    // Make API request
    try {
      const response: Response = await fetch('http://localhost:5000/auth/user',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Authorization': `Bearer ${token}`
        },
      })
      const data = await response.json();
      console.log(data);
      const userProvided = {
        id: data.user_id,
        email: data.user,
        role: data.role,
        name: data.first_name + ' ' + data.last_name
      } satisfies User;
      return {data: userProvided};

      } catch (error) {
        return { data: null }
      }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');
    return {};
  }
}

export const authClient = new AuthClient();
