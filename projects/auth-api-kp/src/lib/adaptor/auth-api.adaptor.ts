import { Injectable } from '@angular/core';
import { Adaptor } from '../interface/adaptor';
import {
  AuthResponse,
  AdaptedAuthResponse,
} from '../interface/auth-response.interface';

/**
 * Adaptor service for transforming AuthResponse to AdaptedAuthResponse
 *
 * This service provides a standardized way to transform authentication responses
 * into a simplified format containing only essential user information.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthAPIAdaptorService
  implements Adaptor<AuthResponse, AdaptedAuthResponse>
{
  /**
   * Adapts an AuthResponse to AdaptedAuthResponse format
   * @param data - The authentication response to adapt
   * @returns Adapted authentication response with simplified user data
   */
  adapt(data: AuthResponse): AdaptedAuthResponse {
    return {
      message: data.message,
      token: data.token,
      userEmail: data.user?.email ?? '',
      userRole: data.user?.role ?? '',
    };
  }
}
