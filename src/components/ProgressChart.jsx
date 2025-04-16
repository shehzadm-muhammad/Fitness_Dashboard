import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabase';

function calculateStreak(workouts) {
  const dates = workouts
    .map((w) => new Date(w.created_at).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i); // Unique days only

  dates.sort((a, b) => new Date(b) - new Date(a)); // Newest to oldest

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    if (date.toDateString() === currentDate.toDateString()) {
      streak++;
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      if (date.toDateString() === currentDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
  }

  return streak;
}

const ProgressChart = ({ session }) => {
  const chartRef = useRef(null);
  const [workouts, setWorkouts] = useState([]);
  const user = session?.user;

  // Load workouts for logged in user
  useEffect(() => {
    if (!user) return;

    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) {
        console.error('Error fetching workouts:', error.message);
      } else {
        setWorkouts(data || []);
      }
    };

    fetchWorkouts();
  }, [user]);

  // Render chart after workouts load
  useEffect(() => {
    if (!chartRef.current || workouts.length === 0 || !window.Chart) return;

    const ctx = chartRef.current.getContext('2d');

    // Remove old chart
    if (chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    // Create new chart
    chartRef.current.chartInstance = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels: workouts.map((w) =>
          new Date(w.created_at).toLocaleDateString()
        ),
        datasets: [
          {
            label: 'Calories Burned',
            data: workouts.map((w) => w.calories),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Calories',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
        },
      },
    });
  }, [workouts]);

  // Share functions
  const getTotalCalories = () =>
    workouts.reduce((sum, w) => sum + w.calories, 0);

  const getTwitterLink = () => {
    const msg = `💪 I’ve burned ${getTotalCalories()} calories using the Fitness Tracker!`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`;
  };

  const getWhatsAppLink = () => {
    const msg = `💪 I’ve burned ${getTotalCalories()} calories using the Fitness Tracker!`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  };

  const handleDownload = () => {
    if (!chartRef.current) return;
    const link = document.createElement('a');
    link.download = 'fitness-progress.png';
    link.href = chartRef.current.toDataURL('image/png');
    link.click();
  };
  const streak = calculateStreak(workouts);
  const totalWorkouts = workouts.length;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Progress Over Time
      </h2>

      {workouts.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No data to display. Please log some workouts!
        </p>
      ) : (
        <>
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 mb-4 rounded">
            🔥 Current Streak:{' '}
            <strong>
              {streak} day{streak !== 1 && 's'}
            </strong>
          </div>

          {totalWorkouts >= 5 && (
            <div className="bg-green-100 border border-green-300 text-green-800 p-3 mb-4 rounded">
              🎖️ You've logged {totalWorkouts} workouts! Keep going!
            </div>
          )}

          <canvas ref={chartRef} className="w-full h-64" />
        </>
      )}
    </div>
  );
};

export default ProgressChart;
