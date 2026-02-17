import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'urgent' | 'medium' | 'low' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
}
