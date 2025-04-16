import React from 'react';

const SocialSharing = ({ workouts, calories }) => {
  const shareMessage = `🔥 I've completed ${workouts} workouts and burned ${calories} calories using FitTrack! Join me on my fitness journey.`;

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(url, '_blank');
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center space-y-4 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold">📣 Share Your Progress</h3>
      <p className="text-gray-700">
        Let your friends know how hard you've worked! 💪
      </p>
      <div className="flex justify-center flex-wrap gap-4">
        <button
          onClick={shareWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Share on WhatsApp
        </button>
        <button
          onClick={shareTwitter}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Share on Twitter
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default SocialSharing;
