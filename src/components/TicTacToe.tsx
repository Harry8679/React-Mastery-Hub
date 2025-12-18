import { useState } from 'react';
import { ChevronLeft, Code2, RotateCcw, Trophy, Users, Zap } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
type Player = 'X' | 'O';
type Square = Player | null;
type Board = Square[];

interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
  winningLine: number[] | null;
  history: Board[];
  stepNumber: number;
}

// ==================== GAME LOGIC ====================
const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6], // Diagonal 2
];

const calculateWinner = (board: Board): { winner: Player | 'Draw' | null; line: number[] | null } => {
  // Check for winner
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: [a, b, c] };
    }
  }

  // Check for draw
  if (board.every((square) => square !== null)) {
    return { winner: 'Draw', line: null };
  }

  return { winner: null, line: null };
};

// ==================== COMPOSANTS ====================

// Square Component
interface SquareProps {
  value: Square;
  onClick: () => void;
  isWinning: boolean;
  isDisabled: boolean;
}

function Square({ value, onClick, isWinning, isDisabled }: SquareProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-24 h-24 text-4xl font-bold rounded-xl
        transition-all duration-200
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
        ${isWinning ? 'bg-green-300 scale-110' : 'bg-white hover:bg-gray-50'}
        ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        ${!value && !isDisabled ? 'hover:shadow-lg' : ''}
        border-2 border-gray-300 shadow-md
      `}
    >
      {value}
    </button>
  );
}

// Board Component
interface BoardProps {
  board: Board;
  onSquareClick: (index: number) => void;
  winningLine: number[] | null;
  isGameOver: boolean;
}

function Board({ board, onSquareClick, winningLine, isGameOver }: BoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {board.map((square, index) => (
        <Square
          key={index}
          value={square}
          onClick={() => onSquareClick(index)}
          isWinning={winningLine?.includes(index) || false}
          isDisabled={square !== null || isGameOver}
        />
      ))}
    </div>
  );
}

// History Component
interface HistoryProps {
  history: Board[];
  stepNumber: number;
  onStepClick: (step: number) => void;
}

function History({ history, stepNumber, onStepClick }: HistoryProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Zap size={20} className="text-yellow-500" />
        Historique des coups
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              index === stepNumber
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-white hover:bg-gray-100 text-gray-700'
            }`}
          >
            {index === 0 ? '🎮 Début du jeu' : `Coup #${index}`}
          </button>
        ))}
      </div>
    </div>
  );
}

// Stats Component
interface StatsProps {
  xWins: number;
  oWins: number;
  draws: number;
}

function Stats({ xWins, oWins, draws }: StatsProps) {
  const total = xWins + oWins + draws;
  
  return (
    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy size={20} className="text-yellow-500" />
        Statistiques
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{xWins}</div>
          <div className="text-sm text-gray-600 font-semibold">Victoires X</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{oWins}</div>
          <div className="text-sm text-gray-600 font-semibold">Victoires O</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{draws}</div>
          <div className="text-sm text-gray-600 font-semibold">Matchs nuls</div>
        </div>
      </div>
      {total > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Total de parties : {total}
        </div>
      )}
    </div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================
export default function TicTacToeProject({ onBack }: ProjectComponentProps) {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    history: [Array(9).fill(null)],
    stepNumber: 0,
  });

  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
  });

  const handleSquareClick = (index: number) => {
    if (gameState.board[index] || gameState.winner) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;

    const { winner, line } = calculateWinner(newBoard);

    // Update stats if game ended
    if (winner) {
      if (winner === 'X') {
        setStats((prev) => ({ ...prev, xWins: prev.xWins + 1 }));
      } else if (winner === 'O') {
        setStats((prev) => ({ ...prev, oWins: prev.oWins + 1 }));
      } else if (winner === 'Draw') {
        setStats((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    }

    const newHistory = gameState.history.slice(0, gameState.stepNumber + 1);
    newHistory.push(newBoard);

    setGameState({
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      winningLine: line,
      history: newHistory,
      stepNumber: newHistory.length - 1,
    });
  };

  const handleReset = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      history: [Array(9).fill(null)],
      stepNumber: 0,
    });
  };

  const handleResetStats = () => {
    setStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
    });
  };

  const jumpToStep = (step: number) => {
    const historicalBoard = gameState.history[step];
    const { winner, line } = calculateWinner(historicalBoard);
    
    setGameState({
      ...gameState,
      board: historicalBoard,
      stepNumber: step,
      currentPlayer: step % 2 === 0 ? 'X' : 'O',
      winner,
      winningLine: line,
    });
  };

  const getStatusMessage = () => {
    if (gameState.winner === 'Draw') {
      return '🤝 Match nul !';
    }
    if (gameState.winner) {
      return `🎉 ${gameState.winner} a gagné !`;
    }
    return `Tour du joueur ${gameState.currentPlayer}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🎮 Tic Tac Toe</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["Game Logic", "State Management", "Winner Detection"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className={`text-center mb-6 text-2xl font-bold py-4 px-6 rounded-xl ${
            gameState.winner === 'X' ? 'bg-blue-100 text-blue-700' :
            gameState.winner === 'O' ? 'bg-red-100 text-red-700' :
            gameState.winner === 'Draw' ? 'bg-gray-100 text-gray-700' :
            gameState.currentPlayer === 'X' ? 'bg-blue-50 text-blue-600' :
            'bg-red-50 text-red-600'
          }`}>
            {getStatusMessage()}
          </div>

          {/* Game Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Board */}
            <div className="flex flex-col items-center">
              <Board
                board={gameState.board}
                onSquareClick={handleSquareClick}
                winningLine={gameState.winningLine}
                isGameOver={gameState.winner !== null}
              />
              
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg"
                >
                  <RotateCcw size={20} />
                  Nouvelle partie
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Player Info */}
              <div className="bg-linear-to-r from-blue-50 to-red-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Joueurs
                </h3>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    gameState.currentPlayer === 'X' && !gameState.winner
                      ? 'bg-blue-200 border-2 border-blue-500'
                      : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                        X
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Joueur X</div>
                        <div className="text-sm text-gray-600">Bleu</div>
                      </div>
                    </div>
                    {gameState.currentPlayer === 'X' && !gameState.winner && (
                      <div className="text-blue-600 font-bold">À toi !</div>
                    )}
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg ${
                    gameState.currentPlayer === 'O' && !gameState.winner
                      ? 'bg-red-200 border-2 border-red-500'
                      : 'bg-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                        O
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">Joueur O</div>
                        <div className="text-sm text-gray-600">Rouge</div>
                      </div>
                    </div>
                    {gameState.currentPlayer === 'O' && !gameState.winner && (
                      <div className="text-red-600 font-bold">À toi !</div>
                    )}
                  </div>
                </div>
              </div>

              {/* History */}
              <History
                history={gameState.history}
                stepNumber={gameState.stepNumber}
                onStepClick={jumpToStep}
              />
            </div>
          </div>

          {/* Stats */}
          <Stats xWins={stats.xWins} oWins={stats.oWins} draws={stats.draws} />

          {stats.xWins + stats.oWins + stats.draws > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleResetStats}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-semibold"
              >
                Réinitialiser les statistiques
              </button>
            </div>
          )}

          {/* Explanation */}
          <div className="mt-8 bg-purple-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-purple-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>State Management</strong>: Gestion complexe du state de jeu
              </li>
              <li>
                • <strong>Game Logic</strong>: Algorithme de détection du gagnant
              </li>
              <li>
                • <strong>Immutability</strong>: Copie du board pour historique
              </li>
              <li>
                • <strong>Conditional Rendering</strong>: Affichage selon l'état
              </li>
              <li>
                • <strong>Time Travel</strong>: Navigation dans l'historique
              </li>
              <li>
                • <strong>Component Composition</strong>: Square, Board, History
              </li>
            </ul>

            <div className="mt-4 bg-white rounded p-4 space-y-2">
              <p className="text-sm text-gray-600 font-mono">
                const calculateWinner = (board) =&gt; {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                for (const [a, b, c] of WINNING_COMBINATIONS) {'{'}
              </p>
              <p className="text-sm text-gray-600 font-mono ml-8">
                if (board[a] === board[b] === board[c]) return winner;
              </p>
              <p className="text-sm text-gray-600 font-mono ml-4">
                {'}'}
              </p>
              <p className="text-sm text-gray-600 font-mono">
                {'}'};
              </p>
            </div>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
              <p className="font-bold mb-2">🎯 Règles du jeu:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Grille 3x3 avec deux joueurs (X et O)</li>
                <li>Aligner 3 symboles (ligne, colonne ou diagonale)</li>
                <li>Si grille pleine sans gagnant = match nul</li>
                <li>Historique des coups avec retour en arrière</li>
              </ul>
            </div>

            <div className="mt-4 bg-green-50 border border-green-200 rounded p-4 text-sm text-green-800">
              <p className="font-bold mb-2">✨ Fonctionnalités:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>Détection automatique du gagnant</li>
                <li>Highlight de la ligne gagnante</li>
                <li>Historique avec time-travel</li>
                <li>Statistiques cumulées (victoires X, O, nuls)</li>
                <li>Indication visuelle du joueur actif</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}