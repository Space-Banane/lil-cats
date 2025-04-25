import { memo } from 'react';

interface FoodProps {
  id: number;
  position: { x: number; y: number };
  emoji: string;
}

function FoodComponent({ position, emoji = "🐟" }: FoodProps) {
  return (
    <div
      className="absolute transition-transform"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        fontSize: '1.5rem',
        zIndex: 5,
      }}
    >
      {emoji}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders
export default memo(FoodComponent);