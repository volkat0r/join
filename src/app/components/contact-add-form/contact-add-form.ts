import { CONTACT_COLORS } from './../../core/constants/colors';
import { ContactsDb, Contact } from './../../core/db/contacts.db';
import { Component, EventEmitter, Output, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isValidName, isValidEmail, isValidPhone } from '../../core/utils/validation';
import { ModalWrapper } from '../../shared/ui/modal-wrapper/modal-wrapper';
import { InputFieldComponent } from '../../shared/ui/input-field/input-field';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-contact-add-form',
  standalone: true,
  imports: [FormsModule, ModalWrapper, InputFieldComponent, Button],
  templateUrl: './contact-add-form.html',
  styleUrls: ['./contact-add-form.scss'],
})
export class ContactAddFormComponent {
  db = inject(ContactsDb);
  cdr = inject(ChangeDetectorRef);

  @Output() added = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isSaving = false;
  errorMessage = '';

  form: Omit<Contact, 'id' | 'color'> = {
    name: '',
    email: '',
    phone: '',
  };

  errors = {
    name: '',
    email: '',
    phone: '',
  };

  dirty = {
    name: false,
    email: false,
    phone: false,
  };

  private getRandomColor() {
    const index = Math.floor(Math.random() * CONTACT_COLORS.length);
    return CONTACT_COLORS[index];
  }

  markDirty(field: keyof typeof this.dirty) {
    this.dirty[field] = true;
    this.validateField(field);
  }

  liveValidate(field: keyof typeof this.dirty) {
    if (this.dirty[field]) {
      this.validateField(field);
    }
  }

  validateField(field: keyof typeof this.form) {
    const value = this.form[field];

    switch (field) {
      case 'name':
        this.errors.name = isValidName(value) ? '' : 'Name may only contain letters.';
        break;

      case 'email':
        this.errors.email = isValidEmail(value) ? '' : 'Please enter a valid email address.';
        break;

      case 'phone':
        this.errors.phone = isValidPhone(value)
          ? ''
          : 'Please enter at least 10 digits using numbers only (a leading + is allowed).';
        break;
    }
  }

  isFormValid() {
    return (
      this.form.name.trim() !== '' &&
      this.form.email.trim() !== '' &&
      this.form.phone.trim() !== '' &&
      !this.errors.name &&
      !this.errors.email &&
      !this.errors.phone
    );
  }

  async submit() {
    this.markDirty('name');
    this.markDirty('email');
    this.markDirty('phone');

    if (!this.isFormValid()) return;

    this.isSaving = true;
    this.errorMessage = '';

    try {
      await this.db.setContact({
        ...this.form,
        color: this.getRandomColor(),
      });

      this.added.emit();
    } catch (err) {
      console.error('Saving failed:', err);
      this.errorMessage = 'Saving failed. Please check your connection or try again later.';

      this.cdr.detectChanges();
    } finally {
      this.isSaving = false;
    }
  }

  onCancel() {
    this.closed.emit();
  }
}
