import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '@app/core/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsStoreFacade } from '@app/contacts-store/contacts.store-facade';
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-contacts-index',
  templateUrl: './contacts-index.component.html',
  styleUrls: ['./contacts-index.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsIndexComponent implements OnInit, OnDestroy {

  contacts$ = this.contactsFacade.contacts$;

  private pageNumSubscription: Subscription;

  constructor(private contactsFacade: ContactsStoreFacade, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.pageNumSubscription = this.route.queryParams
        .pipe(
            map((params) => Number(params.page ?? 1))
        )
        .subscribe((page) => {
            this.contactsFacade.loadPage(page)
        })
  }

  ngOnDestroy(): void {
    this.pageNumSubscription.unsubscribe()
  }

  editContact(contact: Contact) { 
    this.router.navigate(['/contacts', contact.id, 'edit']);
  }

  showContact(contact: Contact) {
    this.router.navigate(['/contacts', contact.id]);
  }

  deleteContact(contact: Contact) {
    const r = confirm('Are you sure?');
    if (r) {
      this.contactsFacade.deleteContact(contact.id);
    }
  }
}
