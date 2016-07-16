import {Observable as O} from 'rxjs';

export function model(action$, makeBowlingLine) {

  const reducer$ = O.merge(

    action$
      .filter(action => action.type === 'ADDPLAYER')
      .map(action => function addPlayerReducer(state) {
        const newLine =
          makeBowlingLine(action.payload, state.lastid + 1);
        return {
          lastid: state.lastid + 1,
          lines: state.lines.concat({
            id: state.lastid + 1,
            lineItem: newLine
          })
        };
      }),

    action$
      .filter(action => action.type === 'DELETEPLAYER')
      .map(action => function deletePlayerReducer(state) {
        return {
          lastid: state.lastid,
          lines: state.lines.filter(line =>
            line.id !== action.payload
          )
        };
      })

  );

  const initialState = { lastid: 0, lines: [] };

  const state$ =
    reducer$
      .scan((state, next: any) => next(state), initialState)
      .share();

  const bowlingLinesDOM$ = state$.map(state =>
    state.lines.map(line => line.lineItem.DOM)
  );

  const bowlingLinesDelete$ = state$
    .map(state => lineItemDeleteAction$(state))
    .switch();

  return {
    DOM: bowlingLinesDOM$.startWith(null),
    Delete: bowlingLinesDelete$
  };

  function lineItemDeleteAction$(state) {
    return O.merge(
      ...state.lines.map(line => line.lineItem.Delete)
    );
  }
}
