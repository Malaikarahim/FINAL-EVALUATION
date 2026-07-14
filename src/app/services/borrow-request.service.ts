import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BorrowRequest } from '../models/borrow-request.model';

@Injectable({ providedIn: 'root' })
export class BorrowRequestService {
  private baseUrl = '/api/borrowrequests';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<BorrowRequest[]> {
    return this.http.get<BorrowRequest[]>(this.baseUrl);
  }

  addRequest(request: Partial<BorrowRequest>): Observable<BorrowRequest> {
    return this.http.post<BorrowRequest>(this.baseUrl, request);
  }

  updateRequest(request: BorrowRequest): Observable<BorrowRequest> {
    return this.http.put<BorrowRequest>(`${this.baseUrl}/${request.id}`, request);
  }

  deleteRequest(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}