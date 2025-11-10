// Core
import { Component, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
// enums
import { Gender } from '../../enums/gender';
@Component({
  selector: 'lib-fitness-input-gender',
  imports: [NgOptimizedImage],
  templateUrl: './fitness-input-gender.html',
  styleUrl: './fitness-input-gender.scss',
})
export class FitnessInputGender {
 genderChange=output<Gender>()

 gender=signal<Gender>(Gender.Male);
 
 Gender = Gender;

 genderChangeHandler(gender: Gender) {
  this.gender.set(gender);
  this.genderChange.emit(gender)
 }

}
