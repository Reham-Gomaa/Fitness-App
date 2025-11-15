import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { SeoService } from './../../../../../core/services/seo/seo.service';

export interface trainersKeys {
  name: string;
  width: number;
  height: number;
  ratio: number;
}
export interface servicesKeys {
  header: string;
  paragraph1: string;
  paragraph2: string;
}

@Component({
  selector: 'app-about-us',
  imports: [NgOptimizedImage],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update(
      'About Us | FitZone',
      'Learn more about FitZone – empowering you to achieve your fitness goals with certified trainers, top equipment, and a supportive community.'
    );
  }

  trainers: WritableSignal<trainersKeys[]> = signal([
    {
      name: 'trainer-3',
      width: 358,
      height: 537.1,
      ratio: 1333 / 2000,
    },
    {
      name: 'trainer-1',
      width: 353,
      height: 529.6,
      ratio: 1333 / 2000,
    },
    {
      name: 'trainer-2',
      width: 222,
      height: 148,
      ratio: 444 / 296,
    },
  ]);

  services: WritableSignal<servicesKeys[]> = signal([
    {
      header: 'Personal Trainer',
      paragraph1: 'Achieve your fitness goals with the',
      paragraph2: 'guidance of our certifiedtrainers.',
    },
    {
      header: 'Cardio Programs',
      paragraph1: 'From steady-state runs to interval',
      paragraph2: 'sprints, our treadmillprograms.',
    },
    {
      header: 'Quality Equipment',
      paragraph1: 'Our gym is equipped with the',
      paragraph2: 'latest cardio & strength machines.',
    },
    {
      header: 'Healthy Nutrition',
      paragraph1: 'Fuel your fitness journey with',
      paragraph2: 'customized meal plans for you.',
    },
  ]);
}
