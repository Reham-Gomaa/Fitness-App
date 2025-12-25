import {Component, signal} from "@angular/core";
import { MainButton } from "../../ui/main-button/main-button";
import { TranslatePipe } from "@ngx-translate/core";
import {FormsModule} from '@angular/forms'
@Component({
    selector: "app-bot",
    imports: [MainButton, TranslatePipe, FormsModule],
    templateUrl: "./bot.html",
    styleUrl: "./bot.scss",
})
export class Bot {
  chatMessage = ''
  isActiveChat = signal<boolean>(false)

  openChat(){
    this.isActiveChat.update(v=>!v)
  }
}
