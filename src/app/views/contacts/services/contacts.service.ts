import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Contact,  PaginatedResponse} from '@app/core/models';
import {environment} from '@app/env';
import { map } from 'rxjs/operators'


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
        .get<{data: Contact}>(`${environment.appApi.baseUrl}/users/${conactId}`).pipe(map((res) => res.data));
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${environment.appApi.baseUrl}/users`, contact);
  }

  update(contact: Partial<Contact>): Observable<Contact> {
    return this.http.patch<Contact>(`${environment.appApi.baseUrl}/users/${contact.id}`, contact);
  }


  destroy(id: number): Observable<Contact> {
    return this.http.delete<Contact>(`${environment.appApi.baseUrl}/contacts/${id}`);
  }

}
