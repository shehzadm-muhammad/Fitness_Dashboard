import React, { useState } from 'react';
import { supabase } from '../supabase';

const avatars = [
  'https://ishwlnjrcprdbhdefqtt.supabase.co/storage/v1/object/sign/avatarsv2/1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzdjIvMS5wbmciLCJpYXQiOjE3NDI5OTkzMDUsImV4cCI6MjA1ODM1OTMwNX0.15qzX_l1M97ahssaAdJbgGrc76YobJdnL3pkCx_0RwM',
  'https://ishwlnjrcprdbhdefqtt.supabase.co/storage/v1/object/sign/avatarsv2/2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzdjIvMi5wbmciLCJpYXQiOjE3NDI5OTkzNjgsImV4cCI6MjA1ODM1OTM2OH0.NRmWMsyOjBUg2Oj0700T1ivu4iCxzL57_IubuAOUD7c',
  'https://ishwlnjrcprdbhdefqtt.supabase.co/storage/v1/object/sign/avatarsv2/3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzdjIvMy5wbmciLCJpYXQiOjE3NDI5OTkzOTUsImV4cCI6MjA1ODM1OTM5NX0.FEqNDyUYu8432JKRTkoKMMg3-fPOa0rpTkB1aQDbARQ',
  'https://ishwlnjrcprdbhdefqtt.supabase.co/storage/v1/object/sign/avatarsv2/4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzdjIvNC5wbmciLCJpYXQiOjE3NDI5OTk0MTksImV4cCI6MjA1ODM1OTQxOX0.zkRJD6bpguc1js0Ml2pyURbXIQrI-8L2I3ZahngeL7k',
];

const AvatarUpload = ({ user }) => {
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState('');

  const handleAvatarClick = async (url) => {
    setSelected(url);
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('id', user.id);

    if (error) {
      console.error('Avatar update failed:', error.message);
      setStatus('❌ Update failed');
    } else {
      setStatus('✅ Avatar updated!');
    }

    setTimeout(() => setStatus(''), 2500);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-center mb-4">
        Choose Your Avatar
      </h3>
      <div className="flex justify-center gap-6 flex-wrap">
        {avatars.map((url) => (
          <img
            key={url}
            src={url}
            alt="Avatar"
            onClick={() => handleAvatarClick(url)}
            className={`w-20 h-20 rounded-full border-4 cursor-pointer transition ${
              selected === url ? 'border-blue-500' : 'border-transparent'
            }`}
          />
        ))}
      </div>
      {status && (
        <div
          className={`mt-2 text-center text-sm ${
            status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
