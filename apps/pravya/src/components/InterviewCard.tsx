import React from "react";

interface InterviewCardProps {
  title: string;
  type: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ title, type, icon, onClick }) => (
  <div className="bg-gray-800 rounded-lg p-5 flex flex-col items-start shadow-md min-w-[250px]">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="flex items-center mb-2">
      <span className="text-lg font-semibold text-white mr-2">{title}</span>
      <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded">{type}</span>
    </div>
    <button
      className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
      onClick={onClick}
    >
      Take interview
    </button>
  </div>
);

export default InterviewCard; 