import { useState, useEffect, useCallback, useRef } from 'react'
import Cat from './components/Cat'
import Food from './components/Food'
import Navbar from './components/Navbar'

// Types for our game state
interface Position {
  x: number
  y: number
}

interface CatEntity {
  id: number
  position: Position
  targetPosition: Position
  emoji: string
  state: 'running' | 'sleeping' | 'eating' | 'playing' | 'sitting' | 'angry' | 'dead'
  speed: number
  lastStateChange: number
  foodTargetId: number | null
  isMoving: boolean
  timeoutId?: number
}

interface FoodEntity {
  id: number
  position: Position
  eaten: boolean
  emoji: string
  targetedBy: number[] // IDs of cats targeting this food
}

// Cat emojis for variety
const catEmojis = ["🐈", "🐈‍⬛", "😺", "😸", "😽", "🙀"]
// Food emojis for variety
const foodEmojis = ["🐟", "🍣", "🍗", "🥩", "🥛", "🐁"]
// Cat states (excluding angry and dead which are handled differently)
const catStates = ["running", "sleeping", "playing", "sitting"] as const

function App() {
  // State for cats and food
  const [cats, setCats] = useState<CatEntity[]>([])
  const [food, setFood] = useState<FoodEntity[]>([])
  
  // Settings
  const [numCats, setNumCats] = useState(3)
  const [followCursor, setFollowCursor] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  
  // Mouse position
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const nextCatId = useRef(1)
  const nextFoodId = useRef(1)

  // Food Ids
  const foodIds = useRef<string[]>([])
  
  // Store window dimensions to avoid layout thrashing
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window dimensions on resize with debounce
  useEffect(() => {
    let timeoutId: number | undefined;
    
    const handleResize = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 200);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  // Initialize cats
  useEffect(() => {
    if (cats.length < numCats) {
      // Add more cats if needed
      const newCats: CatEntity[] = []
      for (let i = cats.length; i < numCats; i++) {
        const randomX = Math.random() * (windowDimensions.width - 100) + 50
        const randomY = Math.random() * (windowDimensions.height - 200) + 50
        
        newCats.push({
          id: nextCatId.current++,
          position: { x: randomX, y: randomY },
          targetPosition: { x: randomX, y: randomY },
          emoji: catEmojis[Math.floor(Math.random() * catEmojis.length)],
          state: catStates[Math.floor(Math.random() * catStates.length)],
          speed: 0.03 + (Math.random() * 0.04), // Random speed between 0.03 and 0.07
          lastStateChange: Date.now(),
          foodTargetId: null,
          isMoving: true
        })
      }
      
      setCats(prevCats => [...prevCats, ...newCats])
    } else if (cats.length > numCats && numCats >= 0) {
      // Remove extra cats
      setCats(prevCats => prevCats.slice(0, numCats))
    }
  }, [numCats, cats.length, windowDimensions])

  // Handle mouse movement with throttling
  useEffect(() => {
    let lastUpdateTime = 0;
    const throttleTime = 10; // ms
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateTime >= throttleTime) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastUpdateTime = now;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle right click to toggle cursor following
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setFollowCursor(prev => !prev);
    };
    
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Handle random movement for cats
  useEffect(() => {
    // This effect handles the random movement and state changes for cats
    const moveInterval = setInterval(() => {
      setCats(prevCats => {
        return prevCats.map(cat => {
          // Skip cats that are dead, angry, or targeting food
          if (cat.state === 'dead' || cat.state === 'angry' || cat.foodTargetId !== null) {
            return cat;
          }
          
          const now = Date.now();
          const timeSinceLastStateChange = now - cat.lastStateChange;
          
          // Every 2-5 seconds, decide if cats should change state or direction
          if (timeSinceLastStateChange > 2000 + Math.random() * 3000) {
            // Determine what the cat should do next
            const actionRoll = Math.random();
            
            if (cat.state === 'running' && actionRoll < 0.3) {
              // 30% chance to rest if currently running
              const newState = Math.random() < 0.5 ? 'sleeping' : 'sitting';
              return {
                ...cat,
                state: newState,
                isMoving: false,
                lastStateChange: now
              };
            } else if ((cat.state === 'sleeping' || cat.state === 'sitting') && actionRoll < 0.6) {
              // 60% chance to start moving if resting
              const maxX = windowDimensions.width - 100;
              const maxY = windowDimensions.height - 200;
              
              // Pick a random point to move to
              const randomX = Math.random() * maxX + 50;
              const randomY = Math.random() * maxY + 50;
              
              return {
                ...cat,
                targetPosition: { x: randomX, y: randomY },
                state: 'running',
                isMoving: true,
                lastStateChange: now
              };
            } else if (cat.state === 'playing' && actionRoll < 0.7) {
              // 70% chance to do something else if playing
              const newState = Math.random() < 0.6 ? 'running' : 'sitting';
              
              if (newState === 'running') {
                const maxX = windowDimensions.width - 100;
                const maxY = windowDimensions.height - 200;
                
                // Pick a random point to move to
                const randomX = Math.random() * maxX + 50;
                const randomY = Math.random() * maxY + 50;
                
                return {
                  ...cat,
                  targetPosition: { x: randomX, y: randomY },
                  state: newState,
                  isMoving: true,
                  lastStateChange: now
                };
              } else {
                return {
                  ...cat,
                  state: newState,
                  isMoving: false,
                  lastStateChange: now
                };
              }
            } else if (cat.isMoving && cat.state === 'running') {
              // If already running, maybe change direction
              if (actionRoll < 0.4) {
                const maxX = windowDimensions.width - 100;
                const maxY = windowDimensions.height - 200;
                
                // Pick a random point to move to
                const randomX = Math.random() * maxX + 50;
                const randomY = Math.random() * maxY + 50;
                
                return {
                  ...cat,
                  targetPosition: { x: randomX, y: randomY },
                  lastStateChange: now
                };
              } else if (actionRoll < 0.5) {
                // 10% chance to start playing
                return {
                  ...cat,
                  state: 'playing',
                  isMoving: Math.random() < 0.5, // 50% chance to move while playing
                  lastStateChange: now
                };
              }
            } else if (!cat.isMoving && actionRoll < 0.3) {
              // If not moving, maybe start playing
              return {
                ...cat,
                state: 'playing',
                isMoving: false,
                lastStateChange: now
              };
            }
          }
          
          return cat;
        });
      });
    }, 1000);
    
    return () => clearInterval(moveInterval);
  }, [windowDimensions]);

  // Update cat positions
  const updateCatPosition = useCallback((id: number, newPosition: Position) => {
    setCats(prevCats => 
      prevCats.map(cat => 
        cat.id === id ? { ...cat, position: newPosition } : cat
      )
    );
  }, []);

  // Handle cat click - toggle between normal, angry, and dead states
  const handleCatClick = useCallback((id: number) => {
    setCats(prevCats => {
      return prevCats.map(cat => {
        if (cat.id === id) {
          // Clear any existing timeouts
          if (cat.timeoutId) {
            window.clearTimeout(cat.timeoutId);
          }
          
          if (cat.state === 'angry') {
            // If already angry, set to dead
            const timeoutId = window.setTimeout(() => {
              setCats(prev => prev.filter(c => c.id !== id));
              setNumCats(prev => Math.max(0, prev - 1));
            }, 1000);
            
            return {
              ...cat,
              state: 'dead',
              isMoving: false,
              timeoutId
            };
          } else if (cat.state !== 'dead') {
            // Set to angry and schedule return to previous state
            const previousState = cat.state;
            const timeoutId = window.setTimeout(() => {
              setCats(prev => 
                prev.map(c => 
                  c.id === id && c.state === 'angry' ? { 
                    ...c, 
                    state: previousState,
                    lastStateChange: Date.now()
                  } : c
                )
              );
            }, 3000);
            
            return { 
              ...cat, 
              state: 'angry', 
              isMoving: false, 
              timeoutId,
              lastStateChange: Date.now()
            };
          }
        }
        return cat;
      });
    });
  }, []);

  // Update cat target positions based on cursor or food
  useEffect(() => {

    if (!followCursor && food.length === 0) return;

    // Use a functional update to ensure we're working with the latest state
    setCats(prevCats => {
      // First, collect cats that need updates
      const catsToUpdate: CatEntity[] = [...prevCats];
      
      // Create a copy of food for updates
      let updatedFood = food.map(f => ({...f, targetedBy: [] as number[]}));
      
      // If cursor following is enabled, find the nearest cat to follow the cursor
      if (followCursor && prevCats.length > 0) {
        // Find suitable cats (not dead, not angry)
        const eligibleCats = prevCats.filter(cat => 
          cat.state !== 'dead' && cat.state !== 'angry'
        );
        
        if (eligibleCats.length > 0) {
          // Find the nearest cat to cursor
          const nearestCat = eligibleCats.reduce((nearest, current) => {
            const nearestDist = Math.hypot(nearest.position.x - mousePosition.x, nearest.position.y - mousePosition.y);
            const currentDist = Math.hypot(current.position.x - mousePosition.x, current.position.y - mousePosition.y);
            return currentDist < nearestDist ? current : nearest;
          });
          
          // Update that cat to follow cursor
          const nearestCatIndex = catsToUpdate.findIndex(cat => cat.id === nearestCat.id);
          if (nearestCatIndex !== -1) {
            catsToUpdate[nearestCatIndex] = {
              ...catsToUpdate[nearestCatIndex],
              targetPosition: mousePosition,
              state: 'running',
              isMoving: true,
              foodTargetId: null,
              lastStateChange: Date.now()
            };
          }
        }
      }
      
      // Process food targeting logic
      const uneatenFood = updatedFood.filter(f => !f.eaten);
      
      if (uneatenFood.length > 0) {
        // Process each cat that's not already following cursor
        const cursorFollowerCatId = catsToUpdate.find(cat => 
          cat.targetPosition.x === mousePosition.x && cat.targetPosition.y === mousePosition.y
        )?.id;
        
        catsToUpdate.forEach((cat, index) => {
          if (cat.id !== cursorFollowerCatId && cat.state !== 'dead' && cat.state !== 'angry') {
            // Check if this cat already has a food target
            if (cat.foodTargetId !== null) {
              const existingTarget = updatedFood.find(f => f.id === cat.foodTargetId && !f.eaten);
              
              if (existingTarget) {
                // Still targeting same food
                updatedFood = updatedFood.map(f => 
                  f.id === existingTarget.id ? { ...f, targetedBy: [...f.targetedBy, cat.id] } : f
                );
                
                // Check if cat has reached the food
                const distToFood = Math.hypot(
                  cat.position.x - existingTarget.position.x, 
                  cat.position.y - existingTarget.position.y
                );
                
                if (distToFood < 30) {
                  // Cat reached food - mark it as eaten
                  updatedFood = updatedFood.map(f => 
                    f.id === existingTarget.id ? { ...f, eaten: true } : f
                  );
                  
                  // Update cat to eating state
                  catsToUpdate[index] = {
                    ...cat,
                    state: 'eating',
                    isMoving: false,
                    foodTargetId: null,
                    lastStateChange: Date.now(),
                    // Return to normal state after eating
                    timeoutId: window.setTimeout(() => {
                      setCats(latestCats => 
                        latestCats.map(c => 
                          c.id === cat.id && c.state === 'eating' ? {
                            ...c, 
                            state: 'sitting',
                            lastStateChange: Date.now()
                          } : c
                        )
                      );
                    }, 2000)
                  };
                }
                
                return; // Skip further processing for this cat
              }
            }
            
            // If cat doesn't have a valid food target, try to find one
            // Find food items not targeted or targeted by only one cat
            const availableFood = uneatenFood
              .filter(f => f.targetedBy.length < 2)
              .sort((a, b) => {
                // Sort by distance to this cat
                const distA = Math.hypot(cat.position.x - a.position.x, cat.position.y - a.position.y);
                const distB = Math.hypot(cat.position.x - b.position.x, cat.position.y - b.position.y);
                return distA - distB;
              });
            
            if (availableFood.length > 0) {
              const targetFood = availableFood[0];
              
              // Update cat to target this food
              catsToUpdate[index] = {
                ...cat,
                targetPosition: targetFood.position,
                state: 'running',
                isMoving: true,
                foodTargetId: targetFood.id,
                lastStateChange: Date.now()
              };
              
              // Mark food as targeted
              updatedFood = updatedFood.map(f => 
                f.id === targetFood.id ? { ...f, targetedBy: [...f.targetedBy, cat.id] } : f
              );
            }
          }
        });
      }
      
      // Update food state
      setFood(updatedFood);
      
      // Return updated cats
      return catsToUpdate;
    });
  }, [followCursor, mousePosition, foodIds]);

  // Clean up eaten food
  useEffect(() => {
    if (food.some(f => f.eaten)) {
      const timer = setTimeout(() => {
        setFood(prevFood => prevFood.filter(f => !f.eaten));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [food]);

  // Add a cat with a random position
  const handleAddCat = useCallback(() => {
    const randomX = Math.random() * (windowDimensions.width - 100) + 50;
    const randomY = Math.random() * (windowDimensions.height - 200) + 50;
    
    const newCat: CatEntity = {
      id: nextCatId.current++,
      position: { x: randomX, y: randomY },
      targetPosition: { x: randomX, y: randomY },
      emoji: catEmojis[Math.floor(Math.random() * catEmojis.length)],
      state: catStates[Math.floor(Math.random() * catStates.length)],
      speed: 0.03 + (Math.random() * 0.04), // Random speed between 0.03 and 0.07
      lastStateChange: Date.now(),
      foodTargetId: null,
      isMoving: true
    };
    
    setCats(prevCats => [...prevCats, newCat]);
    setNumCats(prevNumCats => prevNumCats + 1);
  }, [windowDimensions]);
  
  // Randomly add cats on a timer
  const handleRandomAddCat = useCallback(() => {
    // Add 1-3 random cats
    const count = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const randomX = Math.random() * (windowDimensions.width - 100) + 50;
        const randomY = Math.random() * (windowDimensions.height - 200) + 50;
        
        const newCat: CatEntity = {
          id: nextCatId.current++,
          position: { x: randomX, y: randomY },
          targetPosition: { x: randomX, y: randomY },
          emoji: catEmojis[Math.floor(Math.random() * catEmojis.length)],
          state: catStates[Math.floor(Math.random() * catStates.length)],
          speed: 0.03 + (Math.random() * 0.04),
          lastStateChange: Date.now(),
          foodTargetId: null,
          isMoving: true
        };
        
        setCats(prevCats => [...prevCats, newCat]);
        setNumCats(prevNumCats => prevNumCats + 1);
      }, i * 300); // Add cats with a slight delay between them
    }
  }, [windowDimensions]);

  // Add food at random positions
  const handleAddFood = useCallback(() => {
    // Add 3-6 food items in random locations
    const foodCount = Math.floor(Math.random() * 4) + 3;
    const newFood: FoodEntity[] = [];
    
    for (let i = 0; i < foodCount; i++) {
      const randomX = Math.random() * (windowDimensions.width - 100) + 50;
      const randomY = Math.random() * (windowDimensions.height - 200) + 50;
      
      newFood.push({
        id: nextFoodId.current++,
        position: { x: randomX, y: randomY },
        eaten: false,
        emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
        targetedBy: []
      });
    }
    
    setFood(prevFood => [...prevFood, ...newFood]);
  }, [windowDimensions]);
  
  // Remove all cats
  const handleRemoveAllCats = useCallback(() => {
    setCats([]);
    setNumCats(0);
  }, []);
  
  // Remove all food
  const handleRemoveAllFood = useCallback(() => {
    setFood([]);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden w-full h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-100'} pt-16`}
      style={{ cursor: followCursor ? 'none' : 'default' }}
    >
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        followCursor={followCursor}
        numCats={numCats}
        onNumCatsChange={setNumCats}
        onToggleFollowCursor={() => setFollowCursor(prev => !prev)}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        onAddCat={handleAddCat}
        onAddFood={handleAddFood}
        onRemoveAllCats={handleRemoveAllCats}
        onRemoveAllFood={handleRemoveAllFood}
        onRandomAddCat={handleRandomAddCat}
      />
      
      {/* Cats */}
      {cats.map(cat => (
        <Cat
          key={cat.id}
          id={cat.id}
          position={cat.position}
          targetPosition={cat.targetPosition}
          onPositionChange={updateCatPosition}
          emoji={cat.emoji}
          state={cat.state}
          speed={cat.speed}
          onClick={handleCatClick}
          isMoving={cat.isMoving}
        />
      ))}
      
      {/* Food */}
      {food.map(item => !item.eaten && (
        <Food
          key={item.id}
          id={item.id}
          position={item.position}
          emoji={item.emoji}
        />
      ))}
      
      {/* Custom cursor when following is enabled */}
      {followCursor && (
        <div 
          className="absolute pointer-events-none z-50"
          style={{ 
            left: mousePosition.x, 
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-4 h-4 rounded-full border-2 ${darkMode ? 'border-white' : 'border-black'}`}></div>
        </div>
      )}
    </div>
  )
}

export default App
