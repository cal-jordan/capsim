# Capsim - Quiz

This project consists of a frontend and backend application. Below are the detailed setup instructions for both parts.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Git
- PostgreSQL (v14 or higher)

## Project Structure
```
.
├── backend/         # Backend application
│   ├── controllers/ # API controllers
│   ├── routes/      # API routes
│   └── __tests__/   # Backend tests
├── src/             # Frontend application
│   ├── components/  # React components
│   ├── store/       # Redux store
│   └── __tests__/   # Frontend tests
├── public/          # Static assets
└── ...config files
```

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up PostgreSQL:
   ```bash
   # Start PostgreSQL service
   brew services start postgresql@14

   # Create the database
   createdb capsim
   ```

4. Set up environment variables:
   Copy the `.env.example` file to create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in the `.env` file:
   ```
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/capsim?schema=public"
   API_URL="http://localhost:4000/api"
   PORT=4000
   ```
   Note: Replace `your_password` with your PostgreSQL password. If you haven't set a password, you can use `postgres` as the default.

5. Set up the database:
   ```bash
   # Generate Prisma client
   pnpm prisma generate

   # Run database migrations
   pnpm prisma migrate dev

   # Seed the database with initial data
   pnpm prisma db seed
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

The backend server will start on http://localhost:4000

## Frontend Setup

1. From the root directory, install dependencies:
   ```bash
   pnpm install
   ```

2. The environment variables should already be set up from the previous step. The frontend will use:
   ```
   VITE_API_URL=http://localhost:4000/api
   ```
   
   This is automatically loaded from the `.env` file in the root directory.

3. Start the development server:
   ```bash
   pnpm dev
   ```

The frontend application will start on http://localhost:3002

## Development

### Backend Development
- The backend is built with Node.js, Express, and TypeScript
- Uses Prisma as the ORM
- Follows REST API architecture
- Code is located in the `backend` directory

### Frontend Development
- Built with React 19 and TypeScript
- Uses Redux Toolkit for state management
- Uses Vite as the build tool
- Code is located in the `src` directory

## Testing

The project uses Vitest for both frontend and backend testing.

### Test Structure
- Frontend tests are located in `src/components/__tests__/`
- Backend controller tests are in `backend/controllers/__tests__/`
- Backend API integration tests are in `backend/__tests__/`

### Running Tests
```bash
# Run all tests
pnpm test

# Run only frontend tests
pnpm test:frontend

# Run specific test file
pnpm test path/to/test-file.test.ts
```

### Testing Stack
- Vitest (test runner)
- @testing-library/react (for React components)
- Supertest (for API testing)
- Mock objects for external dependencies (database, etc.)

## Available Scripts

### Backend Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

### Frontend Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

### Testing Scripts
```bash
pnpm test         # Run all tests
pnpm test:frontend # Run only frontend tests
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Generate test coverage report
pnpm test:ui      # Run tests with UI
```
