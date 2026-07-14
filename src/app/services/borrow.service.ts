import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BorrowRecord } from '../models/borrow-record.model';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  private baseUrl = '/api/borrowrecords';

  constructor(private http: HttpClient) {}

  // ===========================
  // API METHODS
  // ===========================

  getRecords(): Observable<BorrowRecord[]> {
    return this.http.get<BorrowRecord[]>(this.baseUrl);
  }

  issueBook(record: Partial<BorrowRecord>): Observable<BorrowRecord> {
    return this.http.post<BorrowRecord>(this.baseUrl, record);
  }

  returnBook(record: BorrowRecord): Observable<BorrowRecord> {
    return this.http.put<BorrowRecord>(
      `${this.baseUrl}/${record.id}`,
      record
    );
  }

  // ===========================
  // HELPER METHODS
  // ===========================

  getIssuedRecords(records: BorrowRecord[]): BorrowRecord[] {
    return records.filter(record => record.status === 'Issued');
  }

  getReturnedRecords(records: BorrowRecord[]): BorrowRecord[] {
    return records.filter(record => record.status === 'Returned');
  }

  getOverdueRecords(records: BorrowRecord[]): BorrowRecord[] {

    const today = new Date().toISOString().slice(0, 10);
           return records.filter(record =>
             record.status !== 'Returned' &&
          record.dueDate < today
           );

  }

  getBorrowedCount(records: BorrowRecord[]): number {

    return this.getIssuedRecords(records).length +
           this.getOverdueRecords(records).length;

  }

  getReturnedCount(records: BorrowRecord[]): number {

    return this.getReturnedRecords(records).length;

  }

  getOverdueCount(records: BorrowRecord[]): number {

    return this.getOverdueRecords(records).length;

  }

  getMemberBorrowRecords(
    records: BorrowRecord[],
    memberId: number
  ): BorrowRecord[] {

    return records.filter(record =>
      record.memberId === memberId &&
      record.status !== 'Returned'
    );

  }

  getMemberOverdueRecords(
    records: BorrowRecord[],
    memberId: number
  ): BorrowRecord[] {

    const today = new Date();

    return records.filter(record =>

      record.memberId === memberId &&

      record.status !== 'Returned' &&

      new Date(record.dueDate) < today

    );

  }

  calculateFine(record: BorrowRecord): number {

    if (record.returnDate) {
      return record.fine;
    }

    const today = new Date();
    const due = new Date(record.dueDate);

    const diff = Math.floor(
      (today.getTime() - due.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    return diff > 0 ? diff * 2 : 0;

  }

}