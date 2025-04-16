import React, { useState } from 'react';
import { supabase } from '../supabase';

const RunningLogger = ({ user }) => {
  const [distance, setDistance] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!distance) return;

    const { error } = await supabase.from('running').insert({
      user_id: user.id,
      distance_km: parseFloat(distance),
    });

    if (error) {
      setStatus('❌ Failed to log run');
      console.error(error.message);
    } else {
      setStatus('✅ Run logged!');
      setDistance('');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">🏃 Log a Run</h3>
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="number"
          step="0.1"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          placeholder="Distance in km"
          className="border px-4 py-2 rounded w-full"
        />
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow">
          Log Run
        </button>
      </form>
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default RunningLogger;
