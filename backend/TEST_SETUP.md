# Test Setup Instructions

## Prerequisites

1. **PostgreSQL**: Ensure PostgreSQL is installed and running on your system
2. **Database Access**: You need a PostgreSQL user with database creation privileges

## Setup Steps

### 1. Configure Test Database Credentials

Edit the `.env.test` file to match your PostgreSQL setup:

```env
NODE_ENV=test
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USER=postgres
TEST_DB_PASSWORD=your_password_here
TEST_DB_NAME=claude_todo_test
```

### 2. Grant Database Creation Privileges

Ensure your PostgreSQL user can create databases. Connect to PostgreSQL as a superuser and run:

```sql
ALTER USER postgres CREATEDB;
```

Or create a dedicated test user:

```sql
CREATE USER test_user WITH PASSWORD 'test_password' CREATEDB;
```

### 3. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Database Behavior

- **Auto-creation**: The test database is automatically created before tests run
- **Migrations**: Database schema is set up using existing migrations
- **Cleanup**: Each test starts with a clean database (all todo records are deleted)
- **Isolation**: Tests run against a separate database (`claude_todo_test`) from development

## Test Structure

- `src/__tests__/setup.ts`: Global test setup and database management
- `src/__tests__/TodoRepository.test.ts`: TodoRepository unit tests

## Troubleshooting

### "password authentication failed for user 'postgres'"

1. Check your PostgreSQL is running: `pg_ctl status`
2. Verify credentials in `.env.test`
3. Test connection: `psql -h localhost -U postgres -d postgres`

### "database does not exist"

The test setup automatically creates the test database. If this fails, ensure your user has CREATEDB privileges.

### "permission denied to create database"

Grant CREATEDB privilege to your user:
```sql
ALTER USER your_username CREATEDB;
```