import { environment } from '@fitness-app/environment/baseUrl.dev';

export class EndPoint {
  static SIGNUP = `${environment.baseApiUrl}/api/v1/auth/signup`;
  static SIGNIN = `${environment.baseApiUrl}/api/v1/auth/signin`;
  static CHANGE_PASSWORD = `${environment.baseApiUrl}auth/change-password`;
  static UPLOAD_PROFILE_PHOTO = `${environment.baseApiUrl}/api/v1/auth/upload-photo`;
  static PROFILE_DATA = `${environment.baseApiUrl}auth/profile-data`;
  static LOGOUT = `${environment.baseApiUrl}auth/logout`;
  static FORGET_PASSWORD = `${environment.baseApiUrl}/api/v1/auth/forgotPassword`;
  static VERIFY_RESET = `${environment.baseApiUrl}/api/v1/auth/verifyResetCode`;
  static RESET_PASSWORD = `${environment.baseApiUrl}/api/v1/auth/resetPassword`;
  static DELETE_ACCOUNT = `${environment.baseApiUrl}/api/v1/auth/deleteMe`;
  static EDIT_PROFILE = `${environment.baseApiUrl}auth/editProfile`;
  static LEVELS = `${environment.baseApiUrl}/api/v1/auth/levels`;
  static MUSCLES = `${environment.baseApiUrl}/api/v1/auth/muscles`;
  static EXERCISES = `${environment.baseApiUrl}/api/v1/auth/exercises`;
}
