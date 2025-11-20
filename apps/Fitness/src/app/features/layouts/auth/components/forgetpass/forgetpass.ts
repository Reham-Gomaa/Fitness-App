import { Component, signal } from "@angular/core";
import { SendEmail } from "./components/send-email/send-email";
import { ConfirmOtp } from "./components/confirm-otp/confirm-otp";
import { CreateNewPass } from "./components/create-new-pass/create-new-pass";

@Component({
    selector: "app-forgetpass",
    imports: [SendEmail, ConfirmOtp, CreateNewPass],
    templateUrl: "./forgetpass.html",
    styleUrl: "./forgetpass.scss",
})
export class Forgetpass {
    forgetFlow = signal<"send" | "verify" | "reset">("send");
    email = signal<string>("");

    onEmailSubmitted(email: string) {
        this.email.set(email);
        this.forgetFlow.set("verify");
    }

    onCodeVerified(otp: number) {
        console.log(otp);
        this.forgetFlow.set("reset");
    }

    onPasswordReset() {
        this.email.set("");
        this.forgetFlow.set("send");
    }

    goBackToSend() {
        this.forgetFlow.set("send");
    }
}