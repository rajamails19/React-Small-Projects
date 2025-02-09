import React, { useState } from "react";

// Game configurations for both themes
const GAME_CONFIGS = {
  sonic: {
    title: "SONIC TIC TAC TOE",
    gradientFrom: "from-blue-50",
    gradientTo: "to-blue-100",
    titleGradient: "from-blue-600 to-blue-400",
    boardGradient: "from-blue-200 to-blue-300",
    buttonGradient: "from-blue-500 to-blue-600",
    buttonHoverGradient: "hover:from-blue-600 hover:to-blue-700",
    player1: {
      name: "hero",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      characters: {
        sonic: {
          name: "Sonic",
          emoji: "🦔",
          powerEmoji: "💨",
        },
        tails: {
          name: "Tails",
          emoji: "🦊",
          powerEmoji: "✈️",
        },
        knuckles: {
          name: "Knuckles",
          emoji: "👊",
          powerEmoji: "💎",
        },
        amy: {
          name: "Amy Rose",
          emoji: "🌹",
          powerEmoji: "🔨",
        },
        shadow: {
          name: "Shadow",
          emoji: "🦔",
          powerEmoji: "⚡",
        },
      },
    },
    player2: {
      name: "villain",
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      characters: {
        eggman: {
          name: "Dr. Robotnik",
          emoji: "🥚",
          powerEmoji: "🤖",
        },
        metal: {
          name: "Metal Sonic",
          emoji: "🤖",
          powerEmoji: "⚡",
        },
        chaos: {
          name: "Chaos",
          emoji: "💧",
          powerEmoji: "🌊",
        },
        zavok: {
          name: "Zavok",
          emoji: "😈",
          powerEmoji: "🔥",
        },
        infinite: {
          name: "Infinite",
          emoji: "🎭",
          powerEmoji: "💫",
        },
      },
    },
  },
  alcohol: {
    title: "ALCOHOL VS WATER",
    gradientFrom: "from-green-50",
    gradientTo: "to-green-100",
    titleGradient: "from-green-600 to-green-400",
    boardGradient: "from-green-200 to-green-300",
    buttonGradient: "from-green-500 to-green-600",
    buttonHoverGradient: "hover:from-green-600 hover:to-green-700",
    player1: {
      name: "alcohol",
      bgColor: "bg-red-100",
      borderColor: "border-red-500",
      characters: {
        vodka: {
          name: "Vodka",
          emoji: "🍸",
          powerEmoji: "🔥",
        },
        whiskey: {
          name: "Whiskey",
          emoji: "🥃",
          powerEmoji: "🔥",
        },
        rum: {
          name: "Rum",
          emoji: "🏴‍☠️",
          powerEmoji: "⚓",
        },
        tequila: {
          name: "Tequila",
          emoji: "🌵",
          powerEmoji: "🌶️",
        },
        gin: {
          name: "Gin",
          emoji: "🫒",
          powerEmoji: "🌿",
        },
      },
    },
    player2: {
      name: "water",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500",
      characters: {
        tap: {
          name: "Tap Water",
          emoji: "🚰",
          powerEmoji: "💧",
        },
        bottled: {
          name: "Bottled Water",
          emoji: "🍶",
          powerEmoji: "🏔️",
        },
        mineral: {
          name: "Mineral Water",
          emoji: "🧊",
          powerEmoji: "🌊",
        },
        sparkling: {
          name: "Sparkling Water",
          emoji: "🫧",
          powerEmoji: "💨",
        },
        spring: {
          name: "Spring Water",
          emoji: "🏞️",
          powerEmoji: "🌱",
        },
      },
    },
  },
};

const TicTacToeGame = ({ theme }) => {
  const config = GAME_CONFIGS[theme];
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(config.player1.name);
  const [winner, setWinner] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState({
    [config.player1.name]: Object.keys(config.player1.characters)[0],
    [config.player2.name]: Object.keys(config.player2.characters)[0],
  });
  const [winningLine, setWinningLine] = useState(null);

  const getCharacterConfig = (player) => {
    const playerConfig =
      player === config.player1.name ? config.player1 : config.player2;
    return playerConfig.characters[selectedCharacters[player]];
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } else {
      setCurrentPlayer(
        currentPlayer === config.player1.name
          ? config.player2.name
          : config.player1.name
      );
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(config.player1.name);
    setWinner(null);
    setWinningLine(null);
    setShowCelebration(false);
  };

  const CharacterSelector = ({ playerConfig, selected, onSelect }) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2 text-center uppercase">
        {playerConfig.name}
      </h2>
      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(playerConfig.characters).map(([id, char]) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`p-3 rounded-lg transition-all duration-200 
              ${
                selected === id
                  ? `bg-gradient-to-br ${config.buttonGradient} text-white scale-110 shadow-lg`
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">{char.emoji}</div>
              <div className="text-2xl">{char.powerEmoji}</div>
              <div className="text-xs font-bold">{char.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const Square = ({ index }) => {
    const value = board[index];
    const char = value ? getCharacterConfig(value) : null;
    const playerConfig =
      value === config.player1.name ? config.player1 : config.player2;

    return (
      <button
        className={`w-32 h-32 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300
          ${value ? playerConfig.bgColor : "bg-white"}
          ${value ? playerConfig.borderColor : "border-gray-200"}
          border-4 hover:scale-105`}
        onClick={() => handleClick(index)}
      >
        {value && (
          <div className="flex flex-col items-center">
            <div className="text-5xl">{char.emoji}</div>
            <div className="text-2xl mt-1">{char.powerEmoji}</div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${config.gradientFrom} ${config.gradientTo} flex flex-col items-center justify-center p-4`}
    >
      <h1
        className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.titleGradient} mb-6`}
      >
        {config.title}
      </h1>

      <div className="mb-6">
        <CharacterSelector
          playerConfig={config.player1}
          selected={selectedCharacters[config.player1.name]}
          onSelect={(char) =>
            setSelectedCharacters((prev) => ({
              ...prev,
              [config.player1.name]: char,
            }))
          }
        />
        <CharacterSelector
          playerConfig={config.player2}
          selected={selectedCharacters[config.player2.name]}
          onSelect={(char) =>
            setSelectedCharacters((prev) => ({
              ...prev,
              [config.player2.name]: char,
            }))
          }
        />
      </div>

      <div className="text-xl mb-4 text-gray-800">
        {winner
          ? `${getCharacterConfig(winner).name} wins!`
          : `Next turn: ${getCharacterConfig(currentPlayer).name}`}
      </div>

      <div
        className={`relative grid grid-cols-3 gap-4 bg-gradient-to-br ${config.boardGradient} p-6 rounded-xl shadow-xl`}
      >
        {board.map((_, index) => (
          <Square key={index} index={index} />
        ))}

        {winningLine && (
          <div
            className={`absolute transform transition-all duration-500 
              ${
                winner === config.player1.name
                  ? config.player1.borderColor
                  : config.player2.borderColor
              }
              rounded-full opacity-50`}
            style={{
              height: "8px",
              transition: "all 0.5s ease",
              ...(winningLine[0] % 3 === 0 &&
              winningLine[1] === winningLine[0] + 1
                ? {
                    width: "100%",
                    top: `${Math.floor(winningLine[0] / 3) * 33.33 + 16}%`,
                    left: "0",
                  }
                : winningLine[1] === winningLine[0] + 3
                ? {
                    width: "8px",
                    height: "100%",
                    top: "0",
                    left: `${(winningLine[0] % 3) * 33.33 + 16}%`,
                  }
                : winningLine[0] === 0 && winningLine[2] === 8
                ? {
                    width: "140%",
                    transform: "rotate(45deg)",
                    top: "50%",
                    left: "-20%",
                  }
                : winningLine[0] === 2 && winningLine[2] === 6
                ? {
                    width: "140%",
                    transform: "rotate(-45deg)",
                    top: "50%",
                    left: "-20%",
                  }
                : {}),
            }}
          />
        )}
      </div>

      <button
        onClick={resetGame}
        className={`mt-6 px-8 py-3 bg-gradient-to-r ${config.buttonGradient} text-white rounded-full
          ${config.buttonHoverGradient} transition-all duration-200
          font-bold shadow-md transform hover:scale-105`}
      >
        PLAY AGAIN
      </button>

      {showCelebration && winner && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className={`absolute inset-0 
              ${
                winner === config.player1.name
                  ? config.player1.bgColor
                  : config.player2.bgColor
              } 
              bg-opacity-20 backdrop-blur-sm`}
          />
          <div
            className={`bg-white p-8 rounded-xl text-center shadow-2xl relative
              ${
                winner === config.player1.name
                  ? config.player1.borderColor
                  : config.player2.borderColor
              } 
              border-4`}
          >
            <div className="text-6xl mb-4 animate-bounce">
              {getCharacterConfig(winner).emoji}
              {getCharacterConfig(winner).powerEmoji}
            </div>
            <h2
              className={`text-3xl font-bold mb-2 
              ${
                winner === config.player1.name
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              {getCharacterConfig(winner).name} Wins!
            </h2>
            <div className="text-4xl mt-4">✨ 🎉 ⭐️ 🎈</div>
          </div>
        </div>
      )}
    </div>
  );
};

const GameSelector = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-12">
          CHOOSE YOUR GAME
        </h1>
        <div className="flex space-x-8">
          <button
            onClick={() => setSelectedGame("sonic")}
            className="p-8 bg-blue-100 hover:bg-blue-200 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="text-6xl mb-4">🦔</div>
            <h2 className="text-2xl font-bold text-blue-700">
              Sonic Tic Tac Toe
            </h2>
          </button>
          <button
            onClick={() => setSelectedGame("alcohol")}
            className="p-8 bg-green-100 hover:bg-green-200 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <div className="text-6xl mb-4">🍸💧</div>
            <h2 className="text-2xl font-bold text-green-700">
              Alcohol vs Water
            </h2>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setSelectedGame(null)}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full"
      >
        ← Back to Game Selection
      </button>
      <TicTacToeGame theme={selectedGame} />
    </div>
  );
};

export default GameSelector;
