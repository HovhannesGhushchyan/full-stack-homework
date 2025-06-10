-- Create numbers table
CREATE TABLE IF NOT EXISTS numbers (
    id SERIAL PRIMARY KEY,
    value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 0 AND grade <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create number_pairs table
CREATE TABLE IF NOT EXISTS number_pairs (
    id SERIAL PRIMARY KEY,
    first_number INTEGER NOT NULL,
    second_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_numbers_value ON numbers(value);
CREATE INDEX IF NOT EXISTS idx_grades_student_name ON grades(student_name);
CREATE INDEX IF NOT EXISTS idx_number_pairs_numbers ON number_pairs(first_number, second_number); 