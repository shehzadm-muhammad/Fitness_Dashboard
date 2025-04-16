import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
);

const WeightTracker = ({ user }) => {
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const fetchWeights = async () => {
      const { data, error } = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error) {
        setWeights(data || []);
      } else {
        console.error('Error fetching weights:', error.message);
      }
    };

    fetchWeights();
  }, [user.id]);

  const labels = weights.map((w) =>
    new Date(w.created_at).toLocaleDateString()
  );
  const values = weights.map((w) => w.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Weight Progress Over Time',
        color: '#111',
        font: { size: 18 },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Weight (kg)',
        },
        ticks: {
          precision: 0,
          color: '#444',
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          color: '#444',
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md text-gray-800">
      <h2 className="text-xl font-bold mb-4">📉 Weight Tracker</h2>
      {weights.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p className="italic text-sm text-gray-500">
          No weight entries yet. Log some to see your progress!
        </p>
      )}
    </div>
  );
};

export default WeightTracker;
