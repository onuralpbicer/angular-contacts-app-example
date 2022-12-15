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
  curPage$: Observable<number>;
  totalPages$: Observable<number>;

  constructor(private store: Store<{contacts: fromContacts.ContactsState}>, private route: ActivatedRoute) {
    this.curPage$ = this.route.queryParams.pipe(
        map((params) => Number(params.page ?? 1))
    )

    this.contacts$ = combineLatest([this.store, this.curPage$]).pipe(
        map(([state, curPage]) => {
            const page = state.contacts.contacts2.pageContents[curPage]
            if (!page) return []
            return page.map((item) => state.contacts.contacts2.data[item])
        })
    )

    this.totalPages$ = this.store.select((state) => state.contacts.contacts2.totalPages)
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
      select((state) => state.contacts.contacts2.data[id])
    )
  }
}
