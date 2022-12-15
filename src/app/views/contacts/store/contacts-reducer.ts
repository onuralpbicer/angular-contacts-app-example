import { Contact } from '@app/core/models';
import {createReducer, on} from '@ngrx/store';
import {
  createSuccess,
  loadAllSuccess,
  loadSuccess, removeSuccess,
  updateSuccess
} from '@app/contacts-store/contacts-actions';
 

export interface State {
  totalPages: number
  totalItems: number
  pages: Record<number, Contact['id'][]>
  data: Record<Contact['id'], Contact>
}

const INIT_STATE: State = {
  totalItems: 0, 
  totalPages: 0,
  pages: {},
  data: {}
}

export const reducer = createReducer(
    INIT_STATE, 
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
  on(createSuccess, (state, {contact}) => {
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
  }),
  on(removeSuccess, (state, {id}) => {
    const {[id]:_, ...rest} = state.data

    const newPages: Record<number, Contact['id'][]> = {}
    const pages = Object.entries(state.pages)

    for (const [page, content] of pages) {
        newPages[page] = content.filter((item) => item !== id)
    }

    return {
        ...state,
        data: rest,
        pages: newPages
    }
  })
)
