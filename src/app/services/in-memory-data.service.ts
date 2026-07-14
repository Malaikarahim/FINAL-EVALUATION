import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

const STORAGE_KEY = 'library-db';

@Injectable({ providedIn: 'root' })
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // Ignore previously saved localStorage during development.
    // A fresh database is created every time the app starts.

    const users = [
  {
    id: 1,
    name: 'ABHISHEK RAY',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 1,
    name: 'RAVI NAIR',
    email: 'member@library.com',
    password: 'member123',
    role: 'member'
  }
];
const books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Software Engineering', quantity: 5, available: 4 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Software Engineering', quantity: 4, available: 4 },
  { id: 3, title: 'Design Patterns', author: 'Erich Gamma', genre: 'Software Engineering', quantity: 3, available: 3 },
  { id: 4, title: 'Atomic Habits', author: 'James Clear', genre: 'Self Help', quantity: 6, available: 5 },
  { id: 5, title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', quantity: 5, available: 5 },
  { id: 6, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', genre: 'Finance', quantity: 4, available: 4 },
  { id: 7, title: 'Think and Grow Rich', author: 'Napoleon Hill', genre: 'Self Help', quantity: 5, available: 5 },
  { id: 8, title: "Harry Potter and the Philosopher's Stone", author: 'J. K. Rowling', genre: 'Fantasy', quantity: 7, available: 6 },
  { id: 9, title: 'Harry Potter and the Chamber of Secrets', author: 'J. K. Rowling', genre: 'Fantasy', quantity: 5, available: 5 },
  { id: 10, title: 'The Hobbit', author: 'J. R. R. Tolkien', genre: 'Fantasy', quantity: 6, available: 6 },
  { id: 11, title: 'Wings of Fire', author: 'A. P. J. Abdul Kalam', genre: 'Biography', quantity: 5, available: 5 },
  { id: 12, title: 'Ignited Minds', author: 'A. P. J. Abdul Kalam', genre: 'Biography', quantity: 4, available: 4 },
  { id: 13, title: 'Ikigai', author: 'Francesc Miralles', genre: 'Lifestyle', quantity: 6, available: 6 },
  { id: 14, title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', quantity: 5, available: 5 },
  { id: 15, title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Finance', quantity: 6, available: 5 },
  { id: 16, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', quantity: 5, available: 5 },
  { id: 17, title: '1984', author: 'George Orwell', genre: 'Classic', quantity: 4, available: 4 },
  { id: 18, title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', quantity: 5, available: 4 },
  { id: 19, title: 'The Power of Habit', author: 'Charles Duhigg', genre: 'Self Help', quantity: 4, available: 4 },
  { id: 20, title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', quantity: 5, available: 5 }
];

    const members = [
  { id: 1, name: 'RAVI NAIR', email: 'member@library.com', phone: '9876543210', joinedDate: '2025-01-14' },
  { id: 2, name: 'ANANYA SEN', email: 'ananya.sen@mail.com', phone: '9812345678', joinedDate: '2025-03-02' },
  { id: 3, name: 'NANDINI DAS', email: 'nandini.das@mail.com', phone: '9900112233', joinedDate: '2025-05-19' },
  { id: 4, name: 'ABHISHEK RAY', email: 'abhishek.ray@mail.com', phone: '9001001001', joinedDate: '2025-06-01' },
  { id: 5, name: 'ROHAN SHARMA', email: 'rohan.sharma@mail.com', phone: '9001001002', joinedDate: '2025-06-05' },
  { id: 6, name: 'PRIYA VERMA', email: 'priya.verma@mail.com', phone: '9001001003', joinedDate: '2025-06-10' },
  { id: 7, name: 'AMAN KUMAR', email: 'aman.kumar@mail.com', phone: '9001001004', joinedDate: '2025-06-15' },
  { id: 8, name: 'SNEHA PATEL', email: 'sneha.patel@mail.com', phone: '9001001005', joinedDate: '2025-06-20' },
  { id: 9, name: 'ARJUN SINGH', email: 'arjun.singh@mail.com', phone: '9001001006', joinedDate: '2025-06-25' },
  { id: 10, name: 'NEHA GUPTA', email: 'neha.gupta@mail.com', phone: '9001001007', joinedDate: '2025-07-01' },
  { id: 11, name: 'VIKRAM MEHTA', email: 'vikram.mehta@mail.com', phone: '9001001008', joinedDate: '2025-07-05' },
  { id: 12, name: 'KAVYA REDDY', email: 'kavya.reddy@mail.com', phone: '9001001009', joinedDate: '2025-07-10' },
  { id: 13, name: 'RAHUL GUPTA', email: 'rahul.gupta@mail.com', phone: '9001001010', joinedDate: '2025-07-15' },
  { id: 14, name: 'POOJA SHARMA', email: 'pooja.sharma@mail.com', phone: '9001001011', joinedDate: '2025-07-20' },
  { id: 15, name: 'KARAN MALHOTRA', email: 'karan.malhotra@mail.com', phone: '9001001012', joinedDate: '2025-07-25' }
];

   const borrowrecords: any[] = [
  { id: 1, bookId: 1, bookTitle: 'Clean Code', memberId: 1, memberName: 'RAVI NAIR', issueDate: '2026-06-01', dueDate: '2026-06-15', returnDate: null, status: 'Overdue' },
  { id: 2, bookId: 4, bookTitle: 'Atomic Habits', memberId: 4, memberName: 'ABHISHEK RAY', issueDate: '2026-06-18', dueDate: '2026-07-02', returnDate: null, status: 'Issued' },
  { id: 3, bookId: 8, bookTitle: "Harry Potter and the Philosopher's Stone", memberId: 8, memberName: 'SNEHA PATEL', issueDate: '2026-06-25', dueDate: '2026-07-09', returnDate: null, status: 'Issued' },
  { id: 4, bookId: 11, bookTitle: 'Wings of Fire', memberId: 6, memberName: 'PRIYA VERMA', issueDate: '2026-05-10', dueDate: '2026-05-24', returnDate: '2026-05-22', status: 'Returned' },
  { id: 5, bookId: 15, bookTitle: 'The Psychology of Money', memberId: 10, memberName: 'NEHA GUPTA', issueDate: '2026-06-05', dueDate: '2026-06-19', returnDate: null, status: 'Overdue' },
  { id: 6, bookId: 18, bookTitle: 'The Silent Patient', memberId: 12, memberName: 'KAVYA REDDY', issueDate: '2026-06-30', dueDate: '2026-07-14', returnDate: null, status: 'Issued' }
];

    const bookrequests: any[] = [];
    const borrowrequests: any[] = [];

    const db = { users, books, members, borrowrecords, bookrequests, borrowrequests };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

    return db;
  }

  genId<T extends { id: number }>(collection: T[]): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id)) + 1 : 1;
  }

  post(reqInfo: RequestInfo) {
    if (reqInfo.collectionName === 'login') {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) as { email: string; password: string };
      const db = reqInfo.utils.getDb() as any;
      const user = db.users.find(
        (u: any) => u.email === body.email && u.password === body.password
      );
      const options: any = { headers: reqInfo.headers, url: reqInfo.url };
      if (user) {
        const { password, ...safeUser } = user;
        const token = btoa(`${safeUser.email}:${Date.now()}`);
        options.status = 200;
        options.body = { token, user: safeUser };
      } else {
        options.status = 401;
        options.body = { message: 'Invalid email or password' };
      }
      return reqInfo.utils.createResponse$(() => options);
    }
    return undefined;
  }

  responseInterceptor(res: any, reqInfo: RequestInfo) {
    try {
      const db = reqInfo.utils.getDb() as any;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // fail silently
    }
    return res;
  }
}