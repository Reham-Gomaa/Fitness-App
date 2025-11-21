import { Component, input } from '@angular/core';
import { cardInfo } from '../../../models/card';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-main-card',
  imports: [NgOptimizedImage],
  templateUrl: './main-card.html',
  styleUrl: './main-card.scss',
})
export class MainCard {
  item = input<cardInfo>()



}
