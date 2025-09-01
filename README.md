# Live Search Buggy Starter

A Next.js live search application demo with TypeScript and TailwindCSS.

## Features

- Real-time search functionality
- Course database with filtering
- Responsive design
- TypeScript support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app router pages and API routes
- `components/` - React components
- `data/` - JSON data files
- `app/api/search/` - Search API endpoint

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Hooks

## API Endpoints

- `GET /api/search?q=term` - Search for courses

## Development

The search functionality includes:
- Live search as you type
- Course filtering by title, description, and category
- Loading states and error handling
- Responsive UI with TailwindCSS

## Bug Fixes and Improvements

This project was refactored to fix critical bugs, security vulnerabilities, and bad coding practices. The following changes were implemented:

###  Frontend (`components/Search.tsx`)

- **Critical Bug Fixes**:
  - **React Key Prop**: Fixed a bug where `Math.random()` was used as a React key, causing unnecessary re-renders. Replaced with a stable `id`.
  - **Infinite Loop**: Removed an infinite loop in a `useEffect` hook caused by a circular dependency.
  - **Memory Leak**: Added a cleanup function to a `setTimeout` to prevent memory leaks.
- **Performance**:
  - **Debouncing**: Added a 300ms debounce to the search input to reduce the number of API calls during typing.
- **Hydration Error**:
  - Fixed a Next.js hydration error by moving a client-side-only calculation (`Math.random()`) into a `useEffect` hook, ensuring it only runs on the client.
- **Code Quality & Best Practices**:
  - **Code Organization**: Extracted the `useDebounce` hook and `SearchResult` type into separate `hooks/` and `types/` directories for reusability and better organization.
  - **Type Safety**: Replaced `any` with strongly-typed `ApiSearchResult` for fetching data.
  - **Accessibility**: Added ARIA labels and roles to improve accessibility.
  - **Dead Code**: The `calculatedValue` feature was intentionally kept for demonstration purposes, though it serves no functional purpose in the application. It is calculated client-side to avoid hydration errors.

### API (`app/api/search/route.ts`)

- **Security**:
  - **Input Validation**: Added validation to check for query length and prevent basic XSS attacks.
  - **Rate Limiting**: Implemented a simple in-memory rate limit (100 requests/minute) to prevent abuse.
- **Functionality**:
  - **Case-Insensitive Search**: The search logic was updated to be case-insensitive for a better user experience.
- **Error Handling**:
  - Improved error responses with proper HTTP status codes (e.g., `400`, `429`).

### Project Configuration (`tsconfig.json`)

- **TypeScript Strict Mode**: Enabled `strict` mode and other strict compiler options (`noUnusedLocals`, `noUnusedParameters`, etc.) to enforce cleaner, safer code.
