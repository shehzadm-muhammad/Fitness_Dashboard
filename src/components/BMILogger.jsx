import React, { useState } from 'react';
import { supabase } from '../supabase';

const BMILogger = ({ user }) => {
  const [bmi, setBmi] = useState('');
  const [message, setMessage] = useState('');

  const handleLog = async () => {
    setMessage('');
    if (!bmi) return setMessage('Please enter a BMI value.');

    const { error } = await supabase.from('bmi').insert([
      {
        user_id: user.id,
        bmi: parseFloat(bmi),
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Insert error:', error.message);
      setMessage('Failed to log BMI.');
    } else {
      setMessage('✅ BMI logged!');
      setBmi('');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">⚖️ Log BMI</h3>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          step="0.1"
          placeholder="Enter BMI"
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
          className="p-2 rounded border border-gray-300 w-40 text-black"
        />
        <button
          onClick={handleLog}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Log
        </button>
      </div>
      {message && <p className="text-sm mt-2 text-blue-700">{message}</p>}
    </div>
  );
};

export default BMILogger;
