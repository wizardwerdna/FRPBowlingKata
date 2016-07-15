import {displayer$} from './displayer';
import {scorer$} from './scorer';
import {Observable} from 'rxjs';

export function model(action$, props$) {
  const initialState = {
    past: [],
    present: {
      roll$: Observable.empty(),
      display$: Observable.of(''),
      score$: Observable.empty()
    },
    future: [],
  };

  const reducers$ = Observable.merge(
    action$
      .filter((action: any) => action.type === 'NEWGAME')
      .map(action =>
        function newGameReducer(state) {
          return {
            past: state.past.concat(state.present),
            present: initialState.present,
            future: []
          };
        }
      ),

    action$
      .filter((action: any) => action.type === 'UNDO')
      .map(action =>
        function newGameReducer(state) {
          if (state.past.length === 0) {
            return state;
          } else {
            return {
              past: state.past.slice(0, state.past.length - 1),
              present: state.past[state.past.length - 1],
              future: state.future.concat(state.present)
            };
          }
        }
      ),

    action$
      .filter((action: any) => action.type === 'REDO')
      .map(action =>
        function newGameReducer(state) {
          if (state.future.length === 0) {
            return state;
          } else {
            return {
              past: state.past.concat(state.present),
              present: state.future[state.future.length - 1],
              future: state.future.slice(0, state.future.length - 1)
            };
          }
        }
      ),

    action$
      .filter((action: any) => action.type === 'DELETE')
      .map(action =>
        function deleteReducer(state) {
          console.log('doing a deleteReducer Now', action.payload);
          return state;
        }
      ),

    action$
      .filter((action: any) => action.type === 'ROLL')
      .map((action: any) =>
        function rollReducer(state) {
          const nextRoll$ = state.present.roll$.concat(
            Observable.of(action.payload));
          return {
            past: state.past.concat(state.present),
            present: {
              roll$: nextRoll$,
              display$: displayer$(nextRoll$),
              score$: scorer$(nextRoll$)
            },
            future: []
          };
        }
      )
  );

  const state$ = reducers$
    .scan((state, next: any) => next(state), initialState)
    ;

  const model$ = state$.map(state =>
    state.present.display$.withLatestFrom(
      state.present.score$.toArray(),
      props$,
      Observable.of(state.past.length),
      Observable.of(state.future.length)
    )
  ).switch();

  return model$;
}
