import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Contact } from '@app/core/models';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ContactListComponent implements OnInit {


  @Input() contacts: Contact[];
  @Input() curPage: number;
  @Input() totalPages: number;
  @Input() filter: string;
  @Output() edit = new EventEmitter<Contact>();
  @Output() show = new EventEmitter<Contact>();
  @Output() remove = new EventEmitter<Contact>();
  @Output() goToPage = new EventEmitter<number>();

  contactsTrackByFn = (index: number, contact: Contact) => contact.id;

  constructor() {}

  ngOnInit() {}

  filteredContent(content: string) {
    const startIndex = content.toLowerCase().indexOf(this.filter)
    
    if (startIndex === -1) return content

    return content.slice(0, startIndex) + 
          "<span class=\"highlight\">" + 
          content.slice(startIndex, startIndex + this.filter.length) + 
          "</span>" + 
          content.slice(startIndex + this.filter.length)
  }

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
