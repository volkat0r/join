import { CONTACT_COLORS } from './../../core/constants/colors';
import { ContactsDb, Contact } from './../../core/db/contacts.db';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-add-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-add-form.html'
})
export class ContactAddFormComponent {

  db = inject(ContactsDb);

  @Output() added = new EventEmitter<void>();

  // Wichtig: Typ exakt definieren
  form: Omit<Contact, 'id' | 'color'> = {
    name: '',
    email: '',
    phone: ''
  };

  private getRandomColor() {
    const index = Math.floor(Math.random() * CONTACT_COLORS.length);
    return CONTACT_COLORS[index];
  }

  async submit() {
    await this.db.setContact({
      ...this.form,
      color: this.getRandomColor()
    });

    this.added.emit();
  }
}
