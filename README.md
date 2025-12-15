# Condo Project

A full-stack condo/real estate listing application built with Laravel and React.

## Tech Stack

### Backend
- **PHP 8.3** with **Laravel 12**
- **Laravel Passport** for OAuth2 authentication
- **PostgreSQL** database
- **Spatie Media Library** for image management
- **PHPUnit** for testing
- **Laravel Pint** for code style

### Frontend
- **React 19** with **TypeScript**
- **Vite 7** for build tooling
- **TailwindCSS 4** for styling
- **TanStack Router** for file-based routing
- **TanStack React Query** for data fetching
- **Zustand** for state management
- **Vitest** for testing

## Features

- User authentication (register, login, logout)
- Room/condo listing with search and filters
- Image upload with automatic thumbnails
- Admin panel for room management (CRUD)
- Role-based access control (admin/user)

## Project Structure

```
condo-project/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Enums/
│   ├── routes/api.php
│   └── tests/
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── routes/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
└── .github/workflows/       # CI/CD
```

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 22+
- PostgreSQL 17+

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate Passport encryption keys
php artisan passport:keys

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure API URL in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout (auth required) |
| GET | `/api/auth/user` | Get current user (auth required) |

### Rooms (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List all rooms |
| GET | `/api/rooms/{id}` | Get room details |

### Rooms (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/room` | List all rooms |
| GET | `/api/room/{id}` | Get room details |
| POST | `/api/room` | Create room (admin) |
| PUT | `/api/room/{id}` | Update room (admin) |
| DELETE | `/api/room/{id}` | Delete room (admin) |
| POST | `/api/room/{id}/images` | Upload images (admin) |
| DELETE | `/api/room/{roomId}/images/{mediaId}` | Delete image (admin) |

## Running Tests

### Backend
```bash
cd backend
php artisan test
```

### Frontend
```bash
cd frontend
npm run test
```

## Code Style

### Backend (Laravel Pint)
```bash
cd backend
./vendor/bin/pint
```

### Frontend
```bash
cd frontend
npm run build  # TypeScript check included
```

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Backend**: PHP 8.3, PostgreSQL, Composer, Pint linting, PHPUnit tests
- **Frontend**: Node.js 22, npm, Vitest tests, Vite build

CI runs on pushes and pull requests to `main` and `dev` branches.

## Environment Variables

### Backend (.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=condo
DB_USERNAME=postgres
DB_PASSWORD=secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## License

MIT
