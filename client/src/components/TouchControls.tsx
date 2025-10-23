import { useCallback } from "react";
import { useGameStore } from "../lib/stores/useGameStore";

const TouchControls = () => {
  const { updatePlayerInput, shootBullet, changeWeapon } = useGameStore();

  const handleTouchStart = useCallback((action: string) => {
    const input = {
      left: action === 'left',
      right: action === 'right',
      up: action === 'up',
      down: action === 'down',
      jump: action === 'jump' || action === 'Y',
      shoot: action === 'shoot' || action === 'B',
      weapon1: action === 'weapon1',
      weapon2: action === 'weapon2',
      weapon3: action === 'weapon3'
    };
    
    updatePlayerInput(input);
  }, [updatePlayerInput]);

  const handleTouchEnd = useCallback(() => {
    const input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      shoot: false,
      weapon1: false,
      weapon2: false,
      weapon3: false
    };
    
    updatePlayerInput(input);
  }, [updatePlayerInput]);

  const buttonClass = "transition-all active:scale-90 touch-manipulation";
  
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Gamepad Overlay Interface */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%)'
      }} />
      
      {/* D-Pad - Left Side */}
      <div className="absolute bottom-32 left-16 pointer-events-auto">
        <div className="relative w-36 h-36">
          {/* D-Pad Background */}
          <div className="absolute inset-0 rounded-lg" style={{
            background: 'radial-gradient(circle, rgba(20,20,30,0.9) 0%, rgba(10,10,20,0.95) 100%)',
            border: '2px solid rgba(100,100,120,0.5)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
          }} />
          
          {/* D-Pad Cross */}
          <div className="absolute inset-4">
            {/* Vertical bar */}
            <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 bg-gray-800 rounded" />
            {/* Horizontal bar */}
            <div className="absolute top-1/2 left-0 right-0 h-12 -translate-y-1/2 bg-gray-800 rounded" />
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-full" />
          </div>
          
          {/* Direction buttons */}
          <button
            className={`absolute top-3 left-1/2 -translate-x-1/2 w-11 h-11 ${buttonClass}`}
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-gray-400 text-2xl">▲</span>
          </button>
          
          <button
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-11 h-11 ${buttonClass}`}
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-gray-400 text-2xl">▼</span>
          </button>
          
          <button
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 ${buttonClass}`}
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-gray-400 text-2xl">◀</span>
          </button>
          
          <button
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 ${buttonClass}`}
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={handleTouchEnd}
          >
            <span className="text-gray-400 text-2xl">▶</span>
          </button>
        </div>
      </div>

      {/* Action Buttons - Right Side (SNES Layout) */}
      <div className="absolute bottom-32 right-16 pointer-events-auto">
        <div className="relative w-44 h-36">
          {/* Button Background */}
          <div className="absolute inset-0 rounded-lg" style={{
            background: 'radial-gradient(circle, rgba(20,20,30,0.9) 0%, rgba(10,10,20,0.95) 100%)',
            border: '2px solid rgba(100,100,120,0.5)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)'
          }} />
          
          {/* Y Button (Top) - Jump */}
          <button
            className={`absolute top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full ${buttonClass}`}
            onTouchStart={() => handleTouchStart('Y')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'radial-gradient(circle at 30% 30%, #5a5a6a, #3a3a4a)',
              border: '2px solid #6a6a7a',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <span className="text-white font-bold text-lg">Y</span>
          </button>
          
          {/* X Button (Left) */}
          <button
            className={`absolute top-1/2 left-6 -translate-y-1/2 w-14 h-14 rounded-full ${buttonClass}`}
            onTouchStart={() => handleTouchStart('X')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'radial-gradient(circle at 30% 30%, #5a5a6a, #3a3a4a)',
              border: '2px solid #6a6a7a',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <span className="text-white font-bold text-lg">X</span>
          </button>
          
          {/* A Button (Right) */}
          <button
            className={`absolute top-1/2 right-6 -translate-y-1/2 w-14 h-14 rounded-full ${buttonClass}`}
            onTouchStart={() => handleTouchStart('A')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'radial-gradient(circle at 30% 30%, #5a5a6a, #3a3a4a)',
              border: '2px solid #6a6a7a',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <span className="text-white font-bold text-lg">A</span>
          </button>
          
          {/* B Button (Bottom) - Shoot */}
          <button
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full ${buttonClass}`}
            onTouchStart={() => handleTouchStart('B')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'radial-gradient(circle at 30% 30%, #5a5a6a, #3a3a4a)',
              border: '2px solid #6a6a7a',
              boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <span className="text-white font-bold text-lg">B</span>
          </button>
        </div>
      </div>

      {/* Top Bar Buttons */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-8 pointer-events-auto">
        {/* Coin/Score indicator */}
        <button className={`w-16 h-16 rounded-full ${buttonClass}`} style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span className="text-white text-2xl font-bold">$</span>
        </button>
        
        {/* Special/Menu buttons */}
        <button className={`w-14 h-14 rounded-full ${buttonClass}`} style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span className="text-gray-400">◉</span>
        </button>
        
        <button className={`w-14 h-14 rounded-full ${buttonClass}`} style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span className="text-gray-400">⚙</span>
        </button>
        
        <button className={`w-14 h-14 rounded-full ${buttonClass}`} style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span className="text-gray-400">⚡</span>
        </button>
        
        <button className={`w-14 h-14 rounded-full ${buttonClass}`} style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}>
          <span className="text-gray-400">△</span>
        </button>
      </div>

      {/* START Button - Right Side */}
      <button 
        className={`absolute top-8 right-16 px-6 py-3 rounded-full ${buttonClass}`}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #3a3a4a, #2a2a3a)',
          border: '2px solid #4a4a5a',
          boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        <span className="text-gray-400 font-bold text-sm">START</span>
      </button>
      
      {/* Weapon Selection - Compact in corner */}
      <div className="absolute top-20 left-8 pointer-events-auto flex flex-col gap-2">
        <button
          className={`w-12 h-12 rounded ${buttonClass}`}
          onTouchStart={() => handleTouchStart('weapon1')}
          onTouchEnd={handleTouchEnd}
          style={{
            background: 'rgba(40,40,50,0.8)',
            border: '1px solid rgba(100,100,120,0.5)'
          }}
        >
          <span className="text-yellow-400 text-xs font-bold">1</span>
        </button>
        
        <button
          className={`w-12 h-12 rounded ${buttonClass}`}
          onTouchStart={() => handleTouchStart('weapon2')}
          onTouchEnd={handleTouchEnd}
          style={{
            background: 'rgba(40,40,50,0.8)',
            border: '1px solid rgba(100,100,120,0.5)'
          }}
        >
          <span className="text-orange-400 text-xs font-bold">2</span>
        </button>
        
        <button
          className={`w-12 h-12 rounded ${buttonClass}`}
          onTouchStart={() => handleTouchStart('weapon3')}
          onTouchEnd={handleTouchEnd}
          style={{
            background: 'rgba(40,40,50,0.8)',
            border: '1px solid rgba(100,100,120,0.5)'
          }}
        >
          <span className="text-purple-400 text-xs font-bold">3</span>
        </button>
      </div>
    </div>
  );
};

export default TouchControls;