import { Component, input } from '@angular/core';
import { cardInfo } from '../../../models/card';

@Component({
  selector: 'app-main-card',
  imports: [],
  templateUrl: './main-card.html',
  styleUrl: './main-card.scss',
})
export class MainCard {
  item = input<cardInfo>()



}
