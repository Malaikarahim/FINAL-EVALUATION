import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookRequest } from '../models/book-request.model';

@Injectable({ providedIn: 'root' })
export class BookRequestService {
  private baseUrl = '/api/bookrequests';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<BookRequest[]> {
    return this.http.get<BookRequest[]>(this.baseUrl);
  }

  addRequest(request: Partial<BookRequest>): Observable<BookRequest> {
    return this.http.post<BookRequest>(this.baseUrl, request);
  }

  updateRequest(request: BookRequest): Observable<BookRequest> {
    return this.http.put<BookRequest>(`${this.baseUrl}/${request.id}`, request);
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}