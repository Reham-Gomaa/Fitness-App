import { AuthEndPoint } from '../enums/AuthAPI.endPoint';
import { ApiConfig } from '../interface/api-config.interface';

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: '',
  apiVersion: 'v1',
  endpoints: {
    auth: {
      login: AuthEndPoint.LOGIN,
      register: AuthEndPoint.REGISTER,
      logout: AuthEndPoint.LOGOUT,
      forgotPassword: AuthEndPoint.FORGOT_PASSWORD,
      verifyResetCode: AuthEndPoint.VERIFY_CODE,
      resetPassword: AuthEndPoint.RESET_PASSWORD,
      profileData: AuthEndPoint.PROFILE_DATA,
      editProfile: AuthEndPoint.EDIT_PROFILE,
      changePassword: AuthEndPoint.CHANGE_PASSWORD,
      deleteMe: AuthEndPoint.DELETE_ACCOUNT,
      uploadPhoto: AuthEndPoint.UPLOAD_PHOTO,
      forgetPasswordForm: AuthEndPoint.FORGOT_PASSWORD,
    },
  },
};
