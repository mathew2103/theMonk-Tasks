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
