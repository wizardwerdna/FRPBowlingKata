import {Observable as O} from 'rxjs';
export function model(action$, makeBowlingLine, lineAction$) {
  const initialState = {lastid: 0, list: [], listID: []};

  const reducer$ = O.merge(
    action$
      .filter(action => action.type === 'ADD ITEM')
      .map(action =>
        function addLineReducer(state) {
          return {
            lastid: state.lastid + 1,
            list: [...state.list, {
              id: state.lastid + 1,
              line: makeBowlingLine(state.lastid + 1, action.payload)
            }]
          };
        }
      ),

    action$
      .filter(action => action.type === 'DELETE ITEM')
      .map(action =>
        function deleteLineReducer(state) {
          return {
            lastid: state.lastid,
            list: state.list.filter(item => item.id !== action.payload)
          };
        }
      )
  );
  const state$ = reducer$
    .scan((state, reducer: any) => reducer(state), initialState)
    .share();

  const DOMState$ = state$
    .map(state => O.combineLatest(
      ...state.list.map(listItem => listItem.line.DOM)
    ).defaultIfEmpty([])).switch()
    .startWith([]);

  state$
    .map(state => O.merge(
      ...state.list.map(listItem => listItem.line.Delete)
    ))
    .switch()
    .subscribe(next => lineAction$.next(next));

  return DOMState$;
}
