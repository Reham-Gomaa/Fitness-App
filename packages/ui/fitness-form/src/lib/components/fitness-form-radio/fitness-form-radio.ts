import {
  Component,
  input,
  OnInit,
  output,
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
   selectedItem = input<string>('');
  selectedItemChange = output<string>();

  selectedItemSignal: WritableSignal<string> = signal('');

  ngOnInit(): void {
    const initialValue = this.selectedItem() ;
    this.selectedItemSignal.set(initialValue);
  }

  selectedItemChangeHandler(value: string) {
    this.selectedItemSignal.set(value);
    this.selectedItemChange.emit(value);
  }
}
