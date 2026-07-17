import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gamepad2, Coins, Sparkles, Trophy, Zap, RotateCw, Play, Flame, AlertTriangle, CheckCircle2, Dices, RefreshCw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GamesPageProps {
  onBack: () => void;
  balance: number;
  currency: string;
  onEarn: (amount: number, gameTitle: string) => void;
  userLevel: number;
}

type ActiveGame = 'menu' | 'miner' | 'spin' | 'coin';

export const GamesPage: React.FC<GamesPageProps> = ({ onBack, balance, currency, onEarn, userLevel }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('menu');
  const [energy, setEnergy] = useState<number>(5);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [winMessage, setWinMessage] = useState<string>('');
  const [showLevelAlert, setShowLevelAlert] = useState<boolean>(false);

  // Energy regeneration simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => (prev < 5 ? prev + 1 : prev));
    }, 45000); // 45 seconds to regenerate 1 energy
    return () => clearInterval(interval);
  }, []);

  const triggerReward = (amount: number, gameName: string) => {
    onEarn(amount, gameName);
    setLastWin(amount);
    setWinMessage(`Congratulations! You earned ${currency}${amount.toLocaleString()} in ${gameName}!`);
    setTimeout(() => {
      setLastWin(null);
      setWinMessage('');
    }, 4000);
  };

  const consumeEnergy = (): boolean => {
    if (energy <= 0) {
      alert('Out of energy! Energy regenerates over time.');
      return false;
    }
    setEnergy(prev => prev - 1);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#030e21] text-[#f1f5f9] font-sans pb-12 relative overflow-hidden animate-fadeIn">
      {/* Background neon glows */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-x-12 -translate-y-12"></div>
      <div className="absolute bottom-12 right-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none translate-x-20"></div>

      {/* Floating win notification */}
      <AnimatePresence>
        {lastWin !== null && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 border-2 border-white p-4 rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.5)] z-[999] text-black text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Trophy size={20} className="animate-bounce" />
              <span className="font-black uppercase text-xs tracking-wider">BIG WIN CLAIMEED!</span>
            </div>
            <p className="font-black text-lg leading-tight">{winMessage}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-black/60">Credited to your dashboard</p>
          </motion.div>
        )}

        {showLevelAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-gradient-to-r from-red-600 via-pink-600 to-red-700 border-2 border-white p-4 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.5)] z-[999] text-white text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <Lock size={18} className="animate-pulse text-yellow-300" />
              <span className="font-black uppercase text-xs tracking-wider text-yellow-300">GAME ACCESS DENIED!</span>
            </div>
            <p className="font-black text-sm leading-tight">Lucky Spin Wheel is only available for VIP Level 4 users.</p>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-1 text-white/80">Upgrade your account to unlock this arena!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/5 bg-[#030e21]/80 backdrop-blur-md sticky top-0 z-[100]">
        <button 
          onClick={activeGame === 'menu' ? onBack : () => setActiveGame('menu')} 
          className="p-2 hover:bg-white/5 rounded-2xl border border-white/5 transition-all text-gray-400 active:scale-95"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <Gamepad2 size={16} className="text-yellow-500" />
            <h2 className="text-xs font-black tracking-widest text-white uppercase font-mono">GAMES ARENA</h2>
          </div>
          <span className="text-[8px] text-yellow-500/80 uppercase font-black tracking-[0.2em] mt-0.5">PLAY & EARN NAIRA</span>
        </div>
        <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full">
          <Zap size={12} className="text-yellow-400 animate-pulse" />
          <span className="text-[10px] font-black font-mono text-white">{energy}/5</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-5 mt-6 max-w-md mx-auto">
        
        {/* WALLET BAR */}
        <div className="bg-gradient-to-r from-[#0a1931] via-[#15305b] to-[#0a1931] border border-yellow-500/30 rounded-[2rem] p-4 flex justify-between items-center mb-6 shadow-xl shadow-yellow-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
          <div>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider mb-0.5">YOUR GAMEPLAY BALANCE</p>
            <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200">
              {currency}{balance.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Coins size={14} className="text-yellow-400" />
            <span className="text-[9px] font-black text-yellow-400 uppercase tracking-wide">REAL CASH</span>
          </div>
        </div>

        {/* 1. MENU VIEW */}
        {activeGame === 'menu' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">Select A Play-to-Earn Game</h3>
              <p className="text-[10px] text-gray-400">Energy is restored automatically. Every win adds direct wallet cash!</p>
            </div>

            {/* GAME 1 CARD: GOLD MINER */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame('miner')}
              className="group cursor-pointer bg-gradient-to-br from-[#121c35] to-[#050b18] border border-yellow-500/20 rounded-[2.5rem] p-5 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center border-2 border-white/20 shadow-lg shadow-yellow-500/20 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                  <Flame size={28} className="text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Hot Game
                    </span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase">1 Energy</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">Gold Mine Catcher</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Nuggets and gems are falling! Catch as many as possible within 25 seconds. Watch out for TNT bombs!
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black">
                    <span className="text-yellow-400">EARN UP TO ₦15,000</span>
                    <span className="text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                      Play Now <Play size={8} fill="currentColor" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GAME 2 CARD: SPIN WHEEL */}
            <motion.div 
              whileHover={userLevel >= 4 ? { scale: 1.02 } : { scale: 1 }}
              whileTap={userLevel >= 4 ? { scale: 0.98 } : { scale: 1 }}
              onClick={() => {
                if (userLevel >= 4) {
                  setActiveGame('spin');
                } else {
                  setShowLevelAlert(true);
                  setTimeout(() => setShowLevelAlert(false), 3000);
                }
              }}
              className={`group cursor-pointer bg-gradient-to-br from-[#121c35] to-[#050b18] border rounded-[2.5rem] p-5 relative overflow-hidden shadow-2xl transition-all duration-300 ${userLevel >= 4 ? 'border-yellow-500/20' : 'border-red-500/10 opacity-70'}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center border-2 border-white/20 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                  {userLevel >= 4 ? (
                    <Sparkles size={28} className="text-yellow-300" />
                  ) : (
                    <Lock size={28} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Fortune
                    </span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase">1 Energy</span>
                    {userLevel < 4 && (
                      <span className="text-[8px] font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5">
                        <Lock size={8} /> LEVEL 4 ONLY
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">Lucky Spin Wheel</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Spin the golden fortune wheel to win direct cash prizes. Guaranteed wins on every single spin!
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black">
                    <span className="text-yellow-400">EARN UP TO ₦50,000</span>
                    {userLevel >= 4 ? (
                      <span className="text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                        Play Now <Play size={8} fill="currentColor" />
                      </span>
                    ) : (
                      <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                        Locked <Lock size={8} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* GAME 3 CARD: COIN FLIP */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveGame('coin')}
              className="group cursor-pointer bg-gradient-to-br from-[#121c35] to-[#050b18] border border-yellow-500/20 rounded-[2.5rem] p-5 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center border-2 border-white/20 shadow-lg shadow-yellow-500/20 group-hover:rotate-6 transition-all duration-300 flex-shrink-0">
                  <Dices size={28} className="text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Multiplier
                    </span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase">No Energy Required</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">Double or Nothing</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                    Stake a tiny amount to multiply it! Choose Heads or Tails and flip the secure cryptographic golden coin.
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-black">
                    <span className="text-yellow-400">2X MULTIPLIER PAYOUT</span>
                    <span className="text-white bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                      Play Now <Play size={8} fill="currentColor" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 2. GAME: GOLD MINE CATCHER */}
        {activeGame === 'miner' && (
          <GoldMineGame 
            consumeEnergy={consumeEnergy}
            energy={energy}
            currency={currency}
            onReward={(amt) => triggerReward(amt, 'Gold Mine Catcher')}
            onExit={() => setActiveGame('menu')}
          />
        )}

        {/* 3. GAME: LUCKY SPIN WHEEL */}
        {activeGame === 'spin' && (
          <LuckySpinWheel 
            consumeEnergy={consumeEnergy}
            energy={energy}
            currency={currency}
            onReward={(amt) => triggerReward(amt, 'Lucky Spin Wheel')}
            onExit={() => setActiveGame('menu')}
          />
        )}

        {/* 4. GAME: DOUBLE OR NOTHING COIN FLIP */}
        {activeGame === 'coin' && (
          <CoinFlipGame 
            balance={balance}
            currency={currency}
            onReward={(amt) => triggerReward(amt, 'Double or Nothing')}
            onLose={(amt) => {
              onEarn(-amt, 'Double or Nothing bet');
              setLastWin(null);
            }}
            onExit={() => setActiveGame('menu')}
          />
        )}

      </div>
    </div>
  );
};

/* ==============================================
   SUBGAME: GOLD MINE GAME (MINE TAP)
   ============================================== */
interface SubGameProps {
  consumeEnergy: () => boolean;
  energy: number;
  currency: string;
  onReward: (amount: number) => void;
  onExit: () => void;
}

const GoldMineGame: React.FC<SubGameProps> = ({ consumeEnergy, energy, currency, onReward, onExit }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [items, setItems] = useState<Array<{ id: number; type: 'gold' | 'diamond' | 'tnt'; x: number; y: number; scale: number; speed: number }>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animRef = useRef<number | null>(null);

  const startGame = () => {
    if (!consumeEnergy()) return;
    setScore(0);
    setTimeLeft(25);
    setGameState('playing');
    setItems([]);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // Timer Interval
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Dynamic item spawner
    const spawnInterval = setInterval(() => {
      const types: ('gold' | 'diamond' | 'tnt')[] = ['gold', 'gold', 'gold', 'diamond', 'tnt'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      setItems(prev => [
        ...prev,
        {
          id: Math.random(),
          type: randomType,
          x: Math.random() * 85 + 5, // Percent
          y: -10, // Start above
          scale: randomType === 'diamond' ? 0.8 : randomType === 'tnt' ? 1.1 : 1.0,
          speed: 1.5 + Math.random() * 2 // fall speed
        }
      ]);
    }, 800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearInterval(spawnInterval);
    };
  }, [gameState]);

  // Item falling animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const updatePositions = () => {
      setItems(prev => 
        prev
          .map(item => ({ ...item, y: item.y + item.speed }))
          .filter(item => item.y < 110) // Filter items that fall past bottom
      );
      animRef.current = requestAnimationFrame(updatePositions);
    };
    
    animRef.current = requestAnimationFrame(updatePositions);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameState]);

  const handleItemTap = (id: number, type: 'gold' | 'diamond' | 'tnt') => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    if (type === 'gold') {
      setScore(prev => prev + 1500);
    } else if (type === 'diamond') {
      setScore(prev => prev + 4500);
    } else if (type === 'tnt') {
      // Explode: lose points
      setScore(prev => Math.max(0, prev - 3000));
    }
  };

  const handleClaim = () => {
    if (score > 0) {
      onReward(score);
    }
    setGameState('idle');
  };

  return (
    <div className="bg-[#040d1a] border border-yellow-500/20 rounded-[2.5rem] p-5 relative overflow-hidden flex flex-col min-h-[460px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">MINE CATCHER</span>
        <button onClick={onExit} className="text-[9px] text-gray-500 font-bold uppercase tracking-wider hover:text-white">Exit</button>
      </div>

      {gameState === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-yellow-500/20 mb-4 animate-pulse">
            ⛏️
          </div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-2">Deep Mine Catcher</h3>
          <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mb-6">
            Nuggets and Diamonds are falling from the node vaults. Tap them to collect gold. Tap TNT bombs, and you'll blow up your earnings!
          </p>

          <div className="w-full max-w-[240px] space-y-2 text-[9px] bg-white/5 border border-white/5 rounded-2xl p-3 mb-6 text-left">
            <div className="flex justify-between">
              <span className="text-yellow-400 font-black">⭐ GOLD NUGGET</span>
              <span className="text-white font-mono">+₦1,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400 font-black">💎 VAULT DIAMOND</span>
              <span className="text-white font-mono">+₦4,500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400 font-black">💥 TNT EXPLOSIVE</span>
              <span className="text-red-400 font-mono">-₦3,000</span>
            </div>
          </div>

          <button 
            onClick={startGame}
            disabled={energy <= 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black font-black text-[11px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50"
          >
            Start Mining (1 Energy)
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col justify-between relative select-none">
          {/* Game Bar */}
          <div className="flex justify-between items-center bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 z-10">
            <div>
              <span className="text-[8px] text-gray-500 uppercase font-black block">SCORE</span>
              <span className="text-xs font-black text-yellow-400 font-mono">{currency}{score.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[8px] text-gray-500 uppercase font-black block">TIME REMAINING</span>
              <span className={`text-xs font-black font-mono ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</span>
            </div>
          </div>

          {/* Falling Canvas Area */}
          <div className="flex-1 relative overflow-hidden bg-[#020710]/80 border border-white/5 rounded-2xl my-3 min-h-[260px]">
            {items.map(item => (
              <motion.button
                key={item.id}
                onMouseDown={() => handleItemTap(item.id, item.type)}
                onTouchStart={() => handleItemTap(item.id, item.type)}
                style={{ 
                  left: `${item.x}%`, 
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) scale(${item.scale})` 
                }}
                className="absolute w-10 h-10 flex items-center justify-center cursor-pointer select-none active:scale-90 transition-transform"
              >
                {item.type === 'gold' && (
                  <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.5)]">⭐</span>
                )}
                {item.type === 'diamond' && (
                  <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]">💎</span>
                )}
                {item.type === 'tnt' && (
                  <span className="text-2xl filter drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)]">💥</span>
                )}
              </motion.button>
            ))}
          </div>

          <p className="text-[8px] text-center text-gray-500 uppercase tracking-widest leading-none">TAP FALLING ASSETS IMMEDIATELY</p>
        </div>
      )}

      {gameState === 'ended' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">Vault extraction Complete</h3>
          <p className="text-[10px] text-gray-400 mb-6 font-mono uppercase">You mined total assets valued at</p>
          
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 mb-6">
            {currency}{score.toLocaleString()}
          </p>

          <button 
            onClick={handleClaim}
            className="w-full py-4 rounded-2xl bg-[#0e3b1f] border border-green-500/30 text-green-400 font-black text-[11px] uppercase tracking-wider hover:bg-[#124b27] active:scale-95 transition-all shadow-lg"
          >
            Claim Gold to Dashboard Balance
          </button>
        </div>
      )}
    </div>
  );
};


/* ==============================================
   SUBGAME: LUCKY SPIN WHEEL
   ============================================== */
const LuckySpinWheel: React.FC<SubGameProps> = ({ consumeEnergy, energy, currency, onReward, onExit }) => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [prize, setPrize] = useState<number | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  const prizes = [1500, 5000, 2500, 10000, 3000, 25000, 5000, 50000];
  const colors = [
    '#05152e', // Dark Blue
    '#ae942d', // Gold
    '#0b2347', // Light Dark Blue
    '#ae942d',
    '#05152e',
    '#dfbe38', // Bright Gold
    '#0b2347',
    '#facc15'  // Jackpot Gold
  ];

  const handleSpin = () => {
    if (spinning) return;
    if (!consumeEnergy()) return;

    setPrize(null);
    setSpinning(true);

    const spins = 5; // how many full spins
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const degreePerSegment = 360 / prizes.length;
    
    // We want the wheel to spin clockwise and stop with the selected segment at the very top (3 o'clock offset etc)
    // To land on 'randomIndex', we compute target angle.
    const targetAngle = 360 - (randomIndex * degreePerSegment) + (degreePerSegment / 2);
    const newRotation = rotation + (spins * 360) + targetAngle;

    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setPrize(prizes[randomIndex]);
    }, 4000); // Animation duration
  };

  const handleClaim = () => {
    if (prize !== null) {
      onReward(prize);
    }
    setPrize(null);
  };

  return (
    <div className="bg-[#040d1a] border border-yellow-500/20 rounded-[2.5rem] p-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">LUCKY FORTUNE SPIN</span>
        <button onClick={onExit} className="text-[9px] text-gray-500 font-bold uppercase tracking-wider hover:text-white">Exit</button>
      </div>

      {prize === null ? (
        <div className="flex-1 flex flex-col items-center justify-center relative w-full">
          
          {/* Wheel Pointer */}
          <div className="absolute top-0 z-20 -mt-1 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow-[0_4px_10px_rgba(234,179,8,0.5)]"></div>

          {/* Wheel Container */}
          <div className="relative w-56 h-56 rounded-full border-4 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.15)] overflow-hidden bg-black flex items-center justify-center">
            
            {/* Inner Wheel Graphics */}
            <div 
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
              }}
              className="absolute w-full h-full rounded-full overflow-hidden origin-center"
            >
              {prizes.map((p, idx) => {
                const angle = 360 / prizes.length;
                const rot = idx * angle;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      transform: `rotate(${rot}deg)`,
                      clipPath: 'polygon(50% 50%, 0 0, 100% 0)' 
                    }}
                    className="absolute top-0 left-0 w-full h-full origin-center flex flex-col items-center pt-2"
                  >
                    <div 
                      style={{ backgroundColor: colors[idx] }}
                      className="absolute inset-0 w-full h-full -z-10"
                    ></div>
                    <span 
                      style={{ transform: `rotate(${angle / 2}deg)` }}
                      className="text-[9px] font-black text-white mt-4 tracking-tighter uppercase font-mono"
                    >
                      ₦{p >= 1000 ? `${p/1000}k` : p}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Inner Center Hub */}
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white z-10 flex items-center justify-center shadow-lg shadow-black/80">
              <span className="text-[10px] text-black font-black uppercase">WIN</span>
            </div>
          </div>

          <div className="mt-8 text-center px-4">
            <h3 className="text-xs font-black uppercase text-white tracking-widest mb-1">Golden Fortune Wheel</h3>
            <p className="text-[9px] text-gray-500 uppercase tracking-wide leading-relaxed">
              Every slot contains a guaranteed cash bonus reward. Spin to unlock instant funds!
            </p>
          </div>

          <button 
            onClick={handleSpin}
            disabled={spinning || energy <= 0}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black font-black text-[11px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {spinning ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                TUNELING FORTUNE...
              </>
            ) : (
              `SPIN FORTUNE (1 Energy)`
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-yellow-500/20 mb-4 animate-bounce">
            🎁
          </div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white mb-1">CONGRATULATIONS!</h3>
          <p className="text-[10px] text-gray-400 mb-6 font-mono uppercase">Your spin hit the multiplier slice of</p>
          
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-200 mb-6">
            {currency}{prize.toLocaleString()}
          </p>

          <button 
            onClick={handleClaim}
            className="w-full py-4 rounded-2xl bg-[#0e3b1f] border border-green-500/30 text-green-400 font-black text-[11px] uppercase tracking-wider hover:bg-[#124b27] active:scale-95 transition-all shadow-lg"
          >
            Claim Rewards to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};


/* ==============================================
   SUBGAME: DOUBLE OR NOTHING (COIN FLIP)
   ============================================== */
interface CoinFlipProps {
  balance: number;
  currency: string;
  onReward: (amount: number) => void;
  onLose: (amount: number) => void;
  onExit: () => void;
}

const CoinFlipGame: React.FC<CoinFlipProps> = ({ balance, currency, onReward, onLose, onExit }) => {
  const [stake, setStake] = useState<string>('1000');
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [flipping, setFlipping] = useState<boolean>(false);
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | null>(null);
  const [status, setStatus] = useState<'idle' | 'won' | 'lost'>('idle');
  const [coinRotation, setCoinRotation] = useState<number>(0);

  const handleFlip = () => {
    const amt = Number(stake);
    if (!stake || amt <= 0) {
      alert('Enter a valid amount');
      return;
    }
    if (amt > balance) {
      alert('Insufficient wallet funds to stake!');
      return;
    }

    setFlipping(true);
    setStatus('idle');
    setFlipResult(null);

    // Dynamic rotation speed
    const spins = 10; 
    const result: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails';
    // Calculate next rotation to always align perfectly to 0 (heads) or 180 (tails) modulo 360
    const baseRotation = Math.ceil(coinRotation / 360) * 360;
    const newRot = baseRotation + (spins * 360) + (result === 'heads' ? 0 : 180);
    
    setCoinRotation(newRot);

    setTimeout(() => {
      setFlipping(false);
      setFlipResult(result);
      if (result === choice) {
        setStatus('won');
        onReward(amt); // Won double
      } else {
        setStatus('lost');
        onLose(amt); // Deduct stake
      }
    }, 2500);
  };

  return (
    <div className="bg-[#040d1a] border border-yellow-500/20 rounded-[2.5rem] p-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[460px]">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">DOUBLE OR NOTHING</span>
        <button onClick={onExit} className="text-[9px] text-gray-500 font-bold uppercase tracking-wider hover:text-white">Exit</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        
        {/* 3D coin render container */}
        <div className="perspective-1000 w-32 h-32 flex items-center justify-center relative mb-6">
          <div 
            style={{ 
              transform: `rotateY(${coinRotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: flipping ? 'transform 2.5s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none'
            }}
            className="w-24 h-24 rounded-full relative shadow-2xl origin-center"
          >
            {/* Heads side */}
            <div 
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-600 border-4 border-white flex items-center justify-center shadow-inner"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-black/20 flex flex-col items-center justify-center">
                <span className="text-xl leading-none">🪙</span>
                <span className="text-[8px] font-black text-black leading-none uppercase mt-1">HEADS</span>
              </div>
            </div>

            {/* Tails side */}
            <div 
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 border-4 border-white flex items-center justify-center shadow-inner"
            >
              <div className="w-16 h-16 rounded-full border border-dashed border-white/30 flex flex-col items-center justify-center">
                <span className="text-xl leading-none">💎</span>
                <span className="text-[8px] font-black text-white leading-none uppercase mt-1 font-mono">TAILS</span>
              </div>
            </div>
          </div>
        </div>

        {status === 'idle' && !flipping && (
          <>
            {/* Choice selectors */}
            <div className="grid grid-cols-2 gap-4 w-full px-6 mb-6">
              <button 
                onClick={() => setChoice('heads')}
                className={`py-3 rounded-2xl border font-black text-[10px] uppercase tracking-wider transition-all ${choice === 'heads' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-lg shadow-yellow-500/5' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                SELECT HEADS
              </button>
              <button 
                onClick={() => setChoice('tails')}
                className={`py-3 rounded-2xl border font-black text-[10px] uppercase tracking-wider transition-all ${choice === 'tails' ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'}`}
              >
                SELECT TAILS
              </button>
            </div>

            {/* Stake Input */}
            <div className="w-full px-6 mb-4">
              <label className="text-[8.5px] font-black uppercase text-gray-500 tracking-widest block mb-1.5 pl-1.5">Enter Stake Amount (Naira)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-500 font-bold text-xs font-mono">
                  {currency}
                </div>
                <input 
                  type="number" 
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono font-bold focus:border-yellow-500/50 outline-none text-white text-center"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {['1000', '2000', '5000', '10000'].map(val => (
                  <button 
                    key={val}
                    onClick={() => setStake(val)}
                    className="flex-1 py-1 text-[8.5px] font-bold bg-white/5 border border-white/5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    +{currency}{val}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleFlip}
              className="w-full mt-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black font-black text-[11px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg"
            >
              Flip Golden Coin
            </button>
          </>
        )}

        {flipping && (
          <div className="text-center py-6">
            <h3 className="text-xs font-black uppercase text-yellow-500 tracking-widest mb-1.5 animate-pulse">CRYPTOGRAPHIC FLIPPING...</h3>
            <p className="text-[9px] text-gray-500 uppercase tracking-wide">Waiting for decentralized CBN consensus</p>
          </div>
        )}

        {status === 'won' && !flipping && (
          <div className="text-center py-4 animate-scaleUp">
            <div className="inline-flex p-3 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 mb-3 animate-bounce">
              <Trophy size={20} />
            </div>
            <h3 className="text-sm font-black uppercase text-green-400 tracking-wider mb-1">Double Victory!</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase mb-4">The coin landed on <span className="text-white font-bold">{flipResult}</span>! You doubled your stake!</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-6 font-mono">
              +{currency}{(Number(stake) * 2).toLocaleString()}
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="w-full px-12 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Flip Again
            </button>
          </div>
        )}

        {status === 'lost' && !flipping && (
          <div className="text-center py-4 animate-scaleUp">
            <div className="inline-flex p-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-black uppercase text-red-400 tracking-wider mb-1">Unlucky Flip</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase mb-4">The coin landed on <span className="text-white font-bold">{flipResult}</span>. Your stake was extracted.</p>
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-6 font-mono">
              -{currency}{Number(stake).toLocaleString()}
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="w-full px-12 py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider text-gray-400 hover:bg-white/10 hover:text-white transition-all"
            >
              Try Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
