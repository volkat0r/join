import { CONTACT_COLORS } from './../../core/constants/colors';
import { ContactsDb, Contact } from './../../core/db/contacts.db';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isValidName, isValidEmail, isValidPhone } from '../../core/utils/validation';

@Component({
  selector: 'app-contact-add-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-add-form.html'
})
export class ContactAddFormComponent {

  db = inject(ContactsDb);

  @Output() added = new EventEmitter<void>();

  form: Omit<Contact, 'id' | 'color'> = {
    name: '',
    email: '',
    phone: ''
  };

  errors = {
    name: '',
    email: '',
    phone: ''
  };

  private getRandomColor() {
    const index = Math.floor(Math.random() * CONTACT_COLORS.length);
    return CONTACT_COLORS[index];
  }

  // --- VALIDATION PER FIELD ---

  validateName() {
    this.errors.name = isValidName(this.form.name)
      ? ''
      : 'Name may only contain letters.';
  }

  validateEmail() {
    this.errors.email = isValidEmail(this.form.email)
      ? ''
      : 'Please enter a valid email address.';
  }

  validatePhone() {
    this.errors.phone = isValidPhone(this.form.phone)
      ? ''
      : 'Only digits or a leading + country code are allowed.';
  }

  // --- FORM VALIDITY CHECK ---
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

  // --- SUBMIT ---

  async submit() {
    // Final validation before submit
    this.validateName();
    this.validateEmail();
    this.validatePhone();

    if (!this.isFormValid()) {
      return;
    }

    await this.db.setContact({
      ...this.form,
      color: this.getRandomColor()
    });

    this.added.emit();
  }
}
