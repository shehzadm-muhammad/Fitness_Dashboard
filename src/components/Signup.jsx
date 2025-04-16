import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    goal: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    setError('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: form.full_name,
        age: form.age,
        height: form.height,
        weight: form.weight,
        gender: form.gender,
        goal: form.goal,
      });

      if (insertError) {
        setError(
          'Account created, but saving profile failed: ' + insertError.message
        );
        return;
      }
    }

    alert('Signup successful! Please verify your email.');
    navigate('/auth');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow space-y-4 mt-10">
      <h2 className="text-xl font-bold text-center">Sign Up</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <input
        name="full_name"
        placeholder="Full Name"
        onChange={handleChange}
        className="input"
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        className="input"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        className="input"
      />
      <input
        name="age"
        placeholder="Age"
        type="number"
        onChange={handleChange}
        className="input"
      />
      <input
        name="height"
        placeholder="Height (cm)"
        type="number"
        onChange={handleChange}
        className="input"
      />
      <input
        name="weight"
        placeholder="Weight (kg)"
        type="number"
        onChange={handleChange}
        className="input"
      />
      <input
        name="goal"
        placeholder="Goal (e.g. Lose 5kg)"
        onChange={handleChange}
        className="input"
      />
      <select name="gender" onChange={handleChange} className="input">
        <option value="">Select Gender</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>
      <button
        onClick={handleSignup}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
