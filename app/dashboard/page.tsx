import React, { useEffect, useState } from 'react';
import { Workout } from '@/types/workout';

async function fetchWorkouts(): Promise<Workout[]> {
  try {
    const res = await fetch('/api/workouts', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch workouts');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}

async function logProgress(workoutId: string) {
  // fire-and-forget POST; do not await in caller for UI responsiveness
  fetch('/api/analytics/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workoutId }),
  });
}

const DashboardPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingIds, setLoggingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWorkouts()
      .then((data) => {
        if (!cancelled) {
          setWorkouts(data);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogProgress = (id: string) => {
    setLoggingIds((prev) => new Set(prev).add(id));
    logProgress(id);
    // Remove the logging indicator after a short while
    setTimeout(() => {
      setLoggingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 700);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Workout Summary</h1>
      {loading && <div>Loading recent workouts...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded shadow p-6 flex flex-col justify-between border border-gray-100"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">{w.type}</h2>
                <div className="text-sm text-gray-500 mb-2">{w.date}</div>
                <div className="mb-2">Duration: <span className="font-medium">{w.duration} min</span></div>
                <div>Calories: <span className="font-medium">{w.calories}</span></div>
              </div>
              <button
                className={
                  loggingIds.has(w.id)
                    ?
                      'mt-6 px-4 py-2 rounded bg-gray-400 text-white cursor-not-allowed opacity-80'
                    :
                      'mt-6 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white'
                }
                onClick={() => handleLogProgress(w.id)}
                disabled={loggingIds.has(w.id)}
                aria-busy={loggingIds.has(w.id)}
              >
                {loggingIds.has(w.id) ? 'Logging...' : 'Log Progress'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
