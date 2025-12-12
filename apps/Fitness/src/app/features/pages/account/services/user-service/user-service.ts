import {Injectable, inject, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {
    User,
    UserResponse,
    UpdateProfilePayload,
    LogoutResponse,
    ChangePasswordResponse,
} from "../../interfaces/user-interface";
import {environment} from "@fitness-app/environment/baseUrl.dev";
import {AuthEndPoint} from "auth-api-kp";
import {ClearCache} from "./../../../../../shared/services/clearCache/clear-cache";

@Injectable({
    providedIn: "root",
})
export class UserService {
    private http = inject(HttpClient);
    private _clearCache = inject(ClearCache);

    // Signal to store current user data
    currentUser = signal<User | null>(null);

    // Get logged user data
    getLoggedUserData(): Observable<UserResponse> {
        return this.http.get<UserResponse>(environment.baseApiUrl + AuthEndPoint.PROFILE_DATA).pipe(
            tap((response) => {
                if (response.message === "success") {
                    this.currentUser.set(response.user);
                }
            })
        );
    }

    // Update user profile
    updateProfile(payload: UpdateProfilePayload): Observable<UserResponse> {
        return this.http
            .put<UserResponse>(environment.baseApiUrl + AuthEndPoint.EDIT_PROFILE, payload)
            .pipe(
                tap((response) => {
                    if (response.message === "success") {
                        this.currentUser.set(response.user);
                    }
                })
            );
    }

    // Update specific field helpers
    updateGoal(goal: string): Observable<UserResponse> {
        return this.updateProfile({goal});
    }

    updateActivityLevel(activityLevel: string): Observable<UserResponse> {
        return this.updateProfile({activityLevel});
    }

    updateWeight(weight: number): Observable<UserResponse> {
        return this.updateProfile({weight});
    }

    changePassword(oldPassword: string, newPassword: string): Observable<ChangePasswordResponse> {
        return this.http
            .patch<ChangePasswordResponse>(environment.baseApiUrl + AuthEndPoint.CHANGE_PASSWORD, {
                password: oldPassword,
                newPassword: newPassword,
            })
            .pipe(
                tap((response) => {
                    if (response.message === "success" && response.token) {
                        localStorage.setItem("token", response.token);
                        console.log("Password changed successfully and token updated");
                    }
                })
            );
    }

    logout(): Observable<LogoutResponse> {
        return this.http.get<LogoutResponse>(environment.baseApiUrl + AuthEndPoint.LOGOUT, {}).pipe(
            tap((response) => {
                this.currentUser.set(null);
                localStorage.removeItem("token");
                this._clearCache.clearAllCaches();
            })
        );
    }
}
