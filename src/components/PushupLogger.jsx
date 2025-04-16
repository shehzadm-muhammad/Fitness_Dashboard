import React, { useState } from 'react';
import { supabase } from '../supabase';

const PushupLogger = ({ user }) => {
  const [count, setCount] = useState('');
  const [status, setStatus] = useState('');

  const handleLog = async () => {
    const { error } = await supabase.from('pushups').insert({
      user_id: user.id,
      count: parseInt(count),
    });

    if (!error) {
      setStatus('✅ Push-ups logged!');
      setCount('');
      setTimeout(() => setStatus(''), 2000);
    } else {
      setStatus('❌ Error logging push-ups');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">💪 Log Push-Ups</h3>
      <input
        type="number"
        placeholder="How many push-ups?"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
      <button
        onClick={handleLog}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
      {status && <p className="text-sm text-green-600">{status}</p>}
    </div>
  );
};

export default PushupLogger;
