import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const GoalsPage = ({ user }) => {
  const [goal, setGoal] = useState('');
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchGoal = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('goal')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setGoal(data.goal || '');
      }
    };

    fetchGoal();
  }, [user.id]);

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ goal })
      .eq('id', user.id);

    if (!error) {
      setStatus('✅ Goal updated!');
      setEditing(false);
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        🎯 Your Fitness Goal
      </h2>

      {!editing ? (
        <div className="text-center space-y-4">
          <p className="text-gray-700 text-lg">
            <strong>Current Goal:</strong> {goal || 'No goal set yet'}
          </p>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Edit Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            rows="3"
            className="w-full border px-4 py-2 rounded"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Set your goal (e.g. Lose 5kg in 3 months)"
          />
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 hover:text-red-600 px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status && (
        <div className="text-green-600 text-center text-sm">{status}</div>
      )}
    </div>
  );
};

export default GoalsPage;
