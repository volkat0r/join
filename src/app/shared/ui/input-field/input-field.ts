import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isValidName, isValidEmail, isValidPhone } from '../../../core/utils/validation';


@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss']
})
export class InputFieldComponent {

  @Input() type = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() icon: string | null = null;
  @Input() error: string | null = null;

  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();

  @Output() blur = new EventEmitter<void>();
  @Output() input = new EventEmitter<void>();

  onInput(event: any) {
    this.modelChange.emit(event.target.value);
    this.input.emit();
  }
}
