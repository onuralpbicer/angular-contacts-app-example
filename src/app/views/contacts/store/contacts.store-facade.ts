import { Injectable } from '@angular/core';
import * as fromContacts from '@app/contacts-store';
import { select, Store } from '@ngrx/store';

import { Contact } from '@app/core/models';
import {create, load, loadAll, remove, update} from '@app/contacts-store/contacts-actions';
import { combineLatest, Observable } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs/operators'

@Injectable()
export class ContactsStoreFacade {

  contacts$: Observable<Contact[]>

  constructor(private store: Store<{contacts: fromContacts.ContactsState}>, private route: ActivatedRoute) {
    const currentPage = this.route.queryParams.pipe(
        map((params) => Number(params.page ?? 1))
    )

    this.contacts$ = combineLatest([this.store, currentPage]).pipe(
        map(([state, page]) => {
            return state.contacts.contacts2.data[page]
        })
    )
  }

  loadPage(page: number) {
    this.store.dispatch(loadAll({page}))
  }

  loadContact(id: number) {
    this.store.dispatch(load({id}));
  }

  createContact(contact: Contact) {
    this.store.dispatch(create({contact}));
  }

  updateContact(contact: Contact) {
    this.store.dispatch(update({contact}));
  }

  deleteContact(id: number) {
    this.store.dispatch(remove({id}));
  }

  getContactById(id: number) {
    return this.store.pipe(
      select(fromContacts.getContactById(id))
    )
  }
}
