export interface BookRequest {
  id: number;
  title: string;
  author?: string;
  reason?: string;
  memberId: number;
  memberName: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}