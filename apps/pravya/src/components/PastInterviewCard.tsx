import React from "react";

interface PastInterviewCardProps {
  title: string;
  type: string;
  icon: React.ReactNode;
  date: string;
  score: number;
  description: string;
  onView: () => void;
}

const PastInterviewCard: React.FC<PastInterviewCardProps> = ({
  title,
  type,
  icon,
  date,
  score,
  description,
  onView,
}) => (
  <div className="bg-gray-800 rounded-lg p-5 flex flex-col items-start shadow-md min-w-[250px]">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="flex items-center mb-2 w-full justify-between">
      <span className="text-lg font-semibold text-white">{title}</span>
      <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">{type}</span>
    </div>
    <div className="flex items-center text-gray-400 text-xs mb-2">
      <span className="mr-3">{date}</span>
      <span>⭐ {score}/100</span>
    </div>
    <div className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</div>
    <button
      className="mt-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
      onClick={onView}
    >
      View interview
    </button>
  </div>
);

export default PastInterviewCard; 