import {
  Component,
  input,
  OnInit,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RadioItem } from '../../interfaces/radio-item';

@Component({
  selector: 'lib-fitness-form-radio',
  imports: [],
  templateUrl: './fitness-form-radio.html',
  styleUrl: './fitness-form-radio.scss',
})
export class FitnessFormRadio implements OnInit {
  config = input.required<RadioItem[]>();
  selectedItemChange = output<string>();

  selectedItem: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.selectedItem.set(this.config()[0].value);
  }

  selectedItemChangeHandler(value: string) {
    this.selectedItem.set(value);
    this.selectedItemChange.emit(value);
  }
}
