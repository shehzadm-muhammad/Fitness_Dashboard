import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import AvatarUpload from '../components/AvatarUpload';

const calculateStreak = (dates) => {
  const uniqueDays = Array.from(
    new Set(dates.map((d) => new Date(d).toDateString()))
  );
  const sorted = uniqueDays.sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();

  for (let dateStr of sorted) {
    const day = new Date(dateStr);
    if (
      currentDate.toDateString() === day.toDateString() ||
      currentDate.toDateString() ===
        new Date(day.setDate(day.getDate() + 1)).toDateString()
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const Profile = ({ session }) => {
  const user = session.user;
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState('');
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, age, height, weight, gender, goal, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch profile:', error.message);
      } else {
        setProfileData(profile);
      }

      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id);

      setWorkouts(workoutsData || []);
    };

    fetchData();
  }, [user.id]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profileData });

    if (error) {
      setStatus('❌ Update failed');
    } else {
      setStatus('✅ Profile updated');
      setEditing(false);
    }

    setTimeout(() => setStatus(''), 3000);
  };

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const workoutDates = workouts.map((w) => w.created_at);
  const streak = calculateStreak(workoutDates);

  const bmi =
    profileData?.height && profileData?.weight
      ? (profileData.weight / (profileData.height / 100) ** 2).toFixed(1)
      : null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center">👤 Profile</h2>

      <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
        <div>
          <strong>Email:</strong>
        </div>
        <div>{user.email}</div>

        <div>
          <strong>Joined:</strong>
        </div>
        <div>{new Date(user.created_at).toLocaleDateString()}</div>

        {['full_name', 'age', 'height', 'weight', 'gender', 'goal'].map(
          (field) => (
            <React.Fragment key={field}>
              <div>
                <strong>{field.replace('_', ' ').toUpperCase()}:</strong>
              </div>
              <div>
                {editing ? (
                  field === 'gender' ? (
                    <select
                      name="gender"
                      value={profileData?.gender || ''}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <input
                      name={field}
                      value={profileData?.[field] || ''}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  )
                ) : (
                  profileData?.[field] || '—'
                )}
              </div>
            </React.Fragment>
          )
        )}

        {bmi && (
          <>
            <div>
              <strong>BMI:</strong>
            </div>
            <div>{bmi}</div>
          </>
        )}

        <div>
          <strong>🔥 Streak:</strong>
        </div>
        <div>
          {streak} day{streak !== 1 && 's'} in a row
        </div>

        <div>
          <strong>Calories Burned:</strong>
        </div>
        <div>{totalCalories}</div>
      </div>

      {editing ? (
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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
      ) : (
        <div className="text-center mt-4">
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>
      )}

      <AvatarUpload user={user} />
      {streak >= 3 && (
        <div className="text-center mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
          🔥 {streak} Day Streak! Keep it up!
        </div>
      )}

      {status && <p className="text-center mt-2 text-red-600">{status}</p>}
    </div>
  );
};

export default Profile;
