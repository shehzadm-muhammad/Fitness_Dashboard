import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { supabase } from '../supabase';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const RunningChart = ({ user }) => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchRunning = async () => {
      const { data, error } = await supabase
        .from('running') // ✅ Correct table
        .select('distance_km, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching running data:', error.message);
      } else {
        setDataPoints(data);
      }
    };

    fetchRunning();
  }, [user.id]);

  const chartData = {
    labels: dataPoints.map((entry) =>
      new Date(entry.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Distance (km)',
        data: dataPoints.map((entry) => entry.distance_km),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Kilometers' },
      },
      x: {
        title: { display: true, text: 'Date' },
      },
    },
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
      <h2 className="text-xl font-bold mb-4">🏃‍♂️ Running Progress</h2>
      {dataPoints.length === 0 ? (
        <p className="italic text-gray-500">No running data yet.</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
};

export default RunningChart;
