import { useGameStore } from "../lib/stores/useGameStore";
import { Card, CardContent } from "./ui/card";

const GameUI = () => {
  const { player, gameState, score, restartGame } = useGameStore();

  const getWeaponName = (weapon: string) => {
    switch (weapon) {
      case 'machine_gun': return 'MACHINE GUN';
      case 'spread_gun': return 'SPREAD GUN';
      case 'laser': return 'LASER';
      default: return 'BASIC GUN';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* HUD - SNES Style */}
      {gameState === 'playing' && player && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {/* Health and weapon info */}
          <div className="bg-gradient-to-br from-gray-900/85 to-black/85 backdrop-blur-sm border-4 border-blue-400/60 rounded-lg p-3 shadow-2xl">
            <div className="text-white space-y-2">
              {/* Health */}
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">LIFE:</span>
                <div className="flex gap-1">
                  {Array.from({ length: player.maxHealth }, (_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 border-2 ${
                        i < player.health 
                          ? 'bg-gradient-to-br from-red-500 to-red-700 border-red-300' 
                          : 'bg-gray-800/50 border-gray-600'
                      } shadow-lg`}
                    />
                  ))}
                </div>
              </div>
              {/* Weapon */}
              <div className="text-yellow-300 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <span className="font-bold">WEAPON:</span>
                <div className="text-xs mt-1 px-2 py-1 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 border border-yellow-400/60 rounded inline-block ml-1">
                  {getWeaponName(player.currentWeapon)}
                </div>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-gray-900/85 to-black/85 backdrop-blur-sm border-4 border-green-400/60 rounded-lg p-3 shadow-2xl">
            <div className="text-white">
              <div className="text-green-300 font-bold text-sm mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">SCORE</div>
              <div className="text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{score.toString().padStart(6, '0')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Screen - SNES Style */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/70 via-red-950/70 to-black/70 backdrop-blur-md pointer-events-auto">
          <div className="bg-gradient-to-br from-red-900/95 to-red-950/95 border-8 border-red-500/80 rounded-2xl p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" style={{ 
                textShadow: '4px 4px 0px #8b0000, -2px -2px 0px #ff6666'
              }}>
                GAME OVER
              </h1>
              <div className="bg-black/40 border-4 border-red-400/60 rounded-lg p-4 mb-6">
                <p className="text-xl text-red-200 mb-2">FINAL SCORE</p>
                <p className="text-4xl font-bold text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{score.toString().padStart(6, '0')}</p>
              </div>
              <p className="text-gray-300 mb-6 text-sm">Press R or tap to continue</p>
              <button
                onClick={restartGame}
                className="bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg border-4 border-red-300/60 shadow-xl transition-all hover:scale-105 active:scale-95"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                RESTART
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Menu - SNES Style */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/70 via-blue-950/70 to-black/70 backdrop-blur-md pointer-events-auto">
          <div className="bg-gradient-to-br from-blue-900/95 to-blue-950/95 border-8 border-blue-400/80 rounded-2xl p-8 shadow-2xl max-w-md">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]" style={{ 
                textShadow: '4px 4px 0px #1a1a4a, -2px -2px 0px #6666ff'
              }}>
                CONTRA STRIKE
              </h1>
              <p className="text-blue-300 text-sm mb-6 italic">16-BIT EDITION</p>
              
              <div className="bg-black/40 border-4 border-blue-400/60 rounded-lg p-4 mb-6 text-left">
                <div className="text-white space-y-2 text-sm">
                  <p className="text-yellow-300 font-bold mb-2">CONTROLS:</p>
                  <p><span className="text-blue-300">WASD / Arrows</span> - Move</p>
                  <p><span className="text-green-300">Space/K</span> - Jump</p>
                  <p><span className="text-red-300">J/Enter</span> - Shoot</p>
                  <p><span className="text-purple-300">1/2/3</span> - Change Weapons</p>
                </div>
              </div>
              
              <button
                onClick={() => useGameStore.getState().startGame()}
                className="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg border-4 border-blue-300/60 shadow-xl transition-all hover:scale-105 active:scale-95 animate-pulse"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                START GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameUI;
