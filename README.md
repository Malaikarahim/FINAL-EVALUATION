# Bindery — Library Management System

An Angular capstone project: a role-based Library Management System where admins manage
books, members, and circulation, and members can view their borrowing activity.

## Tech stack

- Angular 18 (NgModules, not standalone components)
- TypeScript, RxJS
- Reactive Forms with validation
- `HttpClient` + `angular-in-memory-web-api` (simulated REST backend, no server required)
- JWT-style token simulation (stored in `sessionStorage`), Route Guards, HTTP Interceptors

## Getting started

```bash
npm install
npm start
```

The app runs at `http://localhost:4200`. There is no real backend — all data is served by
an in-memory API (`src/app/services/in-memory-data.service.ts`) so the whole system works
out of the box.

## Demo accounts

| Role   | Email               | Password    |
|--------|----------------------|-------------|
| Admin  | admin@library.com    | admin123    |
| Member | member@library.com   | member123   |

The login screen has one-click buttons to fill either demo account.

## Roles

- **Admin**: full access — add/edit/delete books, manage members, issue and return books.
- **Member**: can view the book catalog and dashboard, and see borrow/return records, but
  cannot manage members or edit the catalog. Member-only-protected routes are enforced by
  `RoleGuard` using route `data.roles`.

## Project structure

```
src/app/
├── auth/          Login, JWT simulation
├── dashboard/      Overview stats + recent activity
├── books/          Book CRUD + search
├── members/        Member CRUD + search (admin only)
├── borrow/          Issue / return workflow, overdue detection
├── shared/          Header, sidebar, footer, layout shell, toast, spinner,
│                    confirm dialog, filterBy pipe
├── services/        Auth, Book, Member, Borrow, Toast, Loading, in-memory data
├── guards/          AuthGuard, RoleGuard
├── interceptors/     Auth (JWT header), Loading, Error → Toast
└── models/          Book, Member, BorrowRecord, User interfaces
```

## Notable implementation details

- **Overdue detection**: computed client-side in `BorrowListComponent` by comparing each
  record's due date against today; the dashboard also surfaces an overdue count.
- **Book availability**: issuing/returning a book automatically increments/decrements the
  book's `available` count via `BookService.updateBook`.
- **Search & filter**: the `filterBy` pipe (RxJS-friendly, pure) filters books/members by
  the fields you pass it, live as you type.
- **Notifications**: `ToastService` + `ErrorInterceptor` surface success/error toasts
  app-wide without components needing to know about each other.

## Building for production

```bash
npm run build
```

Output is written to `dist/library-management-system`.
