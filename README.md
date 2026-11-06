# 📚 MyBookShelf

**MyBookShelf** is a personal book collection management application built with Angular and TypeScript.

The application helps book collectors organize their libraries, track book conditions, manage wishlists, and identify duplicate books.

This repository contains a **frontend demo** of MyBookShelf, showcasing its core functionality using mock data and browser LocalStorage.

## ✨ Features

- **Book collection management** — Add, edit, and delete books.
- **Book details** — Track titles, authors, publication years, ISBNs, languages, descriptions, and conditions.
- **Collection statuses** — Organize books as Owned, Wishlist, or Lent Out.
- **Book condition tracking** — Record physical condition and issues such as missing pages, damaged covers, or water damage.
- **Duplicate detection** — Identify duplicate books in your collection.
- **Search and filtering** — Find books by title or author and filter by collection status.
- **Sorting and pagination** — Browse large collections efficiently.
- **Dashboard** — View collection statistics and duplicate information.
- **LocalStorage persistence** — Keep changes after refreshing the browser.
- **Reset demo data** — Restore the original sample collection.
- **Form validation** — Validate book information using Angular Reactive Forms and Zod.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Angular 22 | Frontend framework |
| TypeScript | Application logic and type safety |
| Angular Signals | Reactive state management |
| Angular Reactive Forms | Book creation and editing |
| Zod | Schema validation |
| SCSS | Styling and design tokens |
| LocalStorage | Demo data persistence |
| ESLint | Static code analysis |

The project also includes automated tests.

## 🚀 Getting Started

### Prerequisites

- Node.js compatible with Angular 22
- npm
- Angular CLI (optional; commands use `npx`)

### Installation

Clone the repository:

```bash
git clone https://github.com/IntarsVascenkovs/MyBookShelf-Demo.git
cd MyBookShelf-Demo
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npx ng serve
```

Open your browser at:

http://localhost:4200/

### Production Build

```bash
npx ng build
```

### Run Tests

```bash
npx ng test
```

### Run ESLint

```bash
npx ng lint
```

## 💾 Demo Data and Persistence

MyBookShelf currently uses sample book records and browser LocalStorage.

You can freely add, edit, and delete books. Changes are saved locally in your browser and remain available after a page refresh.

Use **Reset demo data** to restore the original sample collection.

**Important:** This is a demonstration application. Data is stored only in the current browser and is not synchronized across devices. Do not use the demo as permanent storage for valuable book collection information.

## 🗺️ Future Development

MyBookShelf is intended to evolve into a full-featured book collection management platform.

Planned improvements include:

- ASP.NET Core Web API backend
- PostgreSQL database
- User authentication and personal accounts
- Cloud-based collection synchronization
- Improved management of editions, series, and physical copies
- Book cover images and richer metadata
- Mobile-friendly PWA experience
- Multilingual user interface

These features are planned and are not part of the current frontend demo.

## 📄 Project Status

**Frontend MVP / Public Demo**

The current version demonstrates the core collection management functionality. The production backend and commercial features are under development.

---

Built with Angular, TypeScript, and a passion for books.
