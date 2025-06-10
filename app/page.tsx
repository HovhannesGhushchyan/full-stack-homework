import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Full Stack Assessment</h1>
      
      <p className="mb-8 text-lg">
        This application demonstrates proficiency in React, Next.js, and PostgreSQL with raw SQL queries.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Numbers</h2>
          <p className="mb-4">
            Add numbers and view adjacent number pairs with their sums.
          </p>
          <Link 
            href="/numbers"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Numbers
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Grades</h2>
          <p className="mb-4">
            Manage grades for different classes (Math, Science, History).
          </p>
          <Link 
            href="/grades"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Grades
          </Link>
        </div>
      </div>
    </div>
  );
}
