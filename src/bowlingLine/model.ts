import {Observable as O} from 'rxjs';
import {scorer$} from './scorer';
import {displayer$} from './displayer';

type BaseState = O<{}> | O<number>;
type BaseStateList = [{}] | BaseState[];
type State = {
  past: BaseStateList,
  current: BaseState,
  future: BaseStateList
}
const initialBaseState = O.empty();
const initialState = {
  past: [],
  present: initialBaseState,
  future: []
};

export function model(action$, props$ = O.of({})) {
  return action$
    .let(toReducer$)
    .let(toState)
    .let(toModel$);

  function toReducer$(action$) {
    return O.merge(
      action$
        .filter(action => action.type === 'ROLL')
        .map(action => function rollReducer(state) {
          return {
            past: state.past.concat(state.present),
            present: state.present.concat(O.of(action.payload)),
            future: []
          };
        }),

      action$
        .filter(action => action.type === 'NEW GAME')
        .map(action => function newgameReducer(state) {
          return {
            past: state.past.concat(state.present),
            present: O.empty(),
            future: []
          };
        }),

      action$
        .filter(action => action.type === 'UNDO')
        .map(action => function undoReducer(state) {
          return {
            past: state.past.slice(0, state.past.length - 1),
            present: state.past[state.past.length - 1],
            future: state.future.concat(state.present)
          };
        }),

      action$
        .filter(action => action.type === 'REDO')
        .map(action => function redoReducer(state) {
          return {
            past: state.past.concat(state.present),
            present: state.future[state.future.length - 1],
            future: state.future.slice(0, state.future.length - 1)
          };
        })
    );
  }

  function toState(reducers$) {
    return reducers$
      .scan( (state, reducer) => reducer(state), initialState  )
      .startWith(initialState);
  }

  function toModel$(state) {
    return state.map(state =>
      O.combineLatest(
        displayer$(state.present),
        scorer$(state.present).toArray(),
        O.of(state.past.length > 0),
        O.of(state.future.length > 0),
        props$
      )
    ).switch();
  }

}
