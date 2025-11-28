'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type CellType = 'normal' | 'green' | 'red';

interface Cell {
  id: number;
  type: CellType;
  image?: string; // URL or placeholder for cell background
  benefit?: string; // Description for green cells
  penalty?: string; // Description for red cells
  moveBonus?: number; // Number of cells to move forward (green) or backward (red)
}

interface Player {
  id: number;
  name: string;
  color: string;
  position: number;
}

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

const GRID_SIZE = 10; // 10x10 grid (configurable)
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const DICE_MIN = 1;
const DICE_MAX = 6;

// Configure special cells: green cells (benefits) and red cells (penalties)
const SPECIAL_CELLS: Record<number, Omit<Cell, 'id'>> = {
  7: { type: 'green', benefit: 'Lucky Lily Pad! Jump forward 5 spaces!', moveBonus: 5 },
  15: { type: 'red', penalty: 'Muddy Swamp! Slip back 3 spaces.', moveBonus: -3 },
  23: { type: 'green', benefit: 'Fast Current! Ride ahead 7 spaces!', moveBonus: 7 },
  34: { type: 'red', penalty: 'Tangled Weeds! Move back 4 spaces.', moveBonus: -4 },
  45: { type: 'green', benefit: 'Magic Mushroom! Leap forward 6 spaces!', moveBonus: 6 },
  56: { type: 'red', penalty: 'Slippery Rock! Fall back 5 spaces.', moveBonus: -5 },
  67: { type: 'green', benefit: 'Rainbow Bridge! Skip ahead 8 spaces!', moveBonus: 8 },
  78: { type: 'red', penalty: 'Quicksand Pit! Sink back 6 spaces.', moveBonus: -6 },
  89: { type: 'green', benefit: 'Power Boost! Final sprint 10 spaces!', moveBonus: 10 },
};

// Player colors (supports 2-5 players)
const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// Placeholder cell background images (replace with your own images)
const CELL_IMAGES: string[] = [
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0f2fe" width="100" height="100"/%3E%3C/svg%3E',
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23dbeafe" width="100" height="100"/%3E%3C/svg%3E',
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Generate the board cells
function generateBoard(): Cell[] {
  const cells: Cell[] = [];
  for (let i = 1; i <= TOTAL_CELLS; i++) {
    const specialCell = SPECIAL_CELLS[i];
    cells.push({
      id: i,
      type: specialCell?.type || 'normal',
      image: CELL_IMAGES[i % CELL_IMAGES.length],
      benefit: specialCell?.benefit,
      penalty: specialCell?.penalty,
      moveBonus: specialCell?.moveBonus,
    });
  }
  return cells;
}

// Calculate row for snake pattern (bottom-left is cell 1)
function getCellRow(cellId: number): number {
  return Math.floor((cellId - 1) / GRID_SIZE);
}

// Calculate column considering snake/boustrophedon pattern
function getCellColumn(cellId: number): number {
  const row = getCellRow(cellId);
  const posInRow = (cellId - 1) % GRID_SIZE;
  // Even rows go left-to-right, odd rows go right-to-left
  return row % 2 === 0 ? posInRow : GRID_SIZE - 1 - posInRow;
}

// ============================================================================
// FROG SVG COMPONENT
// ============================================================================

const FrogPiece: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-md"
  >
    <circle cx="12" cy="12" r="10" fill={color} />
    <circle cx="9" cy="10" r="2" fill="white" />
    <circle cx="15" cy="10" r="2" fill="white" />
    <circle cx="9" cy="10" r="1" fill="#1f2937" />
    <circle cx="15" cy="10" r="1" fill="#1f2937" />
    <path d="M 8 15 Q 12 17 16 15" stroke="#1f2937" strokeWidth="1.5" fill="none" />
  </svg>
);

// ============================================================================
// ANIMATED DICE COMPONENT
// ============================================================================

const AnimatedDice: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
  const dots = [
    [],
    [4],
    [0, 8],
    [0, 4, 8],
    [0, 2, 6, 8],
    [0, 2, 4, 6, 8],
    [0, 2, 3, 5, 6, 8],
  ];

  return (
    <div
      className={`w-16 h-16 bg-white border-4 border-gray-800 rounded-lg grid grid-cols-3 grid-rows-3 gap-1 p-2 transition-transform ${
        isRolling ? 'animate-spin' : ''
      }`}
    >
      {[...Array(9)].map((_, i) => (
        <div key={i} className="flex items-center justify-center">
          {dots[value]?.includes(i) && (
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// SOUND EFFECTS (using Web Audio API)
// ============================================================================

// Create a frog ribbit/croak sound effect
function playFrogSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Frog croak: low frequency with quick modulation
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(60, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (e) {
    // Silently fail if audio not supported
    console.log('Audio not supported');
  }
}

// Create a dice rolling sound effect
function playDiceSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple short clicks to simulate dice rolling
    for (let i = 0; i < 8; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(100 + Math.random() * 100, audioContext.currentTime);
      
      const startTime = audioContext.currentTime + (i * 0.07);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.05);
    }
  } catch (e) {
    // Silently fail if audio not supported
    console.log('Audio not supported');
  }
}

// ============================================================================
// MAIN GAME COMPONENT
// ============================================================================

export default function FrogRaceGame() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [eventLog, setEventLog] = useState<string[]>([]);

  const board = useRef(generateBoard()).current;
  const rollButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize players when game starts
  const startGame = () => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < numPlayers; i++) {
      newPlayers.push({
        id: i + 1,
        name: `Frog ${i + 1}`,
        color: PLAYER_COLORS[i],
        position: 0, // Start before cell 1
      });
    }
    setPlayers(newPlayers);
    setCurrentPlayerIndex(0);
    setWinner(null);
    setEventLog([]);
    setGameStarted(true);
  };

  // Restart game
  const restartGame = () => {
    setGameStarted(false);
    setWinner(null);
    setEventLog([]);
  };

  // Add event to log
  const addLog = (message: string) => {
    setEventLog((prev) => [message, ...prev].slice(0, 10));
  };

  // Roll dice
  const rollDice = () => {
    if (isRolling || isAnimating || winner) return;

    setIsRolling(true);
    playDiceSound(); // Play dice rolling sound
    const roll = Math.floor(Math.random() * (DICE_MAX - DICE_MIN + 1)) + DICE_MIN;

    // Animate dice rolling
    setTimeout(() => {
      setDiceValue(roll);
      setIsRolling(false);
      addLog(`${players[currentPlayerIndex].name} rolled a ${roll}`);
      movePlayer(roll);
    }, 600);
  };

  // Move player with step-by-step animation
  const movePlayer = async (steps: number) => {
    setIsAnimating(true);
    const player = players[currentPlayerIndex];
    let currentPos = player.position;

    // Animate each step
    for (let i = 0; i < steps; i++) {
      if (currentPos >= TOTAL_CELLS) break; // Don't move past the end
      currentPos++;
      
      playFrogSound(); // Play frog sound on each hop

      await new Promise((resolve) => setTimeout(resolve, 300));
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === currentPlayerIndex ? { ...p, position: currentPos } : p
        )
      );
    }

    // Check if player reached the end
    if (currentPos >= TOTAL_CELLS) {
      setWinner(player);
      setIsAnimating(false);
      return;
    }

    // Check for special cell
    const cell = board[currentPos - 1];
    if (cell.type === 'green' && cell.moveBonus) {
      setModalContent({
        title: '🎉 Lucky Break!',
        message: cell.benefit || '',
      });
      setShowModal(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowModal(false);
      addLog(`${player.name} landed on a lucky spot!`);

      // Apply bonus movement
      const bonusPos = Math.min(currentPos + cell.moveBonus, TOTAL_CELLS);
      for (let i = currentPos + 1; i <= bonusPos; i++) {
        playFrogSound(); // Play frog sound on bonus movement
        await new Promise((resolve) => setTimeout(resolve, 200));
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === currentPlayerIndex ? { ...p, position: i } : p
          )
        );
      }
      currentPos = bonusPos;
    } else if (cell.type === 'red' && cell.moveBonus) {
      setModalContent({
        title: '⚠️ Oh No!',
        message: cell.penalty || '',
      });
      setShowModal(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowModal(false);
      addLog(`${player.name} hit a setback!`);

      // Apply penalty movement
      const penaltyPos = Math.max(currentPos + cell.moveBonus, 1);
      for (let i = currentPos - 1; i >= penaltyPos; i--) {
        playFrogSound(); // Play frog sound on penalty movement
        await new Promise((resolve) => setTimeout(resolve, 200));
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === currentPlayerIndex ? { ...p, position: i } : p
          )
        );
      }
    }

    // Check for winner after special cell effects
    const finalPlayer = players[currentPlayerIndex];
    if (finalPlayer.position >= TOTAL_CELLS) {
      setWinner(finalPlayer);
    } else {
      // Next player's turn
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }

    setIsAnimating(false);
  };

  // Keyboard accessibility for roll button
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (gameStarted && !isRolling && !isAnimating && !winner) {
          rollButtonRef.current?.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isRolling, isAnimating, winner]);

  // ============================================================================
  // RENDER: START SCREEN
  // ============================================================================

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-6 text-green-700">
            🐸 Frog Race 🐸
          </h1>
          <p className="text-gray-600 text-center mb-8">
            A fun board game adventure! Race to the finish while avoiding pitfalls and
            catching lucky breaks!
          </p>

          <div className="mb-6">
            <label
              htmlFor="player-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Players:
            </label>
            <select
              id="player-select"
              value={numPlayers}
              onChange={(e) => setNumPlayers(Number(e.target.value))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              aria-label="Select number of players"
            >
              {[2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Players
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
            aria-label="Start game"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: GAME BOARD
  // ============================================================================

  return (
    <div className="h-screen bg-gradient-to-br from-green-100 to-blue-100 p-2 sm:p-3 lg:p-4 overflow-hidden">
      <div className="max-w-[1920px] mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 mb-2 sm:mb-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">
              🐸 Frog Race
            </h1>
            <button
              onClick={restartGame}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base"
              aria-label="Restart game"
            >
              Restart Game
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-2 sm:gap-3 flex-1 min-h-0">
          {/* Main Board */}
          <div className="min-h-0 flex">
            <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 flex-1 flex items-center justify-center">
              <div
                className="grid gap-0.5 sm:gap-1"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  aspectRatio: '1',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'min(100%, calc(100vh - 200px))',
                  height: 'min(100%, calc(100vh - 200px))',
                }}
              >
                {/* Render cells from bottom to top (cell 1 at bottom-left) */}
                {[...Array(GRID_SIZE)].map((_, rowIdx) => {
                  const row = GRID_SIZE - 1 - rowIdx; // Reverse for bottom-to-top
                  return [...Array(GRID_SIZE)].map((_, colIdx) => {
                    // Calculate cell ID based on snake pattern
                    let cellId: number;
                    if (row % 2 === 0) {
                      cellId = row * GRID_SIZE + colIdx + 1;
                    } else {
                      cellId = row * GRID_SIZE + (GRID_SIZE - 1 - colIdx) + 1;
                    }

                    const cell = board[cellId - 1];
                    const playersOnCell = players.filter((p) => p.position === cellId);

                    return (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all ${
                          cell.type === 'green'
                            ? 'border-green-500 bg-green-100'
                            : cell.type === 'red'
                            ? 'border-red-500 bg-red-100'
                            : 'border-gray-300 bg-blue-50'
                        }`}
                        style={{
                          backgroundImage: cell.image ? `url(${cell.image})` : undefined,
                          backgroundSize: 'cover',
                        }}
                        aria-label={`Cell ${cellId}`}
                      >
                        {/* Cell number */}
                        <span className="absolute top-0.5 left-0.5 text-[10px] sm:text-xs font-bold text-gray-700 bg-white bg-opacity-75 rounded px-0.5 sm:px-1">
                          {cellId}
                        </span>

                        {/* Players on this cell */}
                        <div className="flex flex-wrap gap-0.5 items-center justify-center">
                          {playersOnCell.map((player) => (
                            <div key={player.id} title={player.name}>
                              <FrogPiece color={player.color} size={12} />
                            </div>
                          ))}
                        </div>

                        {/* Finish flag on last cell */}
                        {cellId === TOTAL_CELLS && (
                          <span className="absolute bottom-0.5 right-0.5 text-sm sm:text-lg">
                            🏁
                          </span>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Controls & Info */}
          <div className="flex flex-col gap-2 min-h-0 overflow-hidden">
            {/* Current Player */}
            <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-bold mb-1.5 text-gray-800">Current Turn</h2>
              <div className="flex items-center gap-2">
                <FrogPiece color={players[currentPlayerIndex].color} size={28} />
                <div>
                  <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                    {players[currentPlayerIndex].name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Position: {players[currentPlayerIndex].position || 'Start'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dice & Roll Button */}
            <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 flex flex-col items-center gap-2 flex-shrink-0">
              <AnimatedDice value={diceValue} isRolling={isRolling} />
              <button
                ref={rollButtonRef}
                onClick={rollDice}
                disabled={isRolling || isAnimating || !!winner}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-3 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 text-xs sm:text-sm"
                aria-label="Roll dice"
                aria-disabled={isRolling || isAnimating || !!winner}
              >
                {isRolling ? 'Rolling...' : isAnimating ? 'Moving...' : 'Roll Dice'}
              </button>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                Space/Enter to roll
              </p>
            </div>

            {/* Players List */}
            <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 flex-shrink-0">
              <h2 className="text-sm sm:text-base font-bold mb-1.5 text-gray-800">Players</h2>
              <div className="space-y-1.5">
                {players.map((player, idx) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 p-1.5 rounded-lg ${
                      idx === currentPlayerIndex ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'bg-gray-50'
                    }`}
                  >
                    <FrogPiece color={player.color} size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[10px] sm:text-xs truncate">{player.name}</p>
                      <p className="text-[10px] text-gray-600">
                        Pos: {player.position || 'Start'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Log */}
            <div className="bg-white rounded-xl shadow-lg p-2 sm:p-3 flex-1 min-h-0 flex flex-col overflow-hidden">
              <h2 className="text-sm sm:text-base font-bold mb-1.5 text-gray-800">Event Log</h2>
              <div className="space-y-0.5 overflow-y-auto text-[10px] sm:text-xs text-gray-700 flex-1">
                {eventLog.length === 0 ? (
                  <p className="text-gray-400 italic">No events yet...</p>
                ) : (
                  eventLog.map((log, idx) => (
                    <p key={idx} className="border-b border-gray-200 pb-0.5">
                      {log}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal for special cells */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-bounce">
              <h3 id="modal-title" className="text-2xl font-bold mb-4 text-center">
                {modalContent.title}
              </h3>
              <p className="text-lg text-gray-700 text-center">{modalContent.message}</p>
            </div>
          </div>
        )}

        {/* Winner Modal */}
        {winner && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-title"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <h2 id="winner-title" className="text-4xl font-bold mb-4 text-green-700">
                🎉 Victory! 🎉
              </h2>
              <div className="flex justify-center mb-4">
                <FrogPiece color={winner.color} size={64} />
              </div>
              <p className="text-2xl font-semibold mb-6">{winner.name} wins!</p>
              <button
                onClick={restartGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300"
                aria-label="Play again"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}