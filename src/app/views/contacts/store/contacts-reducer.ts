import { Contact } from '@app/core/models';
import {EntityState, createEntityAdapter} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {
  createSuccess,
  loadAllSuccess,
  loadSuccess, removeSuccess,
  updateSuccess
} from '@app/contacts-store/contacts-actions';

// This adapter will allow is to manipulate contacts (mostly CRUD operations)
export const contactsAdapter = createEntityAdapter<Contact>({
  selectId: (contact: Contact) => contact.id,
  sortComparer: false
});

// -----------------------------------------
// The shape of EntityState
// ------------------------------------------
// interface EntityState<Contact> {
//   ids: string[] | number[];
//   entities: { [id: string]: Contact };
// }
// -----------------------------------------
// -> ids arrays allow us to sort data easily
// -> entities map allows us to access the data quickly without iterating/filtering though an array of objects

export interface State extends EntityState<Contact> {
  // additional props here
}

export const INIT_STATE: State = contactsAdapter.getInitialState({
  // additional props default values here
});

export const reducer = createReducer<State>(
  INIT_STATE,
  // on(loadAllSuccess, (state, {contacts}) =>
  //   contactsAdapter.addAll(contacts, state)
  // ),
//   on(loadSuccess, (state, {contact}) =>
//     contactsAdapter.upsertOne(contact, state)
//   ),
  on(createSuccess, (state, {contact}) =>
    contactsAdapter.addOne(contact, state)
  ),
//   on(updateSuccess, (state, {contact}) =>
//     contactsAdapter.updateOne({id: contact.id, changes: contact}, state)
//   ),
  on(removeSuccess, (state, {id}) =>
    contactsAdapter.removeOne(id, state)
  )
);

export interface NewState {
  totalPages: number
  totalItems: number
  pages: Record<number, Contact['id'][]>
  data: Record<Contact['id'], Contact>
}

const INIT_STATE_NEW: NewState = {
  totalItems: 0, 
  totalPages: 0,
  pages: {},
  data: {}
}

export const newReducer = createReducer(
  INIT_STATE_NEW, 
  on(loadAllSuccess, (state, {contacts}) => {
 
    const newData: Record<Contact['id'], Contact> = contacts.data.reduce((acc, cur) => {
        acc[cur.id] = cur
        return acc
    } , {})
    return {
      ...state,
      totalItems: contacts.total,
      totalPages: contacts.total_pages,
      pages: {
        ...state.pages,
        [contacts.page]: contacts.data.map((cur) => cur.id)
      },
      data: {
        ...state.data,
        ...newData,
      }
    }
  }),
  on(loadSuccess, (state, {contact}) => {
    return {
      ...state,
      data: {
        ...state.data,
        [contact.id]: contact
      }
    }
  }),
  on(updateSuccess, (state, {contact}) => {
    return {
      ...state,
      data: {
        ...state.data,
        [contact.id]: {
          ...state.data[contact.id],
          ...contact
        }
      }
    }
  })
)

export const getContactById = (id: number) => (state: State) => state.entities[id];
