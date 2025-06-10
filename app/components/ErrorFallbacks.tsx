export function DataFetchingError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="p-4 border border-amber-500 rounded bg-amber-50">
      <h3 className="font-medium text-amber-800">Failed to load data</h3>
      <p className="text-sm text-amber-700 mt-1">{error.message}</p>
      <button 
        onClick={retry}
        className="mt-3 px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
      >
        Try again
      </button>
    </div>
  );
}