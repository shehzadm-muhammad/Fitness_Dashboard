import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { supabase } from '../supabase';
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const WeightLiftedChart = ({ user }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('weight_lifted')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (error) console.error(error.message);
      else setData(data);
    };
    fetch();
  }, [user.id]);

  const labels = data.map((d) => new Date(d.created_at).toLocaleDateString());
  const weights = data.map((d) => d.weight);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Weight Lifted (kg)',
        data: weights,
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">🏋️‍♂️ Weight Lifted Progress</h3>
      {weights.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p className="text-sm text-gray-500 italic">
          No weight lifting data yet.
        </p>
      )}
    </div>
  );
};

export default WeightLiftedChart;
