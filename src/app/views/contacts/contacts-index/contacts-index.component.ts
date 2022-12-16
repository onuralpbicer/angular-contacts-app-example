import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '@app/core/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactsStoreFacade } from '@app/contacts-store/contacts.store-facade';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'


@Component({
  selector: 'app-contacts-index',
  templateUrl: './contacts-index.component.html',
  styleUrls: ['./contacts-index.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsIndexComponent implements OnInit, OnDestroy, AfterViewInit {
  contacts$: Observable<Contact[]>;

  private pageNumSubscription: Subscription;

  searchField = new Subject<string>()

  filter$: Observable<string>

  constructor(private contactsFacade: ContactsStoreFacade, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() { 
    this.pageNumSubscription = this.contactsFacade.curPage$.subscribe((page) => {
        this.contactsFacade.loadPage(page)
    })

    this.filter$ = this.searchField.asObservable()
        .pipe(debounceTime(500), map((filter) => filter.toLowerCase()))

    this.contacts$ = combineLatest([
        this.contactsFacade.contacts$,
        this.filter$,
    ]).pipe(
        map(([contacts, filter ]) => {
          // no filter if it's less than 2 chars
          if (filter.length < 2)
            return contacts

          return contacts.filter((contact) => {
            if (contact.first_name.toLowerCase().includes(filter)) return true
            else if (contact.last_name.toLowerCase().includes(filter)) return true
            else if (contact.email.toLowerCase().includes(filter)) return true
            else if (contact.avatar.toLowerCase().includes(filter)) return true
            else return false
          })
        })
    )
  }

  ngAfterViewInit() {
     // this is required to make the combineLatest emit
    this.searchField.next('')
  }
  

  ngOnDestroy(): void {
    this.pageNumSubscription.unsubscribe()
  }

  onSearchChange(change: string) {
    this.searchField.next(change)
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
