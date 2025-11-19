/**
 * API Configuration interface
 *
 * Defines the structure for configuring the authentication API endpoints
 */
export interface ApiConfig {
  /** Base URL of the API (e.g., 'https://api.example.com') */
  baseUrl: string;
  /** Optional API version (e.g., 'v1', 'v2') */
  apiVersion?: string;
  /** Endpoint configuration */
  endpoints: {
    auth: {
      /** Login endpoint path */
      login: string;
      /** Registration endpoint path */
      register: string;
      /** Logout endpoint path */
      logout: string;
      /** Forgot password endpoint path */
      forgotPassword?: string;
      /** Verify reset code endpoint path */
      verifyResetCode?: string;
      /** Reset password endpoint path */
      resetPassword?: string;
      /** Get profile data endpoint path */
      profileData?: string;
      /** Edit profile endpoint path */
      editProfile?: string;
      /** Change password endpoint path */
      changePassword?: string;
      /** Delete account endpoint path */
      deleteMe?: string;
      /** Upload photo endpoint path */
      uploadPhoto?: string;
      /** Forgot password form endpoint path (legacy) */
      forgetPasswordForm?: string;
    };
  };
}
