export function displayer$(roll$) {
  const lastRoll = (acc, curr) => parseInt(acc[acc.length - 1]) || 0;
  const isDoubleAttempt = (acc, curr) => acc.length === 19 && acc[18] === 'X';
  const isStrikeSpareAttempt = (acc, curr) =>
    acc.length === 20 && acc[18] === 'X' && acc[19] !== 'X';
  const isOddRoll = (acc, curr) => acc.length % 2 === 1;
  const isSpareAttempt = (acc, curr) =>
    (isOddRoll(acc, curr) && !isDoubleAttempt(acc, curr)) ||
      isStrikeSpareAttempt(acc, curr);
  const isSpare = (acc, curr) =>
    isSpareAttempt(acc, curr) && curr + lastRoll(acc, curr) === 10;
  const isGutter = (acc, curr) => curr === 0;
  const isStrike = (acc, curr) => curr === 10;
  const spaceUnlessTenth = (acc) => acc.length >= 18 ? '' : ' ';

  const displayOneRoll = (acc, curr) =>
    isSpare(acc, curr) ?
      '/' :
    isGutter(acc, curr) ?
      '-' :
    isStrike(acc, curr) ?
      spaceUnlessTenth(acc) + 'X' :
    curr.toString();

  return roll$
    .reduce((acc, curr) => acc + displayOneRoll(acc, curr), '');
}
