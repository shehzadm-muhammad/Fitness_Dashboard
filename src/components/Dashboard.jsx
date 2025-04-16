import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import WorkoutLogger from './WorkoutLogger';
import ProgressChart from './ProgressChart';
import SocialSharing from './SocialSharing';
import WeightTracker from './WeightTracker';
import PushupLogger from './PushupLogger';
import PushupChart from './PushupChart';
import BMIChart from './BMIChart';
import WeightLiftedChart from './WeightLiftedChart';
import BMILogger from './BMILogger';
import WeightLiftedLogger from './WeightLiftedLogger';
import RunningChart from './RunningChart';

const Dashboard = ({ session }) => {
  const user = session.user;
  const [workouts, setWorkouts] = useState([]);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);

      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError.message);
      } else {
        setWorkouts(workoutsData || []);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('goal')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching goal:', profileError.message);
      } else {
        setGoal(profileData?.goal || '');
      }

      setLoading(false);
    };

    fetchData();
  }, [user.id]);

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalWorkouts = workouts.length;

  const calculateWeeklyStreak = () => {
    const dates = new Set(
      workouts.map((w) => new Date(w.created_at).toDateString())
    );
    let streak = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (dates.has(d.toDateString())) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const weeklyStreak = calculateWeeklyStreak();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in transition-opacity duration-700 space-y-8 pb-24 px-4 max-w-5xl mx-auto">
      {/* 💡 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
          <h3 className="text-lg font-semibold mb-2">Total Workouts</h3>
          <p className="text-4xl font-bold">{totalWorkouts}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
          <h3 className="text-lg font-semibold mb-2">Calories Burned</h3>
          <p className="text-4xl font-bold">{totalCalories}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
          <h3 className="text-lg font-semibold mb-2">Weekly Streak</h3>
          <p className="text-4xl font-bold">{weeklyStreak} 🔥</p>
        </div>
      </div>

      {/* 🎯 Goal */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <h3 className="text-xl font-bold mb-2">🎯 Current Fitness Goal</h3>
        <p className="italic">
          {goal || 'No goal set yet. Head to the Goals page to set one!'}
        </p>
      </div>

      {/* ✍️ Workout Logger */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <WorkoutLogger user={user} />
      </div>

      {/* 📈 Progress Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <ProgressChart session={session} />
      </div>

      {/* 💪 Pushup Logger + Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <PushupLogger user={user} />
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <PushupChart user={user} />
      </div>

      {/* 🏃 Running Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <RunningChart user={user} />
      </div>

      {/* 🏋️‍♂️ Weight Lifted Logger + Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <WeightLiftedLogger user={user} />
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <WeightLiftedChart user={user} />
      </div>

      {/* ⚖️ BMI Logger + Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <BMILogger user={user} />
      </div>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <BMIChart user={user} />
      </div>

      {/* 🔗 Social Sharing */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md p-6 text-gray-800">
        <SocialSharing
          user={user}
          totalWorkouts={totalWorkouts}
          totalCalories={totalCalories}
        />
      </div>
    </div>
  );
};

export default Dashboard;
