
import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the AI's creative circuits...",
  "Generating catchy headlines...",
  "Crafting the perfect summary...",
  "Painting a masterpiece with pixels...",
  "Applying your brand's magic touch...",
  "Almost there, just polishing the details..."
];

export const LoadingSpinner: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-xl text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <h2 className="text-xl font-semibold text-white mt-6">Generating Your Post</h2>
      <p className="text-gray-400 mt-2 transition-opacity duration-500">{message}</p>
    </div>
  );
};
