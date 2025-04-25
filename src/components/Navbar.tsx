import { memo } from 'react';

interface NavbarProps {
  darkMode: boolean;
  followCursor: boolean;
  numCats: number;
  onNumCatsChange: (value: number) => void;
  onToggleFollowCursor: () => void;
  onToggleDarkMode: () => void;
  onAddCat: () => void;
  onAddFood: () => void;
  onRemoveAllCats: () => void;
  onRemoveAllFood: () => void;
  onRandomAddCat: () => void;
}

function NavbarComponent({
  darkMode,
  followCursor,
  numCats,
  onNumCatsChange,
  onToggleFollowCursor,
  onToggleDarkMode,
  onAddCat,
  onAddFood,
  onRemoveAllCats,
  onRemoveAllFood,
  onRandomAddCat
}: NavbarProps) {
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} shadow-lg mt-0`}>
      <div className="container mx-auto flex flex-wrap items-center justify-between p-3">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">
            Lil Cats 🐈
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium transition-colors`}
            onClick={onAddCat}
          >
            Add Cat 🐈
          </button>
          
          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
            } text-white font-medium transition-colors`}
            onClick={onRandomAddCat}
          >
            Random Cats 🎲
          </button>
          
          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
            } text-white font-medium transition-colors`}
            onClick={onAddFood}
          >
            Add Food 🐟
          </button>
          
          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } text-white font-medium transition-colors`}
            onClick={onRemoveAllCats}
          >
            Remove Cats ❌
          </button>
          
          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'
            } text-white font-medium transition-colors`}
            onClick={onRemoveAllFood}
          >
            Clear Food 🧹
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white text-sm whitespace-nowrap">Cats: {numCats}</span>
            <input
              type="range"
              min="0"
              max="20"
              value={numCats}
              onChange={(e) => onNumCatsChange(Number(e.target.value))}
              className={`w-20 ${darkMode ? 'accent-blue-500' : 'accent-blue-600'}`}
            />
          </div>
          
          <button 
            onClick={onToggleFollowCursor}
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              followCursor
                ? darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600' 
                : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-400'
            } text-white font-medium transition-colors`}
          >
            Follow: {followCursor ? 'On' : 'Off'}
          </button>
          
          <button 
            className={`p-2 rounded-full ${
              darkMode ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-800 hover:bg-black'
            } text-white transition-colors`}
            onClick={onToggleDarkMode}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button 
            className={`px-3 py-1 text-sm md:px-3 md:py-1.5 rounded-lg ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-medium transition-colors`}
            onClick={() => window.open('https://github.com/Space-Banane/lil-cats', '_blank')}
          >
            View SRC 📄
          </button>
        </div>
      </div>
    </nav>
  );
}

export default memo(NavbarComponent);