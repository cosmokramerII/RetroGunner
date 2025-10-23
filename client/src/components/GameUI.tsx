import { useGameStore } from "../lib/stores/useGameStore";
import { useAudio } from "../lib/stores/useAudio";
import { Card, CardContent } from "./ui/card";

const GameUI = () => {
  const { player, gameState, score, restartGame } = useGameStore();
  const { isMuted, toggleMute } = useAudio();

  const getWeaponName = (weapon: string) => {
    switch (weapon) {
      case 'machine_gun': return 'M-GUN';
      case 'spread_gun': return 'SPREAD';
      case 'laser': return 'LASER';
      default: return 'RIFLE';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        zIndex: 100
      }} />
      
      {/* HUD - Modern Contra Style */}
      {gameState === 'playing' && player && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Player 1 Panel with Portrait */}
          <div className="relative" style={{
            background: 'linear-gradient(135deg, rgba(20,40,20,0.95) 0%, rgba(10,20,10,0.98) 100%)',
            border: '3px solid #4aaa4a',
            boxShadow: 'inset 0 2px 0 #6aff6a, inset 0 -2px 0 #2a5a2a, 0 4px 8px rgba(0,0,0,0.7)',
            borderRadius: '4px'
          }}>
            <div className="flex items-start gap-3 p-3">
              {/* Character Portrait */}
              <div className="relative" style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #2a3a4a 0%, #1a2a3a 100%)',
                border: '2px solid #5a6a7a',
                borderRadius: '4px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {/* Portrait image placeholder - Bill Rizer style */}
                <div className="absolute inset-1 rounded" style={{
                  background: 'linear-gradient(135deg, #8a6a4a 0%, #6a4a2a 100%)'
                }}>
                  {/* Face */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full" style={{
                    background: '#d4a373'
                  }} />
                  {/* Hair */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-4 rounded-t-full" style={{
                    background: '#2a2a2a'
                  }} />
                  {/* Bandana */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-2" style={{
                    background: '#cc2222'
                  }} />
                  {/* Body */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-6" style={{
                    background: '#3a4a3a'
                  }} />
                </div>
                
                {/* P1 Label */}
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs font-bold px-1 rounded" style={{
                  boxShadow: '0 0 4px rgba(0,255,0,0.5)'
                }}>
                  P1
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex-1 space-y-2">
                {/* Name */}
                <div className="text-green-300 font-bold text-sm tracking-wider" style={{
                  textShadow: '1px 1px 0px #0a3a0a'
                }}>
                  BILL RIZER
                </div>
                
                {/* Health */}
                <div>
                <div className="text-yellow-300 font-bold text-xs mb-1 tracking-wider" style={{
                  textShadow: '1px 1px 0px #8b6914'
                }}>LIFE</div>
                <div className="flex gap-1">
                  {Array.from({ length: player.maxHealth }, (_, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 border-2`}
                      style={{
                        backgroundColor: i < player.health ? '#ff3333' : '#331111',
                        borderColor: i < player.health ? '#ff6666' : '#663333',
                        boxShadow: i < player.health ? 'inset 0 -2px 0 #cc0000, 0 2px 4px rgba(255,0,0,0.5)' : 'inset 0 2px 0 #220000'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Weapon */}
              <div>
                <div className="text-cyan-300 font-bold text-xs mb-1 tracking-wider" style={{
                  textShadow: '1px 1px 0px #0a4a5a'
                }}>WEAPON</div>
                <div className="px-2 py-1 text-center font-bold text-sm tracking-widest" style={{
                  background: 'linear-gradient(180deg, #ff8800 0%, #cc6600 100%)',
                  border: '2px solid #ffaa44',
                  boxShadow: 'inset 0 1px 0 #ffcc66, 0 2px 4px rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  textShadow: '1px 1px 0px #884400, -1px -1px 0px #ffcc88'
                }}>
                  {getWeaponName(player.currentWeapon)}
                </div>
              </div>
              
              {/* Shield indicator */}
              {player.hasShield && (
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="w-full h-1 bg-blue-600" style={{
                    boxShadow: '0 0 8px #0066ff'
                  }} />
                  <span className="text-blue-300 font-bold text-xs tracking-wider" style={{
                    textShadow: '1px 1px 0px #003366'
                  }}>SHIELD</span>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Top Center - Score */}
          <div className="relative" style={{
            background: 'linear-gradient(135deg, #1a3e1a 0%, #0a1e0a 100%)',
            border: '4px solid #4aaa4a',
            boxShadow: 'inset 0 2px 0 #6aff6a, inset 0 -2px 0 #2a5a2a, 0 4px 8px rgba(0,0,0,0.5)'
          }}>
            <div className="px-4 py-2">
              <div className="text-yellow-300 font-bold text-xs mb-1 text-center tracking-wider" style={{
                textShadow: '1px 1px 0px #8b6914'
              }}>SCORE</div>
              <div className="text-white font-bold text-2xl tracking-widest tabular-nums" style={{
                textShadow: '2px 2px 0px #000000, -1px -1px 0px #66ff66',
                fontFamily: 'monospace'
              }}>
                {score.toString().padStart(7, '0')}
              </div>
            </div>
          </div>
          
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="relative pointer-events-auto transition-transform hover:scale-110 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #3e1a3e 0%, #1e0a1e 100%)',
              border: '4px solid #aa4aaa',
              boxShadow: 'inset 0 2px 0 #ff6aff, inset 0 -2px 0 #5a2a5a, 0 4px 8px rgba(0,0,0,0.5)',
              width: '48px',
              height: '48px'
            }}
          >
            <div className="text-2xl">{isMuted ? '🔇' : '🔊'}</div>
          </button>
        </div>
      )}

      {/* Game Over Screen - 16-bit Style */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{
          background: 'radial-gradient(circle, rgba(40,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)'
        }}>
          <div className="relative max-w-md w-full mx-4">
            {/* Outer glow */}
            <div className="absolute inset-0 animate-pulse" style={{
              background: 'radial-gradient(circle, rgba(255,0,0,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)'
            }} />
            
            {/* Main panel */}
            <div className="relative" style={{
              background: 'linear-gradient(135deg, #3e0a0a 0%, #1a0000 100%)',
              border: '6px solid #aa2a2a',
              boxShadow: 'inset 0 3px 0 #ff4444, inset 0 -3px 0 #550000, 0 8px 16px rgba(0,0,0,0.8)'
            }}>
              <div className="p-8 text-center space-y-6">
                {/* Title */}
                <div className="relative">
                  <h1 className="text-6xl font-bold tracking-wider mb-2" style={{
                    color: '#ff3333',
                    textShadow: '4px 4px 0px #8b0000, -2px -2px 0px #ff6666, 0 0 20px #ff0000',
                    fontFamily: 'monospace',
                    letterSpacing: '0.2em'
                  }}>
                    GAME OVER
                  </h1>
                  <div className="h-1 mx-auto w-48" style={{
                    background: 'linear-gradient(90deg, transparent, #ff3333, transparent)'
                  }} />
                </div>
                
                {/* Score display */}
                <div className="py-4" style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,0,0.1), transparent)',
                  border: '2px solid #665500',
                  borderLeft: 'none',
                  borderRight: 'none'
                }}>
                  <div className="text-yellow-300 text-sm mb-2 tracking-widest" style={{
                    textShadow: '1px 1px 0px #443300'
                  }}>FINAL SCORE</div>
                  <div className="text-5xl font-bold tracking-widest tabular-nums" style={{
                    color: '#ffff44',
                    textShadow: '3px 3px 0px #8b8b00, -1px -1px 0px #ffffaa',
                    fontFamily: 'monospace'
                  }}>
                    {score.toString().padStart(7, '0')}
                  </div>
                </div>
                
                {/* Continue prompt */}
                <div className="text-gray-400 text-sm animate-pulse tracking-wider">
                  PRESS START
                </div>
                
                {/* Restart button */}
                <button
                  onClick={restartGame}
                  className="relative px-8 py-4 font-bold text-xl tracking-widest transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)',
                    border: '4px solid #ff6666',
                    boxShadow: 'inset 0 2px 0 #ff8888, 0 4px 8px rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    textShadow: '2px 2px 0px #880000, -1px -1px 0px #ffaaaa'
                  }}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Menu - Authentic 16-bit Style */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto" style={{
          background: 'radial-gradient(circle at 50% 50%, #0a1a3e 0%, #000000 100%)'
        }}>
          {/* Animated stars background */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="relative max-w-xl w-full mx-4 z-10">
            {/* Outer glow effect */}
            <div className="absolute inset-0 animate-pulse" style={{
              background: 'radial-gradient(circle, rgba(74,170,255,0.4) 0%, transparent 70%)',
              filter: 'blur(30px)'
            }} />
            
            {/* Main menu panel */}
            <div className="relative" style={{
              background: 'linear-gradient(135deg, #1a2a5e 0%, #0a0a2e 100%)',
              border: '8px solid #4a6aaa',
              boxShadow: 'inset 0 4px 0 #6a8aff, inset 0 -4px 0 #2a3a5a, 0 12px 24px rgba(0,0,0,0.8)',
              imageRendering: 'pixelated'
            }}>
              <div className="p-10 text-center space-y-8">
                {/* Title with retro effect */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 blur-lg" style={{
                    color: '#4488ff',
                    textShadow: '0 0 30px #4488ff'
                  }}>
                    <h1 className="text-7xl font-bold tracking-widest">CONTRA</h1>
                    <h1 className="text-7xl font-bold tracking-widest">STRIKE</h1>
                  </div>
                  <h1 className="relative text-7xl font-bold tracking-widest" style={{
                    color: '#ffffff',
                    textShadow: '6px 6px 0px #1a4a8a, -2px -2px 0px #88ccff, 0 0 40px #4488ff',
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em'
                  }}>
                    CONTRA
                  </h1>
                  <h1 className="relative text-7xl font-bold tracking-widest mt-2" style={{
                    color: '#ffaa00',
                    textShadow: '6px 6px 0px #8a4a1a, -2px -2px 0px #ffdd88, 0 0 40px #ff8800',
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em'
                  }}>
                    STRIKE
                  </h1>
                  
                  {/* Subtitle */}
                  <div className="mt-4 text-cyan-300 text-sm tracking-widest flex items-center justify-center gap-2" style={{
                    textShadow: '1px 1px 0px #0a4a5a'
                  }}>
                    <span className="inline-block w-16 h-px bg-cyan-500" />
                    <span>16-BIT EDITION</span>
                    <span className="inline-block w-16 h-px bg-cyan-500" />
                  </div>
                </div>

                {/* Animated separator */}
                <div className="relative h-2 overflow-hidden">
                  <div className="absolute inset-0 animate-pulse" style={{
                    background: 'linear-gradient(90deg, transparent, #4a8aff, transparent)'
                  }} />
                </div>
                
                {/* Controls box */}
                <div className="relative mx-auto max-w-sm" style={{
                  background: 'linear-gradient(135deg, rgba(26,42,94,0.8) 0%, rgba(10,10,46,0.8) 100%)',
                  border: '4px solid #4a6aaa',
                  boxShadow: 'inset 0 2px 0 #6a8aff, inset 0 -2px 0 #2a3a5a'
                }}>
                  <div className="p-5 space-y-3">
                    <div className="text-yellow-300 font-bold text-sm mb-3 tracking-widest border-b-2 border-yellow-600 pb-2" style={{
                      textShadow: '1px 1px 0px #8b6914'
                    }}>
                      CONTROLS
                    </div>
                    <div className="space-y-2 text-sm">
                      {[
                        { keys: 'WASD / ARROWS', action: 'MOVE' },
                        { keys: 'SPACE / K', action: 'JUMP' },
                        { keys: 'J / ENTER', action: 'FIRE' },
                        { keys: '1 / 2 / 3', action: 'WEAPON' }
                      ].map((control, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-cyan-300 font-bold tracking-wider" style={{
                            textShadow: '1px 1px 0px #0a3a4a'
                          }}>{control.keys}</span>
                          <span className="text-white tracking-wider" style={{
                            textShadow: '1px 1px 0px #000000'
                          }}>{control.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Start button with animation */}
                <div className="relative pt-4">
                  <div className="absolute inset-0 animate-pulse" style={{
                    background: 'radial-gradient(circle, rgba(74,170,255,0.3) 0%, transparent 70%)',
                    filter: 'blur(15px)'
                  }} />
                  <button
                    onClick={() => useGameStore.getState().startGame()}
                    className="relative px-12 py-5 font-bold text-2xl tracking-widest transition-all hover:scale-110 active:scale-95 animate-pulse"
                    style={{
                      background: 'linear-gradient(180deg, #4a8aff 0%, #1a4a8a 50%, #0a2a5a 100%)',
                      border: '5px solid #6aaaff',
                      boxShadow: 'inset 0 3px 0 #8abfff, inset 0 -3px 0 #0a2a5a, 0 6px 12px rgba(0,0,0,0.7), 0 0 20px rgba(74,138,255,0.5)',
                      color: '#ffffff',
                      textShadow: '3px 3px 0px #0a2a5a, -1px -1px 0px #aaddff, 0 0 15px #4a8aff'
                    }}
                  >
                    ▶ START GAME
                  </button>
                </div>

                {/* Credits */}
                <div className="text-gray-500 text-xs tracking-wider pt-4 opacity-70">
                  © 2025 • PRESS START TO PLAY
                </div>
              </div>
            </div>

            {/* Corner decorations */}
            {[
              { top: '-8px', left: '-8px' },
              { top: '-8px', right: '-8px' },
              { bottom: '-8px', left: '-8px' },
              { bottom: '-8px', right: '-8px' }
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 border-4 border-yellow-400"
                style={{
                  ...pos,
                  boxShadow: '0 0 10px #ffaa00',
                  transform: 'rotate(45deg)'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
