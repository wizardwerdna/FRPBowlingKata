export function enabler(display, scores) {
  const lastRoll = (display, scores) =>
    parseInt(display[display.length - 1]) || 0;
  const isSpareAttempt = (display, length) =>
    display.length % 2 === 1 || display.length === 20;
  const isGameOver = (display, length) =>
    scores.length === 10 && display.length !== 19;

  return isGameOver(display, length) ?
      -1 :
    isSpareAttempt(display, length) ?
      10 - lastRoll(display, scores) :
    10;
}
