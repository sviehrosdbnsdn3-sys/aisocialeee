
import React, { useState, useEffect } from 'react';

const textMessages = [
  "Warming up the AI's creative circuits...",
  "Analyzing your content...",
  "Generating catchy headlines...",
  "Crafting the perfect summary...",
  "Thinking of a great image prompt..."
];

const imageMessages = [
    "Contacting the digital art studio...",
    "Mixing the cyber-paints...",
    "Painting a masterpiece with pixels...",
    "Applying your brand's magic touch...",
    "Almost there, just polishing the details..."
];

interface LoadingSpinnerProps {
    stage: 'text' | 'image';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ stage }) => {
  const messageList = stage === 'text' ? textMessages : imageMessages;
  const title = stage === 'text' ? 'Generating Text...' : 'Generating Image...';
  
  const [message, setMessage] = useState(messageList[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messageList.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messageList.length;
        return messageList[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [messageList]);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-lg shadow-xl text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <h2 className="text-xl font-semibold text-white mt-6">{title}</h2>
      <p className="text-gray-400 mt-2 transition-opacity duration-500">{message}</p>
    </div>
  );
};
