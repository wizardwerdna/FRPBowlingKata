export function enabler(display, scores) {
  const lastRoll = (display, scores) => +display[display.length - 1] || 0;
  const isSpareAttempt = (display, scores) =>
    display.length % 2 === 1 || display.length === 20;
  const isGameOver = (display, scores) =>
    scores.length === 10 && display.length !== 19;

  return isGameOver(display, scores) ?
      -1 :
    isSpareAttempt(display, scores) ?
      10 - lastRoll(display, scores) :
    10;
}
