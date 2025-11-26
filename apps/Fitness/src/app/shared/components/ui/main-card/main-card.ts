import { Component, input, OnInit } from '@angular/core';
import { cardInfo } from '../../../models/card';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-card',
  imports: [NgOptimizedImage,RouterLink],
  templateUrl: './main-card.html',
  styleUrl: './main-card.scss',
})
export class MainCard  {
  item = input<cardInfo>()




}
