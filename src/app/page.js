'use client';
import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? 'winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;

  function handleClick(i) {
    if (winner || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    onPlay(nextSquares, calculateWinner(nextSquares));
  }

  let status;
  if (winner) {
    status = 'Vencedor: ' + winner;
  } else if (!squares.includes(null)) {
    status = 'Empate!';
  } else {
    status = 'Próximo a jogar: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const idx = row + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onSquareClick={() => handleClick(idx)}
                isWinning={winningLine?.includes(idx)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Home() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, winnerInfo = null) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const isCurrent = move === currentMove;
    const description = move > 0 ? 'Rodada nº #' + move : 'Começo do jogo';
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={isCurrent ? 'move-button current' : 'move-button'}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <h1>Tic-Tac-Toe</h1>
        <p className="description">
          Jogo da velha para dois jogadores.<br />
          Clique em uma célula vazia para marcar.<br />
          X começa jogando.
        </p>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button onClick={restartGame}>Reiniciar Jogo</button>
      </div>
      <div className="game-info">
        <h2>Movimentos</h2>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
