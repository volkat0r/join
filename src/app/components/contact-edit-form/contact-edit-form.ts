import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactsDb, Contact } from './../../core/db/contacts.db';
import { isValidName, isValidEmail, isValidPhone } from '../../core/utils/validation';

@Component({
  selector: 'app-contact-edit-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-edit-form.html'
})
export class ContactEditFormComponent {

  db = inject(ContactsDb);

  @Input() contact!: Contact;
  @Output() saved = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  form: Partial<Contact> = {
    name: '',
    email: '',
    phone: ''
  };

  errors = {
    name: '',
    email: '',
    phone: ''
  };

  ngOnChanges() {
    if (this.contact) {
      this.form = {
        name: this.contact.name,
        email: this.contact.email,
        phone: this.contact.phone
      };
    }
  }

  validateName() {
    this.errors.name = isValidName(this.form.name ?? '')
      ? ''
      : 'Name may only contain letters.';
  }

  validateEmail() {
    this.errors.email = isValidEmail(this.form.email ?? '')
      ? ''
      : 'Please enter a valid email address.';
  }

  validatePhone() {
    this.errors.phone = isValidPhone(this.form.phone ?? '')
      ? ''
      : 'Only digits or a leading + country code are allowed.';
  }

  isFormValid() {
    return (
      (this.form.name ?? '').trim() !== '' &&
      (this.form.email ?? '').trim() !== '' &&
      (this.form.phone ?? '').trim() !== '' &&
      !this.errors.name &&
      !this.errors.email &&
      !this.errors.phone
    );
  }

  async save() {
    this.validateName();
    this.validateEmail();
    this.validatePhone();

    if (!this.isFormValid()) return;

    await this.db.updateContact(this.contact.id, {
      name: this.form.name!,
      email: this.form.email!,
      phone: this.form.phone!
    });

    this.saved.emit();
  }

  async delete() {
    await this.db.deleteContact(this.contact.id);
    this.deleted.emit();
  }
}
