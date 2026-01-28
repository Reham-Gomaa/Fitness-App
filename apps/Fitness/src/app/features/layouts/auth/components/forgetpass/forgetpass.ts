import {ChangeDetectionStrategy, Component, inject, signal} from "@angular/core";
import {Router} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";
import {SendEmail} from "./components/send-email/send-email";
import {ConfirmOtp} from "./components/confirm-otp/confirm-otp";
import {CreateNewPass} from "./components/create-new-pass/create-new-pass";

@Component({
    selector: "app-forgetpass",
    imports: [SendEmail, ConfirmOtp, CreateNewPass, TranslatePipe],
    templateUrl: "./forgetpass.html",
    styleUrl: "./forgetpass.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forgetpass {
    private readonly router = inject(Router);

    readonly forgetFlow = signal<"send" | "verify" | "reset">("send");
    readonly email = signal<string>("");
    readonly otp = signal<string>("");

    onEmailSubmitted(email: string): void {
        this.email.set(email);
        this.forgetFlow.set("verify");
    }

    onCodeVerified(otp: string): void {
        this.otp.set(otp);
        this.forgetFlow.set("reset");
    }

    onPasswordReset(): void {
        this.email.set("");
        this.router.navigate(["/"]);
    }

    goBackToSend(): void {
        this.forgetFlow.set("send");
    }
}
