export type BorrowRequestType = 'Borrow' | 'Return';
export type BorrowRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface BorrowRequest {
  id: number;
  type: BorrowRequestType;
  bookId: number;
  bookTitle: string;
  memberId: number;
  memberName: string;
  requestDate: string;
  issueDate?: string;
  dueDate?: string;
  borrowRecordId?: number;
  status: BorrowRequestStatus;
}