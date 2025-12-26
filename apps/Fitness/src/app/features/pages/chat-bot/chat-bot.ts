import { Component } from '@angular/core';
import { GeminiMenuComponent } from "../../../shared/gemini-menu/gemini-menu";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-bot',
  imports: [CommonModule,GeminiMenuComponent],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss',
})
export class ChatBot {

}
