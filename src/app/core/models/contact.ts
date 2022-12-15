export interface Contact {
  id?: number;
  email: string;
  first_name: string
  last_name: string
  avatar?: string
}

export interface Contact2 {
  id?: number;
  email: string;
  first_name: string
  last_name: string
  avatar?: string
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
}