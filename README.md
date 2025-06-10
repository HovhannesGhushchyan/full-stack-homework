# Alison Full Stack Developer Assessment

This technical assessment evaluates your proficiency in developing a modern full-stack web application using React, Next.js, and PostgreSQL. You will demonstrate your ability to create web application with database integration and efficient data handling.

## Project Overview

You will build a web application that demonstrates your proficiency in:

- Frontend development with React and Next.js
- Raw SQL database operations
- Form handling and validation

## Technical Requirements

### Environment Setup

- Install Node.js and pnpm using [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
- Set up a PostgreSQL database using Docker.

```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

Create .env with this field
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_homework?schema=public"
```

- Choose and implement a database connection method:
  - Direct database connection using [`postgres`](https://github.com/porsager/postgres) or any other client
  - ORM (Prisma, Drizzle, or TypeORM) for schema management and connection only
  - Connection pooling recommended for performance optimization

### Project Requirements

You will need to create a Single Page Application (SPA) with the following technical requirements:

The application should implement client-side routing with two main pages accessible via these routes:

- `/numbers` - For number pair calculations
- `/grades` - For grade management and analysis

Include a top navigation bar that provides navigation between pages

The application can utilize a modern UI component library for consistent design and enhanced user experience. While you have flexibility in choosing any UI library, [Material UI](https://mui.com/) is preferred.

For data fetching and database communication, implement one of these approaches:

- [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) - Create RESTful endpoints in Next.js to handle client-side data fetching with proper error handling and loading states

- [React Server Components (RSC)](https://nextjs.org/docs/app/getting-started/fetching-data) - Leverage server-side rendering for optimal performance, with streaming capabilities and selective hydration

Ensure your implementation includes proper error boundaries, loading indicators, and responsive design principles regardless of your chosen approach.

#### numbers Page

Form for submitting integers:
- Include a number input field that accepts both positive and negative integers.
- On submit, save the value into the numbers table using raw SQL.
 
Display adjacent number pairs:
- Below the form, show a table of adjacent numbers and their sums.
- The format should be as follows:
 
| ID 1 | Number 1 | ID 2 | Number 2 | Sum |
| ---- | -------- | ---- | -------- | --- |
| 1    | 3        | 2    | 5        | 8   |
| 2    | 5        | 3    | 7        | 12  |
| 3    | 7        | 4    | 2        | 9   |

- Auto-refresh the table when a new number is added.
 
#### grades Page

Create a form with:

- A dropdown for class selection with options: Math, Science, and History
- A numeric grade input field (must be between 0 and 100)
- A submit button that inserts the entry into the grades table using raw SQL

## Technical Constraints

- Must use **raw SQL** queries for database operations
- ORM usage is allowed only for schema creation and seeding, but all data operations must use raw SQL queries

## Bonus Points

- Unit and integration tests
- Performance optimizations
- Input validation
- Error boundary implementation

## Getting Started

1. Fork the repository
2. Clone the forked repository to your local machine
3. Install dependencies: `pnpm install`
4. Start PostgreSQL: Use the Docker command above
5. Run development server: pnpm dev
6. Access the application: <http://localhost:3000>

## Submission Guidelines

- Ensure all features are working
- Include database schema
- Document any assumptions or decisions made during development
- Push your code to your forked repository
- Notify us once you have completed the assessment
