import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Contact,  PaginatedResponse} from '@app/core/models';
import {environment} from '@app/env';


@Injectable()
export class ContactsService {

  constructor(private http: HttpClient ) { }


  index(page: number): Observable<PaginatedResponse<Contact>> {
    const params = new URLSearchParams({page: page.toString()})
    return this.http
        .get<PaginatedResponse<Contact>>(`${environment.appApi.baseUrl}/users` + "?" + params);
  }

  show(conactId: number): Observable<Contact> {
    return this.http
        .get<Contact>(`${environment.appApi.baseUrl}/contacts/${conactId}`);
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${environment.appApi.baseUrl}/contacts`, contact);
  }

  update(contact: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${environment.appApi.baseUrl}/contacts/${contact.id}`, contact);
  }


  destroy(id: number): Observable<Contact> {
    return this.http.delete<Contact>(`${environment.appApi.baseUrl}/contacts/${id}`);
  }

}
