export function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${isWinning ? "winning" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
