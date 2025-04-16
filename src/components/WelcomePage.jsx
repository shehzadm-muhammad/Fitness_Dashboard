import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1558611848-73f7eb4001a1')] bg-cover bg-center flex flex-col items-center justify-center text-white px-6">
      <div className="bg-black bg-opacity-60 p-8 rounded-xl text-center shadow-lg max-w-xl w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to FitTrack</h1>
        <p className="text-lg mb-6">Track workouts, set goals, and see your fitness progress like never before.</p>
        <Link to="/auth">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-lg font-medium rounded-full shadow transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
