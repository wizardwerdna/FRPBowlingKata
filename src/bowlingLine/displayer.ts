export function displayer$(roll$) {
  const lastRoll = (display) => +display[display.length - 1] || 0;
  const isDoubleAttempt = (display, roll) =>
    display.length === 19 && display[18] === 'X';
  const isStrikeSpareAttempt = (display, roll) =>
    display.length === 20 && display[18] === 'X' && display[19] !== 'X';
  const isOddRoll = (display, roll) => display.length % 2 === 1;
  const isSpareAttempt = (display, roll) =>
    (isOddRoll(display, roll) && !isDoubleAttempt(display, roll)) ||
      isStrikeSpareAttempt(display, roll);
  const isSpare = (display, roll) =>
    isSpareAttempt(display, roll) && roll + lastRoll(display) === 10;
  const isGutter = (display, roll) => roll === 0;
  const isStrike = (display, roll) => roll === 10;
  const spaceUnlessTenth = (display) => display.length >= 18 ? '' : ' ';

  const displayOneRoll = (display, roll) =>
    isSpare(display, roll) ?
      '/' :
    isGutter(display, roll) ?
      '-' :
    isStrike(display, roll) ?
      spaceUnlessTenth(display) + 'X' :
    roll.toString();

  return roll$
    .reduce((display, roll) => display + displayOneRoll(display, roll), '');
}
