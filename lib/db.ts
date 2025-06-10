import { Pool } from 'pg';

// Create a connection pool for better performance
const pool = new Pool({
    connectionString: process.env.DATABASE_URL?.includes('prisma+postgres')
        ? process.env.DATABASE_URL.split('?')[0].replace('prisma+postgres://', 'postgresql://postgres:postgres@localhost:5432/fullstack_homework')
        : process.env.DATABASE_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Function to execute raw SQL queries
export async function executeQuery(text: string, params: any[] = []) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } finally {
        client.release();
    }
}

// Numbers table operations
export const numbersQueries = {
    // Add a new number
    addNumber: async (value: number) => {
        const query = 'INSERT INTO "Number" (value) VALUES ($1) RETURNING *';
        const result = await executeQuery(query, [value]);
        return result.rows[0];
    },

    // Get all numbers
    getAllNumbers: async () => {
        const query = 'SELECT * FROM "Number" ORDER BY id ASC';
        const result = await executeQuery(query);
        return result.rows;
    },

    // Get adjacent number pairs with their sums
    getAdjacentPairs: async () => {
        const query = `
      SELECT 
        a.id as id_1, 
        a.value as number_1, 
        b.id as id_2, 
        b.value as number_2, 
        (a.value + b.value) as sum
      FROM "Number" a
      JOIN "Number" b ON b.id = a.id + 1
      ORDER BY a.id ASC
    `;
        const result = await executeQuery(query);
        return result.rows;
    }
};

// Grades table operations
export const gradesQueries = {
    // Add a new grade
    addGrade: async (classType: string, value: number) => {
        const query = 'INSERT INTO "Grade" (class, value) VALUES ($1, $2) RETURNING *';
        const result = await executeQuery(query, [classType, value]);
        return result.rows[0];
    },

    // Get all grades
    getAllGrades: async () => {
        const query = 'SELECT * FROM "Grade" ORDER BY id ASC';
        const result = await executeQuery(query);
        return result.rows;
    },

    // Get grades by class
    getGradesByClass: async (classType: string) => {
        const query = 'SELECT * FROM "Grade" WHERE class = $1 ORDER BY id ASC';
        const result = await executeQuery(query, [classType]);
        return result.rows;
    }
};