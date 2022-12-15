import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '@app/core/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactsStoreFacade } from '@app/contacts-store/contacts.store-facade';
import { Observable, Subscription } from 'rxjs'


@Component({
  selector: 'app-contacts-index',
  templateUrl: './contacts-index.component.html',
  styleUrls: ['./contacts-index.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsIndexComponent implements OnInit, OnDestroy {

  contacts$ = this.contactsFacade.contacts$;

  private pageNumSubscription: Subscription;

  constructor(private contactsFacade: ContactsStoreFacade, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.pageNumSubscription = this.contactsFacade.curPage$.subscribe((page) => {
        this.contactsFacade.loadPage(page)
    })
  }

  ngOnDestroy(): void {
    this.pageNumSubscription.unsubscribe()
  }

  goToPage(page: number) {
    const queryParams: Params = { page };

    this.router.navigate([],  
        {
          relativeTo: this.activatedRoute,
          queryParams: queryParams, 
          queryParamsHandling: 'merge', // remove to replace all query params by provided
        })
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
