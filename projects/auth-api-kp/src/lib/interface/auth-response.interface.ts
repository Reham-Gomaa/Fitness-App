// Base Interfaces
export interface AdaptedAuthResponse {
  message: string;
  token: string;
  userEmail: string;
  userRole: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user?: User;
}

export interface ErrorResponse {
  error: string;
}

/**
 * User interface representing user data structure
 */
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: string;
  activityLevel?: string;
  phone: string;
  photo: string;
  role: string;
  wishlist: unknown[];
  addresses: unknown[];
  createdAt: string;
  passwordResetCode?: string;
  passwordResetExpires?: string;
  resetCodeVerified?: boolean;
  passwordChangedAt?: string;
}

// Specific API Interfaces
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword?: string;
  gender?: string;
  height?: number;
  weight?: number;
  age?: number;
  goal?: string;
  activityLevel?: string;
  phone?: string;
}

export interface SignUpResponse extends AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse extends AuthResponse {
  user: User;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  token: string;
}

export interface UploadPhotoRequest {
  photo: File | string;
}

export interface UploadPhotoResponse {
  message: string;
  photoUrl: string;
}

export interface ProfileDataResponse {
  message: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  info: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  status: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  info: string;
}

export interface DeleteMeResponse {
  message: string;
}

export interface EditProfileRequest {
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
}

export interface EditProfileResponse {
  message: string;
  user: User;
}

export interface UpdateRoleRequest {
  role: string;
}

export interface UpdateRoleResponse {
  message: string;
  user: User;
}
