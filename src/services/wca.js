const WCA_ORIGIN = 'https://www.worldcubeassociation.org';
const WCA_API_URL = `${WCA_ORIGIN}/api/v0`;

// REPLACE THESE WITH YOUR ACTUAL APPLICATION CREDENTIALS
const CLIENT_ID = import.meta.env.VITE_WCA_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_WCA_REDIRECT_URI || window.location.origin;

export default class WCAService {
  static getAuthUrl() {
    console.log('WCA Service: Generating Auth URL. Client ID present:', !!CLIENT_ID);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: 'public',
    });
    const authUrl = `${WCA_ORIGIN}/oauth/authorize?${params.toString()}`;
    console.log('Redirecting to WCA Auth URL:', authUrl);
    return authUrl;
  }

  static login() {
    window.location.href = this.getAuthUrl();
  }

  static logout() {
    localStorage.removeItem('wca_access_token');
    window.location.reload();
  }

  static getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  }

  static async getProfile(accessToken) {
    if (!accessToken) return null;

    try {
      const response = await fetch(`${WCA_API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem('wca_access_token');
          // Optionally reload or just return null to force re-login
          // window.location.reload(); 
          return null;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      return data.me;
    } catch (error) {
      console.error('Error fetching WCA profile:', error);
      return null;
    }
  }
}
