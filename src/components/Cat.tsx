import { useEffect, useRef, useState, memo } from 'react';

interface CatProps {
  id: number;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onPositionChange: (id: number, position: { x: number; y: number }) => void;
  emoji: string;
  state: 'running' | 'sleeping' | 'eating' | 'playing' | 'sitting' | 'angry' | 'dead';
  speed: number;
  onClick: (id: number) => void;
  isMoving: boolean;
}

const stateEmojis: Record<string, string> = {
  'running': '🐈',
  'sleeping': '💤',
  'eating': '🍽️😸',
  'playing': '😺',
  'sitting': '🐈‍⬛',
  'angry': '😾',
  'dead': '⚰️'
};

function CatComponent({ 
  id, 
  position, 
  targetPosition, 
  onPositionChange, 
  emoji = "🐈", 
  state = "running",
  speed = 0.05,
  onClick,
  isMoving = false
}: CatProps) {
  const catRef = useRef<HTMLDivElement>(null);
  const [displayEmoji, setDisplayEmoji] = useState(emoji);
  
  // Update emoji based on state
  useEffect(() => {
    if (state === 'running' || state === 'sitting' || state === 'playing') {
      setDisplayEmoji(emoji);
    } else {
      setDisplayEmoji(stateEmojis[state] || emoji);
    }
  }, [emoji, state]);
  
  // Move the cat toward target position with easing
  useEffect(() => {
    if (!isMoving) return;
    
    let animationFrameId: number;
    
    const moveTowardsTarget = () => {
      const dx = targetPosition.x - position.x;
      const dy = targetPosition.y - position.y;
      
      // If the cat is very close to target, consider it arrived
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        return;
      }
      
      // Calculate new position with easing
      const newX = position.x + dx * speed;
      const newY = position.y + dy * speed;
      
      onPositionChange(id, { x: newX, y: newY });
      animationFrameId = requestAnimationFrame(moveTowardsTarget);
    };
    
    animationFrameId = requestAnimationFrame(moveTowardsTarget);
    return () => cancelAnimationFrame(animationFrameId);
  }, [id, position, targetPosition, onPositionChange, speed, isMoving]);

  // Determine if the cat should face left or right based on movement
  const facingLeft = targetPosition.x < position.x;
  
  return (
    <div
      ref={catRef}
      className="absolute transition-transform cursor-pointer select-none"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px) scaleX(${facingLeft ? -1 : 1})`,
        fontSize: '2rem',
        willChange: 'transform',
        zIndex: state === 'dead' ? 5 : 10,
      }}
      onClick={() => onClick(id)}
    >
      {displayEmoji}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(CatComponent);