import { Component, input, OnInit } from '@angular/core';
import { MainCard } from "../main-card/main-card";
import { Muscle } from '../../../models/muscles';
//ng carouse
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Category } from '../../../models/meals';
import { Skeleton } from "primeng/skeleton";

@Component({
  selector: 'app-carousel',
  imports: [
    MainCard,
    CarouselModule,
    ButtonModule,
    TagModule,
    Skeleton
],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel implements OnInit {
  data = input.required<Muscle[] | Category[]>();
  cat = input<string>();
  numVisible = input<number>(2)
  showIndic = input<boolean>(true)
  responsiveOptions: any[] | undefined;
  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
