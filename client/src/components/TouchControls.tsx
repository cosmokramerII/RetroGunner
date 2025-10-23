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

  const buttonStyle = "transition-all active:scale-90";
  
  const dPadButtonStyle = {
    background: 'linear-gradient(135deg, #2a2a5a 0%, #1a1a3a 100%)',
    border: '3px solid #4a4aaa',
    boxShadow: 'inset 0 2px 0 #6a6aff, inset 0 -2px 0 #0a0a2a, 0 4px 8px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)'
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* D-Pad */}
      <div className="absolute bottom-24 left-8 pointer-events-auto">
        <div className="relative w-40 h-40">
          {/* Center diamond */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full" style={{
            background: 'radial-gradient(circle, #3a3a6a 0%, #1a1a3a 100%)',
            border: '3px solid #4a4aaa',
            boxShadow: 'inset 0 2px 0 #5a5a8a, 0 4px 8px rgba(0,0,0,0.6)'
          }} />
          
          {/* Up */}
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('up')}
            onTouchEnd={handleTouchEnd}
            style={{
              ...dPadButtonStyle,
              touchAction: 'manipulation'
            }}
          >
            <span className="text-white text-2xl font-bold" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #4488ff'
            }}>▲</span>
          </button>
          
          {/* Down */}
          <button
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-lg ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('down')}
            onTouchEnd={handleTouchEnd}
            style={{
              ...dPadButtonStyle,
              touchAction: 'manipulation'
            }}
          >
            <span className="text-white text-2xl font-bold" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #4488ff'
            }}>▼</span>
          </button>
          
          {/* Left */}
          <button
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-lg ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('left')}
            onTouchEnd={handleTouchEnd}
            style={{
              ...dPadButtonStyle,
              touchAction: 'manipulation'
            }}
          >
            <span className="text-white text-2xl font-bold" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #4488ff'
            }}>◀</span>
          </button>
          
          {/* Right */}
          <button
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-lg ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('right')}
            onTouchEnd={handleTouchEnd}
            style={{
              ...dPadButtonStyle,
              touchAction: 'manipulation'
            }}
          >
            <span className="text-white text-2xl font-bold" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #4488ff'
            }}>▶</span>
          </button>
        </div>
      </div>

      {/* Action Buttons - SNES style */}
      <div className="absolute bottom-24 right-8 pointer-events-auto">
        <div className="relative w-44 h-36">
          {/* Jump Button (Y button position) */}
          <button
            className={`absolute top-0 left-10 w-20 h-20 rounded-full ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('jump')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'linear-gradient(135deg, #2a5a2a 0%, #1a3a1a 100%)',
              border: '4px solid #4aaa4a',
              boxShadow: 'inset 0 3px 0 #6aff6a, inset 0 -3px 0 #0a2a0a, 0 6px 12px rgba(0,0,0,0.6), 0 0 15px rgba(74,170,74,0.3)',
              touchAction: 'manipulation'
            }}
          >
            <div className="text-white font-bold text-xs tracking-wider" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #44ff44'
            }}>
              JUMP
            </div>
          </button>
          
          {/* Shoot Button (B button position) */}
          <button
            className={`absolute top-10 right-0 w-20 h-20 rounded-full ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('shoot')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'linear-gradient(135deg, #5a2a2a 0%, #3a1a1a 100%)',
              border: '4px solid #aa4a4a',
              boxShadow: 'inset 0 3px 0 #ff6a6a, inset 0 -3px 0 #2a0a0a, 0 6px 12px rgba(0,0,0,0.6), 0 0 15px rgba(170,74,74,0.3)',
              touchAction: 'manipulation'
            }}
          >
            <div className="text-white font-bold text-xs tracking-wider" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px #ff4444'
            }}>
              FIRE
            </div>
          </button>
        </div>
      </div>

      {/* Weapon Selection - Compact 16-bit style */}
      <div className="absolute top-24 right-8 pointer-events-auto">
        <div className="space-y-2" style={{
          background: 'linear-gradient(135deg, #2a2a5a 0%, #1a1a3a 100%)',
          border: '3px solid #4a4aaa',
          boxShadow: 'inset 0 2px 0 #6a6aff, inset 0 -2px 0 #0a0a2a, 0 4px 8px rgba(0,0,0,0.6)',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <div className="text-cyan-300 text-xs font-bold text-center mb-2 tracking-wider" style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>WEAPON</div>
          
          <button
            className={`w-16 h-12 rounded ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('weapon1')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'linear-gradient(180deg, #5a5a2a 0%, #3a3a1a 100%)',
              border: '2px solid #aaaa4a',
              boxShadow: 'inset 0 2px 0 #ffff6a, 0 2px 4px rgba(0,0,0,0.5)',
              touchAction: 'manipulation'
            }}
          >
            <div className="text-white text-xs font-bold tracking-wider" style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>1</div>
          </button>
          
          <button
            className={`w-16 h-12 rounded ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('weapon2')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'linear-gradient(180deg, #5a3a2a 0%, #3a2a1a 100%)',
              border: '2px solid #aa6a4a',
              boxShadow: 'inset 0 2px 0 #ff8a6a, 0 2px 4px rgba(0,0,0,0.5)',
              touchAction: 'manipulation'
            }}
          >
            <div className="text-white text-xs font-bold tracking-wider" style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>2</div>
          </button>
          
          <button
            className={`w-16 h-12 rounded ${buttonStyle}`}
            onTouchStart={() => handleTouchStart('weapon3')}
            onTouchEnd={handleTouchEnd}
            style={{
              background: 'linear-gradient(180deg, #5a2a5a 0%, #3a1a3a 100%)',
              border: '2px solid #aa4aaa',
              boxShadow: 'inset 0 2px 0 #ff6aff, 0 2px 4px rgba(0,0,0,0.5)',
              touchAction: 'manipulation'
            }}
          >
            <div className="text-white text-xs font-bold tracking-wider" style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>3</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouchControls;
