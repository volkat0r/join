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

  /**
   * Selects a random color from the predefined CONTACT_COLORS list.
   * Used to assign a visual identifier to newly created contacts.
   * @returns A random color string.
   */
  private getRandomColor() {
    const index = Math.floor(Math.random() * CONTACT_COLORS.length);
    return CONTACT_COLORS[index];
  }

  /**
   * Marks a form field as "dirty" and triggers validation for that field.
   * @param field - The form field to mark as dirty.
   */
  markDirty(field: keyof typeof this.dirty) {
    this.dirty[field] = true;
    this.validateField(field);
  }

  /**
   * Performs live validation on a field only if it has already been marked as dirty.
   * @param field - The form field to validate.
   */
  liveValidate(field: keyof typeof this.dirty) {
    if (this.dirty[field]) {
      this.validateField(field);
    }
  }

  /**
   * Validates a specific form field and updates the corresponding error message.
   * Uses shared validation utilities for name, email, and phone.
   * @param field - The form field to validate.
   */
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

  /**
   * Checks whether the entire form is valid.
   * Ensures all fields are filled and no validation errors remain.
   * @returns True if the form is valid, otherwise false.
   */
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

  /**
   * Handles form submission.
   * Validates all fields, attempts to save the contact to the database,
   * emits the `added` event on success, and handles error states gracefully.
   */
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

  /**
   * Emits the `closed` event to notify the parent component
   * that the form should be closed without saving.
   */
  onCancel() {
    this.closed.emit();
  }
}
