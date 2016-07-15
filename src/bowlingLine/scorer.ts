export function scorer$(roll$) {
  const sum = (acc, curr) => acc + curr;
  const isStrike = (trip) => trip[0] === 10;
  const isSpare = (trip) => trip[0] + trip[1] === 10;
  const scoreFrame = frame =>
    frame
      .take(1)
      .map(trip =>
         isStrike(trip) || isSpare(trip) ?
           trip.reduce(sum) :
           trip[0] + (trip[1] || 0)
      );

  const markFrame = (acc, curr) => (
    acc.lastRoll && isStrike(curr) ?
      {trip: curr, frame: acc.frame + 1, lastRoll: true} :
      {
        trip: curr,
        frame: acc.lastRoll ? acc.frame + 1 : acc.frame,
        lastRoll: !acc.lastRoll
      }
  );

  return roll$
    .bufferCount(3, 1)
    .map(trip => trip.concat(NaN, NaN).slice(0, 3))
    .scan(markFrame, {trip: [], frame: 0, lastRoll: true})
    .groupBy(m => m.frame, m => m.trip)
    .mergeMap(scoreFrame)
    .scan(sum)
    .filter(score => !isNaN(score))
    .take(10)
    ;
}
