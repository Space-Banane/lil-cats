import { useState } from 'react';

interface ControlPanelProps {
  numCats: number;
  onNumCatsChange: (value: number) => void;
  onAddFood: () => void;
  onAddCat: () => void;
  followCursor: boolean;
  onToggleFollowCursor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ControlPanel({
  numCats,
  onNumCatsChange,
  onAddFood,
  onAddCat,
  followCursor,
  onToggleFollowCursor,
  darkMode,
  onToggleDarkMode
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out ${
        isExpanded ? 'h-36' : 'h-16'
      } ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} 
      border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <button 
          className={`p-2 rounded-full ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
        
        <div className="flex items-center space-x-4">
          <button 
            className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium`}
            onClick={onAddFood}
          >
            Feed Cats 🐟
          </button>
          
          <button 
            className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
            } text-white font-medium`}
            onClick={onAddCat}
          >
            Add Cat 🐈
          </button>
        </div>
        
        <button 
          className={`p-2 rounded-full ${
            darkMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-black'
          } text-white`}
          onClick={onToggleDarkMode}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="container mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <label className="whitespace-nowrap">Number of Cats:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={numCats}
              onChange={(e) => onNumCatsChange(Number(e.target.value))}
              className={`w-full ${darkMode ? 'accent-blue-500' : 'accent-blue-600'}`}
            />
            <span className="w-8 text-center">{numCats}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <label>Follow Cursor:</label>
            <button
              onClick={onToggleFollowCursor}
              className={`relative px-10 py-2 rounded-full ${
                followCursor
                  ? darkMode ? 'bg-green-600' : 'bg-green-500' 
                  : darkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`}
            >
              <span 
                className={`absolute top-1 bottom-1 w-6 aspect-square rounded-full transition-all ${
                  followCursor ? 'right-1' : 'left-1'
                } ${
                  darkMode ? 'bg-white' : 'bg-white'
                }`} 
              />
            </button>
            <span>{followCursor ? 'On' : 'Off'}</span>
          </div>
        </div>
      )}
    </div>
  );
}