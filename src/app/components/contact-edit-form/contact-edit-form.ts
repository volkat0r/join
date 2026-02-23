import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactsDb, Contact, ContactWithInitials } from './../../core/db/contacts.db';
import { isValidName, isValidEmail, isValidPhone } from '../../core/utils/validation';
import { InputFieldComponent } from '../../shared/ui/input-field/input-field';
import { ModalWrapper } from '../../shared/ui/modal-wrapper/modal-wrapper';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-contact-edit-form',
  standalone: true,
  imports: [FormsModule, InputFieldComponent, ModalWrapper, Button],
  templateUrl: './contact-edit-form.html',
  styleUrls: ['./contact-edit-form.scss'],
})
export class ContactEditFormComponent {
  db = inject(ContactsDb);
  cdr = inject(ChangeDetectorRef);

  @Input() contact: ContactWithInitials | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isSaving = false;
  isDeleting = false;

  errorMessage = '';

  form: Partial<Contact> = {
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
   * Updates the form values whenever the input `contact` changes.
   * Ensures the edit form always reflects the currently selected contact.
   */
  ngOnChanges() {
    if (!this.contact) return;

    this.form = {
      name: this.contact.name,
      email: this.contact.email,
      phone: this.contact.phone,
    };
  }

  /**
   * Marks a field as dirty and triggers validation for that field.
   * @param field - The form field to mark as dirty.
   */
  markDirty(field: keyof typeof this.dirty) {
    this.dirty[field] = true;
    this.validateField(field);
  }

  /**
   * Performs live validation on a field only if it has already been marked dirty.
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
    if (!this.contact) return;

    const rawValue = this.form[field];
    const value = String(rawValue ?? '');

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
      String(this.form.name ?? '').trim() !== '' &&
      String(this.form.email ?? '').trim() !== '' &&
      String(this.form.phone ?? '').trim() !== '' &&
      !this.errors.name &&
      !this.errors.email &&
      !this.errors.phone
    );
  }

  /**
   * Saves the updated contact.
   * Validates all fields, updates the contact in the database,
   * emits the `saved` event on success, and handles error states.
   */
  async save() {
    this.markDirty('name');
    this.markDirty('email');
    this.markDirty('phone');

    if (!this.isFormValid() || !this.contact) return;

    this.isSaving = true;
    this.errorMessage = '';

    try {
      await this.db.updateContact(this.contact.id, {
        name: String(this.form.name),
        email: String(this.form.email),
        phone: String(this.form.phone),
      });

      this.saved.emit();
    } catch (error) {
      console.error('Failed to update contact:', error);
      this.errorMessage = 'Saving failed. Please check your connection or try again later.';
      this.cdr.detectChanges();
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Deletes the current contact.
   * Prevents duplicate delete actions, removes the contact from the database,
   * and emits the `deleted` event on success.
   */
  async delete() {
    if (!this.contact || this.isDeleting) return;

    this.isDeleting = true;
    this.errorMessage = '';

    try {
      await this.db.deleteContact(this.contact.id);
      this.deleted.emit();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      this.errorMessage = 'Deleting failed. Please check your connection or try again later.';
      this.cdr.detectChanges();
    } finally {
      this.isDeleting = false;
    }
  }

  /**
   * Emits the `closed` event to notify the parent component
   * that the edit form should be closed without saving.
   */
  onCancel() {
    this.closed.emit();
  }
}
