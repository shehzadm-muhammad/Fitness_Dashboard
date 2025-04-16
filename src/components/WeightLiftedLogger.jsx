import React, { useState } from 'react';
import { supabase } from '../supabase';

const WeightLiftedLogger = ({ user }) => {
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState('');

  const handleLog = async () => {
    setMessage('');
    if (!weight) return setMessage('Please enter a weight.');

    const { error } = await supabase.from('weight_lifted').insert([
      {
        user_id: user.id,
        weight_kg: parseFloat(weight_kg),
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Insert error:', error.message);
      setMessage('Failed to log weight.');
    } else {
      setMessage('✅ Weight logged!');
      setWeight('');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">🏋️ Log Weight Lifted</h3>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          placeholder="Enter weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="p-2 rounded border border-gray-300 w-40 text-black"
        />
        <button
          onClick={handleLog}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Log
        </button>
      </div>
      {message && <p className="text-sm mt-2 text-blue-700">{message}</p>}
    </div>
  );
};

export default WeightLiftedLogger;
