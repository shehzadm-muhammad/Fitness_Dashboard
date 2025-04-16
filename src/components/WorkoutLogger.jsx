import React, { useState } from 'react';
import { supabase } from '../supabase';

const WorkoutLogger = ({ user }) => {
  const [form, setForm] = useState({
    type: '',
    duration: '',
    calories: '',
    weight: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, duration, calories, weight } = form;

    const { error } = await supabase.from('workouts').insert({
      user_id: user.id,
      type,
      duration: Number(duration),
      calories: Number(calories),
      weight: Number(weight),
    });

    if (error) {
      console.error('Workout log failed:', error.message);
      setStatus('❌ Failed to log workout');
    } else {
      setForm({ type: '', duration: '', calories: '', weight: '' });
      setStatus('✅ Workout logged!');
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">📝 Log New Workout</h3>

      <input
        type="text"
        name="type"
        placeholder="Workout Type (e.g., Running)"
        value={form.type}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <input
        type="number"
        name="duration"
        placeholder="Duration (mins)"
        value={form.duration}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <input
        type="number"
        name="calories"
        placeholder="Calories Burned"
        value={form.calories}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />
      <input
        type="number"
        name="weight"
        placeholder="Current Weight (kg)"
        value={form.weight}
        onChange={handleChange}
        className="w-full border rounded px-4 py-2"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Save Workout
      </button>

      {status && <p className="text-sm text-center text-green-600">{status}</p>}
    </form>
  );
};

export default WorkoutLogger;
