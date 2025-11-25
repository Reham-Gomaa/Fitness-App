import {Component, inject, signal} from "@angular/core";
import {SendEmail} from "./components/send-email/send-email";
import {ConfirmOtp} from "./components/confirm-otp/confirm-otp";
import {CreateNewPass} from "./components/create-new-pass/create-new-pass";
import {TranslatePipe} from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-forgetpass",
    imports: [SendEmail, ConfirmOtp, CreateNewPass, TranslatePipe],
    templateUrl: "./forgetpass.html",
    styleUrl: "./forgetpass.scss",
})
export class Forgetpass {
    private readonly _router = inject(Router);
    forgetFlow = signal<"send" | "verify" | "reset">("send");
    email = signal<string>("");
    otp = signal<string>("");

    onEmailSubmitted(email: string) {
        this.email.set(email);
        this.forgetFlow.set("verify");
    }

    onCodeVerified(otp: string) {
        this.otp.set(otp);
        this.forgetFlow.set("reset");
    }

    onPasswordReset() {
        this.email.set("");
        this._router.navigate(["/"]);
    }

    goBackToSend() {
        this.forgetFlow.set("send");
    }
}
