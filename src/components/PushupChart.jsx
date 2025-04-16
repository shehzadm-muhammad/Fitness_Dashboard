import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { supabase } from '../supabase';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const PushupChart = ({ user }) => {
  const [pushupData, setPushupData] = useState([]);

  useEffect(() => {
    const fetchPushups = async () => {
      const { data, error } = await supabase
        .from('pushups')
        .select('count, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setPushupData(data);
      }
    };

    fetchPushups();
  }, [user.id]);

  const chartData = {
    labels: pushupData.map((entry) =>
      new Date(entry.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Push-Ups Over Time',
        data: pushupData.map((entry) => entry.count),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Push-Up Progress</h3>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PushupChart;
