import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  catchError,
  tap,
  map,
  throwError,
  shareReplay,
} from 'rxjs';

import { API_CONFIG } from './config/auth-api-config.token';
import { ApiConfig } from './interface/api-config.interface';
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UploadPhotoRequest,
  UploadPhotoResponse,
  ProfileDataResponse,
  LogoutResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  DeleteMeResponse,
  EditProfileRequest,
  EditProfileResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  ErrorResponse,
  User,
} from './interface/auth-response.interface';
import { AuthAPI } from './base/AuthAPI';

/**
 * Authentication API Service
 *
 * Provides authentication and user management functionality.
 *
 * **Angular Version Compatibility:**
 * - Angular 14+: Automatic dependency injection using inject() function
 * - Angular 12-13: Requires manual dependency provision (see package documentation)
 *
 * **Setup:**
 * ```typescript
 * // In app.config.ts (Angular 15+) or app.module.ts (Angular 12-14)
 * import { provideAuthApiConfig } from 'auth-api-kp';
 *
 * providers: [
 *   provideAuthApiConfig({
 *     baseUrl: 'https://api.example.com',
 *     apiVersion: 'v1',
 *     endpoints: { ... }
 *   })
 * ]
 * ```
 *
 * **Usage:**
 * ```typescript
 * constructor(private authService: AuthApiKpService) {}
 *
 * login() {
 *   this.authService.login({ email, password }).subscribe({
 *     next: (response) => console.log('Logged in', response),
 *     error: (error) => console.error('Login failed', error)
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthApiKpService extends AuthAPI {
  private readonly _http: HttpClient;
  private readonly _config: ApiConfig;
  private readonly _urlCache = new Map<string, string>();
  private _profileDataCache$: Observable<ProfileDataResponse> | null = null;

  /**
   * Observable stream of current user data
   * Emits null when user is logged out
   */
  readonly userData$ = new BehaviorSubject<User | null>(null);

  /**
   * @deprecated Use userData$ instead. This will be removed in a future version.
   */
  get userData(): BehaviorSubject<User | null> {
    return this.userData$;
  }

  /**
   * Constructor with dependency injection support for Angular 12-13
   * Also supports inject() pattern for Angular 14+
   *
   * For Angular 12-13: Provide dependencies via constructor with @Inject decorator
   * ```typescript
   * constructor(http: HttpClient, @Inject(API_CONFIG) config: ApiConfig)
   * ```
   *
   * For Angular 14+: Dependencies are auto-injected using inject() function
   * ```typescript
   * constructor() // inject() is called internally
   * ```
   *
   * Note: This constructor uses inject() function internally for Angular 14+ compatibility.
   * For Angular 12-13, provide dependencies via constructor injection.
   */
  constructor() {
    super();

    // Use inject() function (Angular 14+) - this works in injection context
    // Note: For Angular 12-13, this will fail at compile time since inject() doesn't exist
    // Users of Angular 12-13 should use a factory pattern or provide dependencies manually
    try {
      this._http = inject(HttpClient);
      this._config = inject(API_CONFIG);
    } catch (error) {
      // If inject() fails, provide helpful error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes('NG0209') ||
        errorMessage.includes('injection context') ||
        errorMessage.includes('inject is not a function')
      ) {
        throw new Error(
          'AuthApiKpService: Failed to inject dependencies. ' +
            'For Angular 12-13: This library requires Angular 14+ for automatic injection. ' +
            'For Angular 14+: Ensure you are in an Angular injection context (e.g., in a service constructor).'
        );
      }
      throw error;
    }

    if (!this._http) {
      throw new Error(
        'HttpClient must be provided. Make sure HttpClientModule is imported.'
      );
    }
    if (!this._config) {
      throw new Error(
        'API_CONFIG must be provided. Use provideAuthApiConfig() in your app config.'
      );
    }
  }

  /**
   * Builds full URL for an endpoint with caching for performance
   * @param endpointKey - The endpoint key from config
   * @returns Full URL string
   */
  private buildUrl(endpointKey: keyof ApiConfig['endpoints']['auth']): string {
    if (this._urlCache.has(endpointKey)) {
      return this._urlCache.get(endpointKey)!;
    }

    const { baseUrl, apiVersion, endpoints } = this._config;
    const endpoint = endpoints.auth[endpointKey];

    if (!endpoint) {
      throw new Error(`Endpoint '${String(endpointKey)}' is not configured`);
    }

    const version = apiVersion ? `/${apiVersion}` : '';
    let url = `${baseUrl}${version}/${endpoint}`;

    // Normalize URL: remove duplicate slashes, but preserve protocol
    url = url.replace(/([^:]\/)\/+/g, '$1');

    this._urlCache.set(endpointKey, url);
    return url;
  }

  /**
   * Handles HTTP errors consistently
   * @param defaultMessage - Default error message
   * @param shouldThrow - Whether to throw error or return ErrorResponse
   * @returns Error handler function
   */
  private handleError<T>(
    defaultMessage: string,
    shouldThrow = false
  ): (error: unknown) => Observable<ErrorResponse | never> {
    return (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message || defaultMessage;

      const errorResponse: ErrorResponse = { error: errorMessage };

      if (shouldThrow) {
        return throwError(() => errorResponse);
      }

      return of(errorResponse);
    };
  }

  /**
   * Updates user data in the BehaviorSubject
   * @param user - User data or null
   */
  private updateUserData(user: User | null): void {
    this.userData$.next(user);
  }

  /**
   * Clears cached profile data
   */
  private clearProfileCache(): void {
    this._profileDataCache$ = null;
  }

  /**
   * Signs in a user
   * @param data - Login credentials
   * @returns Observable of sign-in response or error
   */
  login(data: SignInRequest): Observable<SignInResponse | ErrorResponse> {
    return this._http.post<SignInResponse>(this.buildUrl('login'), data).pipe(
      tap((res) => {
        if (res.token && res.user) {
          this.updateUserData(res.user);
          this.clearProfileCache();
        }
      }),
      catchError(this.handleError('Login failed'))
    );
  }

  /**
   * Registers a new user
   * @param data - Registration data
   * @returns Observable of sign-up response or error
   */
  register(data: SignUpRequest): Observable<SignUpResponse | ErrorResponse> {
    return this._http
      .post<SignUpResponse>(this.buildUrl('register'), data)
      .pipe(
        tap((res) => {
          if (res.token && res.user) {
            this.updateUserData(res.user);
            this.clearProfileCache();
          }
        }),
        catchError(this.handleError('Registration failed'))
      );
  }

  /**
   * Initiates password reset process
   * @param data - Email for password reset
   * @returns Observable of forgot password response or error
   */
  forgetPassword(
    data: ForgotPasswordRequest
  ): Observable<ForgotPasswordResponse | ErrorResponse> {
    return this._http
      .post<ForgotPasswordResponse>(this.buildUrl('forgotPassword'), data)
      .pipe(catchError(this.handleError('Forgot password failed')));
  }

  /**
   * Verifies reset code
   * @param data - Reset code to verify
   * @returns Observable of verification response or error
   */
  verifyCode(
    data: VerifyResetCodeRequest
  ): Observable<VerifyResetCodeResponse | ErrorResponse> {
    return this._http
      .post<VerifyResetCodeResponse>(this.buildUrl('verifyResetCode'), data)
      .pipe(catchError(this.handleError('Verify code failed')));
  }

  /**
   * Resets user password
   * @param data - New password data
   * @returns Observable of reset password response or error
   */
  resetPassword(
    data: ResetPasswordRequest
  ): Observable<ResetPasswordResponse | ErrorResponse> {
    return this._http
      .put<ResetPasswordResponse>(this.buildUrl('resetPassword'), data)
      .pipe(catchError(this.handleError('Reset password failed')));
  }

  /**
   * Logs out the current user
   * @returns Observable of logout response or error
   */
  logout(): Observable<LogoutResponse | ErrorResponse> {
    return this._http.get<LogoutResponse>(this.buildUrl('logout')).pipe(
      tap(() => {
        this.updateUserData(null);
        this.clearProfileCache();
      }),
      map(() => ({ message: 'Logged out successfully' } as LogoutResponse)),
      catchError(this.handleError('Logout failed'))
    );
  }

  /**
   * Changes user password
   * @param data - Password change data
   * @returns Observable of change password response or error
   */
  changePassword(
    data: ChangePasswordRequest
  ): Observable<ChangePasswordResponse | ErrorResponse> {
    return this._http
      .patch<ChangePasswordResponse>(this.buildUrl('changePassword'), data)
      .pipe(catchError(this.handleError('Change password failed')));
  }

  /**
   * Uploads user profile photo
   * @param data - Photo file to upload
   * @returns Observable of upload response or error
   */
  uploadPhoto(
    data: UploadPhotoRequest
  ): Observable<UploadPhotoResponse | ErrorResponse> {
    if (!(data.photo instanceof File)) {
      return of({ error: 'Photo must be a File object' });
    }

    const formData = new FormData();
    formData.append('photo', data.photo, data.photo.name);

    return this._http
      .put<UploadPhotoResponse>(this.buildUrl('uploadPhoto'), formData)
      .pipe(
        tap(() => this.clearProfileCache()),
        catchError(this.handleError('Upload photo failed'))
      );
  }

  /**
   * Gets user profile data with caching
   * @param forceRefresh - Force refresh cache
   * @returns Observable of profile data response or error
   */
  getProfileData(
    forceRefresh = false
  ): Observable<ProfileDataResponse | ErrorResponse> {
    if (!forceRefresh && this._profileDataCache$) {
      return this._profileDataCache$;
    }

    const request$ = this._http
      .get<ProfileDataResponse>(this.buildUrl('profileData'))
      .pipe(
        tap((res) => {
          this.updateUserData(res.user);
        }),
        shareReplay(1),
        catchError(this.handleError('Fetch profile failed'))
      );

    if (!forceRefresh) {
      this._profileDataCache$ = request$ as Observable<ProfileDataResponse>;
    }

    return request$;
  }

  /**
   * Deletes current user account
   * @returns Observable of delete response or error
   */
  deleteMe(): Observable<DeleteMeResponse | ErrorResponse> {
    return this._http.delete<DeleteMeResponse>(this.buildUrl('deleteMe')).pipe(
      tap(() => {
        this.updateUserData(null);
        this.clearProfileCache();
      }),
      catchError(this.handleError('Delete account failed'))
    );
  }

  /**
   * Edits user profile
   * @param data - Profile data to update
   * @returns Observable of edit profile response or error
   */
  editProfile(
    data: EditProfileRequest
  ): Observable<EditProfileResponse | ErrorResponse> {
    return this._http
      .put<EditProfileResponse>(this.buildUrl('editProfile'), data)
      .pipe(
        tap((res) => {
          this.updateUserData(res.user);
          this.clearProfileCache();
        }),
        catchError(this.handleError('Edit profile failed'))
      );
  }

  /**
   * Updates user role
   * @param data - Role update data
   * @returns Observable of update role response or error
   */
  updateRole(
    data: UpdateRoleRequest
  ): Observable<UpdateRoleResponse | ErrorResponse> {
    return this._http
      .put<UpdateRoleResponse>(this.buildUrl('editProfile'), data)
      .pipe(
        tap((res) => {
          this.updateUserData(res.user);
          this.clearProfileCache();
        }),
        catchError(this.handleError('Update role failed'))
      );
  }
}
