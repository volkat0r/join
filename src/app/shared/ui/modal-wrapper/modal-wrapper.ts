import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-modal-wrapper',
  imports: [CommonModule],
  templateUrl: './modal-wrapper.html',
  styleUrl: './modal-wrapper.scss',
})
export class ModalWrapper {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
