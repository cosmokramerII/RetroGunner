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
      jump: action === 'jump',
      shoot: action === 'shoot',
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

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* D-Pad */}
      <div className="absolute bottom-24 left-8 pointer-events-auto">
        <div className="relative w-36 h-36">
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-700/40 to-gray-900/40 rounded-full border-2 border-white/30"></div>
          
          {/* Up */}
          <button
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-blue-500/20 to-blue-700/20 border-2 border-blue-300/40 rounded-lg backdrop-blur-sm transition-all active:scale-95 active:bg-blue-400/30"
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-white text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">▲</span>
          </button>
          
          {/* Down */}
          <button
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-b from-blue-500/20 to-blue-700/20 border-2 border-blue-300/40 rounded-lg backdrop-blur-sm transition-all active:scale-95 active:bg-blue-400/30"
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-white text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">▼</span>
          </button>
          
          {/* Left */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-b from-blue-500/20 to-blue-700/20 border-2 border-blue-300/40 rounded-lg backdrop-blur-sm transition-all active:scale-95 active:bg-blue-400/30"
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-white text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">◀</span>
          </button>
          
          {/* Right */}
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-b from-blue-500/20 to-blue-700/20 border-2 border-blue-300/40 rounded-lg backdrop-blur-sm transition-all active:scale-95 active:bg-blue-400/30"
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <span className="text-white text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">▶</span>
          </button>
        </div>
      </div>

      {/* Action Buttons - SNES style */}
      <div className="absolute bottom-24 right-8 pointer-events-auto">
        <div className="relative w-40 h-32">
          {/* Jump Button (Y button position) */}
          <button
            className="absolute top-0 left-8 w-16 h-16 bg-gradient-to-br from-green-400/25 to-green-600/25 border-3 border-green-300/50 rounded-full backdrop-blur-sm transition-all active:scale-90 active:bg-green-400/40 shadow-lg"
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="text-white font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              JUMP
            </div>
          </button>
          
          {/* Shoot Button (B button position) */}
          <button
            className="absolute top-8 right-0 w-16 h-16 bg-gradient-to-br from-red-400/25 to-red-600/25 border-3 border-red-300/50 rounded-full backdrop-blur-sm transition-all active:scale-90 active:bg-red-400/40 shadow-lg"
            onTouchStart={() => handleTouchStart('shoot')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            <div className="text-white font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              FIRE
            </div>
          </button>
        </div>
      </div>

      {/* Weapon Selection - Compact SNES style */}
      <div className="absolute top-24 right-8 pointer-events-auto">
        <div className="flex flex-col gap-2 bg-black/20 backdrop-blur-sm rounded-lg p-2 border border-white/20">
          <div className="text-white text-xs font-bold text-center mb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">WEAPON</div>
          <button
            className="w-14 h-10 bg-gradient-to-b from-yellow-400/25 to-yellow-600/25 border-2 border-yellow-300/50 rounded text-white text-xs font-bold backdrop-blur-sm transition-all active:scale-95 active:bg-yellow-400/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            onTouchStart={() => handleTouchStart('weapon1')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            BASIC
          </button>
          <button
            className="w-14 h-10 bg-gradient-to-b from-orange-400/25 to-orange-600/25 border-2 border-orange-300/50 rounded text-white text-xs font-bold backdrop-blur-sm transition-all active:scale-95 active:bg-orange-400/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            onTouchStart={() => handleTouchStart('weapon2')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            M-GUN
          </button>
          <button
            className="w-14 h-10 bg-gradient-to-b from-purple-400/25 to-purple-600/25 border-2 border-purple-300/50 rounded text-white text-xs font-bold backdrop-blur-sm transition-all active:scale-95 active:bg-purple-400/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            onTouchStart={() => handleTouchStart('weapon3')}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'manipulation' }}
          >
            SPREAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
