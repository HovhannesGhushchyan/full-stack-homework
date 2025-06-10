'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface NumberPair {
  id_1: number;
  number_1: number;
  id_2: number;
  number_2: number;
  sum: number;
}

export default function NumbersPage() {
  const [value, setValue] = useState<string>('');
  const [pairs, setPairs] = useState<NumberPair[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch adjacent number pairs
  const fetchPairs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/numbers/pairs');
      if (!response.ok) {
        throw new Error('Failed to fetch number pairs');
      }
      const data = await response.json();
      setPairs(data);
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

    try {
      setLoading(true);
      const response = await fetch('/api/numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: parseInt(value) }),
      });

      if (!response.ok) {
        throw new Error('Failed to add number');
      }

      setValue('');
      fetchPairs(); // Refresh the table
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pairs on component mount
  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Number Pair Calculations</h1>

      {/* Form for submitting integers */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add a Number</h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter an integer"
            className="flex-1 p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Number'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Table of adjacent number pairs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Adjacent Number Pairs</h2>
        {loading && <p>Loading...</p>}
        {pairs.length === 0 && !loading ? (
          <p>No number pairs available. Add at least two numbers to see pairs.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID 1</th>
                  <th className="py-2 px-4 border-b">Number 1</th>
                  <th className="py-2 px-4 border-b">ID 2</th>
                  <th className="py-2 px-4 border-b">Number 2</th>
                  <th className="py-2 px-4 border-b">Sum</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr key={`${pair.id_1}-${pair.id_2}`}>
                    <td className="py-2 px-4 border-b text-center">{pair.id_1}</td>
                    <td className="py-2 px-4 border-b text-center">{pair.number_1}</td>
                    <td className="py-2 px-4 border-b text-center">{pair.id_2}</td>
                    <td className="py-2 px-4 border-b text-center">{pair.number_2}</td>
                    <td className="py-2 px-4 border-b text-center">{pair.sum}</td>
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