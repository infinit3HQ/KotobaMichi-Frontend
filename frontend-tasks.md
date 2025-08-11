# Project: JLPT N5 Vocabulary & Quiz App - Frontend Tasks

## 1. Core Setup & Configuration
- [x] Initialize React project using Vite.
- [x] Install and configure Tailwind CSS.
- [x] Install and set up `shadcn/ui` CLI.
- [x] Add core `shadcn/ui` components.
- [x] Set up `@tanstack/react-router` for client-side routing.
- [x] Install `axios` for API requests and `zod` for form validation.
- [x] Install `@tanstack/react-query` for server state management.

---

## 2. Layout & Routing
- [x] **Component:** Create a main `Layout` component with a persistent `Navbar` and a `Footer`.
- [x] **Routing:** Configure routes using TanStack Router:
  - `/`: Home/Flashcards view
  - `/login`: Login Page
  - `/register`: Registration Page
  - `/quizzes`: Quiz List Page
  - `/quizzes/create`: Custom Quiz Creation Page
  - `/quizzes/:id`: Quiz Taking Page
  - `/results/:attemptId`: Quiz Results Page
  - `/dashboard`: Admin Dashboard (Protected Route)
  - `/profile`: User Profile Page (Protected Route)
- [x] **Component:** Create `ProtectedRoute` component to handle auth-only and admin-only routes.

---

## 3. Authentication
- [x] **State:** Create an auth context or Zustand store to manage user state and JWT token.
- [x] **Page:** Build `LoginPage` with a form (`react-hook-form`, `zod`, `shadcn/ui Form`) to call `POST /auth/login`.
- [x] **Page:** Build `RegisterPage` with a form to call `POST /auth/register`.
- [x] **Logic:** On successful login, store JWT in local storage and update auth state.
- [x] **Logic:** Set up an `axios` interceptor to attach the JWT to all outgoing requests.

---

## 4. Core Features & Pages
- [x] **Flashcards Page (`/`)**
  - **Component:** `Flashcard` component with flip animation (CSS transform).
  - **Component:** `WordList` component to fetch data from `GET /words` using `react-query`.
  - **UI:** Implement search and filter functionality.
  - **UI:** Display words in a grid layout.

- [x] **Quiz Pages (`/quizzes/*`)**
  - **Page:** `QuizListPage` to display two lists: general quizzes (`GET /quizzes`) and user's custom quizzes (`GET /quizzes/my-quizzes`).
  - **Page:** `QuizCreationPage` to allow users to select words from the master list and create a custom quiz via `POST /quizzes`.
  - **Page:** `QuizTakingPage` to fetch quiz data (`GET /quizzes/:id`) and present questions one by one.
  - **Page:** `QuizResultsPage` to display score and correct/incorrect answers after submitting to `POST /quizzes/:id/submit`.

- [x] **Profile Page (`/profile`)**
  - **UI:** Display user information (`GET /users/me`).
  - **UI:** Display a list of past quiz attempts and scores (`GET /users/me/attempts`).

---

## 5. Admin Dashboard (`/dashboard`)
- [x] **Route:** Protect this route for `ADMIN` roles only.
- [x] **Vocabulary Management Tab**
  - **UI:** Table to display all words from `GET /words`.
  - **Component:** A `Dialog`/`Form` to add a new word (`POST /words`).
  - **Functionality:** Buttons for editing (`PATCH /words/:id`) and deleting (`DELETE /words/:id`) in each table row.
- [x] **Quiz Management Tab**
  - **UI:** Table to display all general (public) quizzes.
  - **Component:** A `Dialog`/`Form` to create general quizzes (edit not available in API yet).

---

-## 6. Finalization & Deployment
- [x] Ensure all API calls handle loading and error states gracefully.
- [x] Implement responsive design for all pages using Tailwind's breakpoints.
- [ ] Perform component testing with Vitest and React Testing Library.
- [ ] Prepare the application for deployment (e.g., create a Vercel/Netlify configuration).