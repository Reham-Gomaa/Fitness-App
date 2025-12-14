import {inject} from "@angular/core";
import {selectRegisterData} from "./auth.selectors";
import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {AuthApiKpService, ErrorResponse, SignUpRequest, SignUpResponse} from "auth-api-kp";
import {Store} from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import {of} from "rxjs";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthApiKpService);
    private store = inject(Store);

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.submitRegistration),
            withLatestFrom(this.store.select(selectRegisterData)),
            switchMap(([_, registerData]) =>
                this.authService.register(registerData as SignUpRequest).pipe(
                    map((response: SignUpResponse | ErrorResponse) => {
                        if ("error" in response) {
                            return AuthActions.registerFailure({error: response.error});
                        }
                        return AuthActions.registerSuccess({response});
                    }),
                    catchError((error) => of(AuthActions.registerFailure({error: error.message})))
                )
            )
        )
    );
}
