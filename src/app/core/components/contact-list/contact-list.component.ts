import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Contact } from '@app/core/models';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListComponent implements OnInit {


  @Input() contacts: Contact[];
  @Input() curPage: number;
  @Input() totalPages: number;
  @Output() edit = new EventEmitter<Contact>();
  @Output() show = new EventEmitter<Contact>();
  @Output() remove = new EventEmitter<Contact>();
  @Output() goToPage = new EventEmitter<number>();

  contactsTrackByFn = (index: number, contact: Contact) => contact.id;

  constructor() {}

  ngOnInit() {}

  changePage(page: number) {
    this.goToPage.emit(page)
  }

  showDetails(contact: Contact) {
    this.show.emit(contact);
  }

  editContact(contact: Contact) {
    this.edit.emit(contact);
  }

  deleteContact(contact: Contact) {
    this.remove.emit(contact);
  }

}
