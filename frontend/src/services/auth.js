import axios from 'axios';
import { getApiBaseUrl } from './api';

// Configuration
const API_BASE_URL = "https://api-web.kunqiongai.com";
const AUTH_PROXY_BASE = '/kq-auth';
const FALLBACK_LOGIN_SECRET_KEY = "7530bfb1ad6c41627b0f0620078fa5ed";

const getAuthBaseUrl = () => {
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI);
  if (import.meta.env.DEV && !isElectron) {
    return AUTH_PROXY_BASE;
  }
  return API_BASE_URL;
};

async function generateSignedNonce() {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${nonce}|${timestamp}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(FALLBACK_LOGIN_SECRET_KEY);
  const msgData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, msgData);
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  return { nonce, timestamp, signature };
}

function encodeSignedNonce(signedNonce) {
  const jsonStr = JSON.stringify(signedNonce);
  return btoa(jsonStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * API Wrapper Class
 */
export const AuthService = {
  async getLoginUrlFromRemote() {
    const authBaseUrl = getAuthBaseUrl();
    const [signedNonce, baseUrlResponse] = await Promise.all([
      generateSignedNonce(),
      axios.post(
        `${authBaseUrl}/soft_desktop/get_web_login_url`,
        {},
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      ),
    ]);

    const baseUrl = baseUrlResponse.data?.data?.login_url;
    if (!baseUrl) {
      throw new Error(baseUrlResponse.data?.msg || 'Failed to fetch login URL');
    }

    const encodedNonce = encodeSignedNonce(signedNonce);
    return {
      url: `${baseUrl}?client_type=desktop&client_nonce=${encodedNonce}`,
      encodedNonce,
    };
  },

  async getLoginUrl() {
    const apiBaseUrl = await getApiBaseUrl();

    try {
      const res = await axios.post(
        `${apiBaseUrl}/api/auth/login-url`,
        {},
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      if (res.data?.url && res.data?.encoded_nonce) {
        return {
          url: res.data.url,
          encodedNonce: res.data.encoded_nonce,
        };
      }

      throw new Error(res.data?.detail || "Failed to fetch login URL");
    } catch (error) {
      const isMissingRoute = error?.response?.status === 404;
      const isNetworkFailure = !error?.response;

      if (isMissingRoute || isNetworkFailure) {
        console.warn('Local auth route unavailable, falling back to direct login signing.', error?.message || error);
        return this.getLoginUrlFromRemote();
      }

      console.error("Fetch signed login URL error:", error);
      throw error;
    }
  },

  async pollTokenOnce(encodedNonce) {
    const pollUrl = `${getAuthBaseUrl()}/user/desktop_get_token`;
    const params = new URLSearchParams();
    params.append('client_type', 'desktop');
    params.append('client_nonce', encodedNonce);

    try {
      const res = await axios.post(pollUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 5000
      });
      if (res.data.code === 1 && res.data.data?.token) {
        return res.data.data.token;
      }
      return null;
  } catch {
      return null;
    }
  },

  async checkLogin(token) {
    const url = `${getAuthBaseUrl()}/user/check_login`;
    const params = new URLSearchParams();
    params.append('token', token);

    try {
      const res = await axios.post(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return res.data.code === 1;
  } catch {
      return false;
    }
  },

  async getUserInfo(token) {
    const url = `${getAuthBaseUrl()}/soft_desktop/get_user_info`;

    try {
      const res = await axios.post(url, {}, {
        headers: {
          'token': token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (res.data.code === 1 && res.data.data?.user_info) {
        return res.data.data.user_info;
      }
      return null;
    } catch (error) {
      console.error("Get user info error", error);
      return null;
    }
  },

  async logout(token) {
    const url = `${getAuthBaseUrl()}/logout`;

    try {
      const res = await axios.post(url, {}, {
        headers: {
          'token': token,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return res.data.code === 1;
  } catch {
      return false;
    }
  },

  async fetchCustomUrl() {
    const url = `${getAuthBaseUrl()}/soft_desktop/get_custom_url`;

    try {
      const res = await axios.post(url, {}, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (res.data?.code === 1 && res.data?.data?.url) {
        return res.data.data.url;
      }
      return null;
    } catch (error) {
      console.error('Fetch custom URL error:', error);
      return null;
    }
  },

  async fetchFeedbackUrl() {
    const url = `${getAuthBaseUrl()}/soft_desktop/get_feedback_url`;
    const softNumber = '10031';

    try {
      const res = await axios.post(url, {}, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (res.data?.code === 1 && res.data?.data?.url) {
        return `${res.data.data.url}${softNumber}`;
      }
      return null;
    } catch (error) {
      console.error('Fetch feedback URL error:', error);
      return null;
    }
  }
};
