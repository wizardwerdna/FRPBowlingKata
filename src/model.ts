import {Observable as O} from 'rxjs';

export function model(action$, makeBowlingLine) {

  const reducer$ = O.merge(

    action$
      .filter(action => action.type === 'ADDPLAYER')
      .map(action => function addPlayerReducer(state) {
        return {
          id: state.id + 1,
          lines: state.lines.concat(
            makeBowlingLine(action.payload, state.id + 1).DOM
          )
        };
      }),

    action$
      .filter(action => action.type === 'INITIALIZE')
      .map(action => function initializeReducer(state) {
        return {
          id: 0,
          lines: []
        };
      })

  );

  const state$ = reducer$.scan((state, next: any) => next(state), {});

  return state$.map(state => state.lines);

}
