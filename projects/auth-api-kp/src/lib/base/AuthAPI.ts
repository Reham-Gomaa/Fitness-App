import { Observable } from 'rxjs';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteMeResponse,
  EditProfileRequest,
  EditProfileResponse,
  ErrorResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  LogoutResponse,
  ProfileDataResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  UploadPhotoRequest,
  UploadPhotoResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
} from '../interface/auth-response.interface';

/**
 * Abstract base class for authentication API implementations
 *
 * Provides a contract that all authentication services must implement.
 * This allows for easy swapping of implementations and testing.
 */
export abstract class AuthAPI {
  /**
   * Signs in a user with email and password
   * @param data - Login credentials
   * @returns Observable of sign-in response or error
   */
  abstract login(
    data: SignInRequest
  ): Observable<SignInResponse | ErrorResponse>;

  /**
   * Registers a new user
   * @param data - Registration data
   * @returns Observable of sign-up response or error
   */
  abstract register(
    data: SignUpRequest
  ): Observable<SignUpResponse | ErrorResponse>;

  /**
   * Initiates password reset process
   * @param data - Email for password reset
   * @returns Observable of forgot password response or error
   */
  abstract forgetPassword(
    data: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse | ErrorResponse>;

  /**
   * Verifies reset code sent to user's email
   * @param data - Reset code to verify
   * @returns Observable of verification response or error
   */
  abstract verifyCode(
    data: VerifyResetCodeRequest
  ): Observable<VerifyResetCodeResponse | ErrorResponse>;

  /**
   * Resets user password with new password
   * @param data - New password data
   * @returns Observable of reset password response or error
   */
  abstract resetPassword(
    data: ResetPasswordRequest
  ): Observable<ResetPasswordResponse | ErrorResponse>;

  /**
   * Logs out the current user
   * @returns Observable of logout response or error
   */
  abstract logout(): Observable<LogoutResponse | ErrorResponse>;

  /**
   * Changes user password
   * @param data - Password change data
   * @returns Observable of change password response or error
   */
  abstract changePassword(
    data: ChangePasswordRequest
  ): Observable<ChangePasswordResponse | ErrorResponse>;

  /**
   * Uploads user profile photo
   * @param data - Photo file to upload
   * @returns Observable of upload response or error
   */
  abstract uploadPhoto(
    data: UploadPhotoRequest
  ): Observable<UploadPhotoResponse | ErrorResponse>;

  /**
   * Gets current user profile data
   * @returns Observable of profile data response or error
   */
  abstract getProfileData(): Observable<ProfileDataResponse | ErrorResponse>;

  /**
   * Deletes current user account
   * @returns Observable of delete response or error
   */
  abstract deleteMe(): Observable<DeleteMeResponse | ErrorResponse>;

  /**
   * Edits user profile information
   * @param data - Profile data to update
   * @returns Observable of edit profile response or error
   */
  abstract editProfile(
    data: EditProfileRequest
  ): Observable<EditProfileResponse | ErrorResponse>;

  /**
   * Updates user role
   * @param data - Role update data
   * @returns Observable of update role response or error
   */
  abstract updateRole(
    data: UpdateRoleRequest
  ): Observable<UpdateRoleResponse | ErrorResponse>;
}
