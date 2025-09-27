# ClaudeTodo

A modern, full-stack todo application built with React, TypeScript, Express.js, and PostgreSQL.

## Features

- ✅ **Add new todos** with title, description, priority, and deadline
- ✏️ **Edit existing todos** inline
- 🗑️ **Delete todos** with confirmation
- ✅ **Mark todos as complete/incomplete**
- 🔍 **Search and filter** todos by status
- 📊 **Priority system** (1-10 scale)
- 📅 **Deadline tracking** with date picker
- 🎨 **Modern UI** with Tailwind CSS
- 📱 **Responsive design**

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** database
- **Knex.js** for database migrations and queries
- **CORS, Helmet, Morgan** for security and logging

### Development Tools
- **Docker** & **Docker Compose** for containerization
- **ESLint** & **Prettier** for code quality
- **TypeScript** for type safety

## Project Structure

```
claude-todo/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── ...
│   ├── package.json
│   └── ...
├── backend/           # Express.js backend API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── migrations/    # Database migrations
│   │   └── ...
│   ├── package.json
│   └── ...
├── docker-compose.yml # Docker services configuration
├── .env              # Environment variables
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Docker** and **Docker Compose**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd claude-todo
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file to configure ports:
   ```env
   POSTGRES_PORT=5432
   BACKEND_PORT=8999
   ```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database using Docker:**
   ```bash
   # From the root directory
   cd ..
   docker-compose up postgres -d
   ```

4. **Run database migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:8999`

#### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

#### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Docker Development

For a complete Docker-based development environment:

1. **Start all services:**
   ```bash
   docker-compose up
   ```

   This will start:
   - PostgreSQL database on port 5432
   - Backend API on port 8999

2. **To stop all services:**
   ```bash
   docker-compose down
   ```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=8999
DATABASE_URL=postgres://postgres:password@localhost:5432/claude_todo
```

#### Docker (.env in root)
```env
POSTGRES_PORT=5432
BACKEND_PORT=8999
```

## API Endpoints

The backend provides a REST API with the following endpoints:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /health` - Health check endpoint

### Todo Data Structure

```typescript
interface Todo {
  id: number;
  title: string;
  body?: string;
  priority: number;        // 1-10 (1 = lowest, 10 = highest)
  deadline?: string;       // ISO date string
  done: boolean;
  created_at: string;
  updated_at: string;
}
```

## Database Schema

The `todos` table has the following structure:

| Column     | Type     | Description                    |
|------------|----------|--------------------------------|
| id         | Serial   | Primary key                    |
| title      | String   | Todo title (required)          |
| body       | Text     | Todo description (optional)    |
| priority   | Integer  | Priority 1-10 (default: 1)    |
| deadline   | Date     | Due date (optional)            |
| done       | Boolean  | Completion status (default: false) |
| created_at | Timestamp| Creation timestamp             |
| updated_at | Timestamp| Last update timestamp          |

## Development

### Code Style

Both frontend and backend use ESLint and Prettier for consistent code formatting:

```bash
# Backend
cd backend
npm run lint        # Check for linting errors
npm run lint:fix    # Fix auto-fixable linting errors
npm run format      # Format code with Prettier

# Frontend
cd frontend
npm run lint        # Check for linting errors
npm run format      # Format code with Prettier
```

### Database Management

```bash
# Create a new migration
cd backend
npm run migrate:make migration_name

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

## Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Ensure PostgreSQL is running via Docker: `docker-compose up postgres -d`
   - Check environment variables in backend `.env` file

2. **Frontend API connection errors:**
   - Ensure backend is running on port 8999
   - Check CORS configuration if accessing from different ports

3. **Port conflicts:**
   - Change port numbers in `.env` files
   - Update API base URL in frontend if backend port changes

### Logs

- **Backend logs:** Check the terminal where `npm run dev` is running
- **Database logs:** `docker-compose logs postgres`
- **All Docker services:** `docker-compose logs`

## License

This project is licensed under the ISC License.