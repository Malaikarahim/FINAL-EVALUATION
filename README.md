# Library Management System

A role-based Library Management System built with Angular, made as a college/team project. Admins can manage the book catalog, members, and issuing/returning of books. Members can browse books, request to borrow them, and check their own borrowing history.

This is a frontend-only project — there's no real backend server. It uses `angular-in-memory-web-api` to fake a REST API in the browser, so the app runs completely on its own without needing to set up a database or backend.

---

## Team

This project was built by a team, split by module. Each person worked on their part in a separate git branch.

| Member | Module | Branch |
|---|---|---|
| Member 1 | Auth + Dashboard | `feature/auth-dashboard` |
| Member 2 | Books | `feature/books` |
| **Member 3** | **Members (this part)** | **`feature/members`** |
| Member 4 | Borrow / Requests | `feature/borrow-requests` |

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Login / Demo Accounts](#login--demo-accounts)
- [What Each Role Can Do](#what-each-role-can-do)
- [Project Structure](#project-structure)
- [How the App is Organized](#how-the-app-is-organized)
- [Modules](#modules)
- [Models](#models)
- [Services](#services)
- [Guards](#guards)
- [Interceptors](#interceptors)
- [Fake Backend (In-Memory API)](#fake-backend-in-memory-api)
- [Routes](#routes)
- [Things Worth Mentioning](#things-worth-mentioning)
- [Scripts](#scripts)
- [Still To Do / Known Issues](#still-to-do--known-issues)

---

## Tech Stack

- Angular 18 (regular NgModules, not standalone components)
- TypeScript
- RxJS (Observables, mainly for HTTP calls)
- Angular Reactive Forms for all forms
- `HttpClient` for API calls
- `angular-in-memory-web-api` to fake the backend
- Route Guards for login + role checks
- Plain CSS, no UI library like Bootstrap or Material

---

## Setup

```bash
npm install
npm start
```

Runs on `http://localhost:4200`. That's it — no `.env`, no database setup, nothing else needed. The fake backend seeds itself with sample data the first time you run it.

If port 4200 is already used, Angular CLI will ask to use a different port, just say yes.

---

## Login / Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@library.com | admin123 |
| Member | member@library.com | member123 |

There are buttons on the login page to auto-fill these so you don't have to type them every time while testing.

---

## What Each Role Can Do

**Admin**
- Add/edit/delete books
- Add/edit/delete members
- Issue and return books
- Approve/reject requests from members
- See overall stats on the dashboard

**Member**
- View the book catalog
- Request to borrow a book
- Request a new book to be added
- See their own borrow history
- See a basic dashboard

Members cannot open the Members management page even if they type the URL directly — it's blocked by a guard (explained below).

---

## Project Structure

```
src/app/
├── auth/                 login page
├── dashboard/             dashboard/home page after login
├── books/                 book catalog (list + add/edit form)
├── members/               member management (list + add/edit form)  ← my part
├── borrow/                issue/return books, borrow requests
├── requests/              member requests (new book requests etc)
├── shared/                header, sidebar, footer, toast, spinner, confirm dialog, filterBy pipe
├── services/               all the services (API calls)
├── guards/                 auth.guard.ts, role.guard.ts
├── interceptors/           auth, loading, error interceptors
├── models/                 TypeScript interfaces for Book, Member, User, etc
├── app.module.ts
└── app-routing.module.ts
```

Each folder like `books`, `members`, `borrow` etc is its own Angular module, lazy loaded — meaning it only gets downloaded when you actually go to that page.

---

## How the App is Organized

- Every feature (auth, dashboard, books, members, borrow, requests) is a separate module with its own routing file. This was mainly done so each of us could work on our own module without messing with each other's code and causing merge conflicts.
- All pages after login are wrapped inside a layout component (`MainLayoutComponent`) that has the header, sidebar and footer. Login page doesn't use this layout since it doesn't need the sidebar.
- Components don't call the API directly — every module has a service (like `MemberService`, `BookService`) that handles the actual HTTP calls. Components just call methods on the service.
- Common stuff used everywhere (toast messages, loading spinner, confirm popup, header/sidebar, the search pipe) lives in a `SharedModule` so we don't repeat code in every module.

---

## Modules

### Auth
Login page. Simple email + password form using Reactive Forms, with validation (required, valid email, min 6 characters for password). On login, it calls the API, stores a token in `sessionStorage`, and redirects to the dashboard.

### Dashboard
Landing page after login. Shows some basic stats depending on role (total books, total members, active borrows etc for admin).

### Books
- List page with all books, shows title, author, genre, quantity, and how many are available
- Add/Edit page (same component used for both — checks if there's an `id` in the URL to know which mode it's in)
- Search box to filter the list live

### Members — my part
This is the module I built. Full details:

- **Member List page** — table of all members with a search box that filters by name/email as you type (no search button, updates live). Delete asks for confirmation first before actually deleting.
- **Member Form page** — used for both Add Member and Edit Member. Same component, it just checks the route to know if it should add a new member or edit an existing one (existing member's data gets pre-filled automatically using `patchValue`).
- Form validation:
  - Name — required
  - Email — required, must be valid email format
  - Phone — required, must be exactly 10 digits
- Only admins can access these pages — regular members get redirected if they try.

### Borrow
- Shows all borrow records (who borrowed what, issue date, due date, return date, status)
- Overdue is calculated on the frontend by comparing due date with today's date
- Members can request to borrow a book, admin approves/rejects it
- When a book is issued or returned, the available count on that book updates automatically

### Requests
- Members can request a new book be added to the library
- Admin can approve or reject these requests

---

## Models

These are just TypeScript interfaces that define what fields each object should have. Helps catch mistakes early (like a missing field) before even running the app.

```typescript
// member.model.ts
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
}
```

```typescript
// book.model.ts
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  quantity: number;
  available: number;
}
```

```typescript
// user.model.ts
export type UserRole = 'admin' | 'member';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
```

```typescript
// borrow-record.model.ts
export interface BorrowRecord {
  id: number;
  bookId: number;
  bookTitle: string;
  memberId: number;
  memberName: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'Issued' | 'Returned' | 'Overdue';
}
```

(There are a couple more for borrow requests and book requests, same idea.)

---

## Services

Each module has its own service that talks to the API. All in `src/app/services/`.

| Service | What it's for |
|---|---|
| `AuthService` | login, logout, checking who's logged in and their role |
| `BookService` | CRUD for books |
| `MemberService` | CRUD for members |
| `BorrowService` | issuing/returning books |
| `BorrowRequestService` | borrow requests from members |
| `BookRequestService` | new book requests from members |
| `ToastService` | shows success/error popup messages |
| `LoadingService` | controls the loading spinner |

Example (Member service):

```typescript
@Injectable({ providedIn: 'root' })
export class MemberService {
  private baseUrl = '/api/members';
  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> { return this.http.get<Member[]>(this.baseUrl); }
  getMember(id: number): Observable<Member> { return this.http.get<Member>(`${this.baseUrl}/${id}`); }
  addMember(member: Partial<Member>) { return this.http.post<Member>(this.baseUrl, member); }
  updateMember(member: Member) { return this.http.put<Member>(`${this.baseUrl}/${member.id}`, member); }
  deleteMember(id: number) { return this.http.delete(`${this.baseUrl}/${id}`); }
}
```

---

## Guards

Two guards in `src/app/guards/`:

- **`auth.guard.ts`** — checks if the user is logged in at all. If not, redirects to the login page (and remembers where they were trying to go, so it can send them back after login).
- **`role.guard.ts`** — checks if the logged-in user has the right role for that page. Used on the Members routes so only admins can get in. If a member tries, they get sent to the dashboard instead.

```typescript
// role.guard.ts (simplified)
canActivate(route): boolean | UrlTree {
  const allowedRoles = route.data['roles'];
  const role = this.auth.getRole();
  if (!allowedRoles || (role && allowedRoles.includes(role))) {
    return true;
  }
  return this.router.createUrlTree(['/dashboard']);
}
```

---

## Interceptors

Three of them, in `src/app/interceptors/`, they run automatically on every HTTP request:

- **`auth.interceptor.ts`** — attaches the login token to every outgoing request
- **`loading.interceptor.ts`** — turns the loading spinner on/off automatically whenever a request is happening
- **`error.interceptor.ts`** — if any request fails, this catches it and shows an error toast, so we don't have to write try/catch in every component

---

## Fake Backend (In-Memory API)

Since we didn't build a real backend, `in-memory-data.service.ts` fakes one using `angular-in-memory-web-api`. It stores data in the browser (localStorage) and responds to requests like `/api/members`, `/api/books` etc exactly like a real API would, including a small artificial delay so you can actually see the loading spinner working.

It seeds some starting data (a couple of books, members, and the two demo users) the first time you run the app.

Because all the services are already written the normal way (using `HttpClient` and REST-style URLs), if we ever connect a real backend later, we'd just change the base URLs — nothing else in the components would need to change.

---

## Routes

| Route | Who can access |
|---|---|
| `/auth/login` | anyone |
| `/dashboard` | any logged-in user |
| `/books` | any logged-in user (only admin sees edit/delete buttons) |
| `/books/new`, `/books/:id/edit` | admin |
| `/members` | admin only |
| `/members/new`, `/members/:id/edit` | admin only |
| `/borrow` | any logged-in user |
| `/requests` | any logged-in user |

Anything not matching these redirects back to the dashboard.

---

## Things Worth Mentioning

- Delete (for both books and members) always asks for confirmation first, doesn't delete on first click.
- Search boxes filter live as you type, no need to press a button.
- Add and Edit use the same form component everywhere in the app (Books and Members both do this) — saves writing the same form twice.
- Error messages on forms only show up after you try to submit, not while you're still typing.
- Login session is stored in `sessionStorage`, not `localStorage`, so it clears out when you close the tab (not permanent).

---

## Scripts

```bash
npm start      # run dev server
npm run build  # production build
npm test       # run unit tests
```

---

## Still To Do / Known Issues

- No real backend — everything resets if you clear browser storage
- Member "Profile" / "Member Details" view (read-only page with borrow history) not built yet, currently the Edit form is the closest thing to it
- Same for a "Student Profile" page where a member could view their own profile — not built yet
- Fine calculation for overdue books is in the data model but not actually calculated or shown anywhere yet
- No forgot password option, only the two demo logins work right now
- Not much mobile responsiveness testing done yet
