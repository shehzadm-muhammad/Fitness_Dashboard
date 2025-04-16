import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../supabase';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BMIChart = ({ user }) => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchBMIData = async () => {
      const { data, error } = await supabase
        .from('bmi')
        .select('bmi, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setDataPoints(data);
      }
    };

    fetchBMIData();
  }, [user.id]);

  const chartData = {
    labels: dataPoints.map((point) =>
      new Date(point.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'BMI Progress',
        data: dataPoints.map((point) => point.bmi),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'BMI Over Time',
      },
    },
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">📊 BMI Progress</h2>
      {dataPoints.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p className="text-gray-500">No BMI data logged yet.</p>
      )}
    </div>
  );
};

export default BMIChart;
