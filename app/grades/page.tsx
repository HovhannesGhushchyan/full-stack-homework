'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Grade {
  id: number;
  class: string;
  value: number;
}

export default function GradesPage() {
  const [classType, setClassType] = useState<string>('Math');
  const [value, setValue] = useState<string>('');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch grades
  const fetchGrades = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grades');
      if (!response.ok) {
        throw new Error('Failed to fetch grades');
      }
      const data = await response.json();
      setGrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const gradeValue = parseInt(value);
    if (gradeValue < 0 || gradeValue > 100) {
      setError('Grade must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class: classType, value: gradeValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to add grade');
      }

      setValue('');
      fetchGrades(); // Refresh the table
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch grades on component mount
  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Grade Management</h1>

      {/* Form for submitting grades */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Grade</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="class" className="block mb-1">Class</label>
            <select
              id="class"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
            </select>
          </div>
          <div>
            <label htmlFor="grade" className="block mb-1">Grade (0-100)</label>
            <input
              id="grade"
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter grade"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Grade'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Table of grades */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Grades</h2>
        {loading && <p>Loading...</p>}
        {grades.length === 0 && !loading ? (
          <p>No grades available. Add a grade to see it here.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Class</th>
                  <th className="py-2 px-4 border-b">Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade) => (
                  <tr key={grade.id}>
                    <td className="py-2 px-4 border-b text-center">{grade.id}</td>
                    <td className="py-2 px-4 border-b text-center">{grade.class}</td>
                    <td className="py-2 px-4 border-b text-center">{grade.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
