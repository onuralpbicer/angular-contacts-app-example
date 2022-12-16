import { Observable, of } from 'rxjs';
import { Contact, PaginatedResponse } from '@app/core/models';


export class ContactsServiceMock {

  contacts = [{
    id: 1,
    first_name: 'john',
    last_name: 'doe',
    email: 'john@gmail.com'
  }, {
    id: 2,
    first_name: 'adam',
    last_name: 'smith',
    email: 'adam@gmail.com'
  }];

  index(): Observable<PaginatedResponse<Contact>[]> {
   return of([{
      page: 1,
      per_page: 6,
      total: 1,
      total_pages: 1,
      data: [{
        id: 1,
        first_name: 'john',
        last_name: 'doe',
        email: 'john@gmail.com'
      }]
    }]
   );
  }

  show(conactId: number): Observable<Contact> {
    return of({
      id: 1,
      first_name: 'john',
      last_name: 'doe',
      email: 'john@gmail.com'
    });
  }

  create(contact: Contact) {
    return of({
      id: 4,
      name: 'john doe',
      email: 'john@gmail.com'
    });
  }

  destroy(id: number): Observable<number> {
    return of(1);
  }

  update(contact: Contact): Observable<Contact> {
    return of(contact);
  }

}
