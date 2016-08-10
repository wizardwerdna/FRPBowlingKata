import {Observable as O} from 'rxjs';
export function model(action$, makeBowlingLine, lineAction$) {
  const initialState = {lastid: 0, list: [], listID: []};

  return action$
    .let(toReducer$)
    .let(toState$)
    .let(toLineAction$)
    .let(toModel$);

  function toReducer$(action$) {
    return action$
      .map(action =>

        action.type === 'DELETE ITEM' ?
          function deleteLineReducer(state) {
            return {
              lastid: state.lastid,
              list: state.list.filter(item => item.id !== action.payload)
            };
          } :

        action.type === 'ADD ITEM' ?
          function addLineReducer(state) {
            return {
              lastid: state.lastid + 1,
              list: [...state.list, {
                id: state.lastid + 1,
                line: makeBowlingLine(state.lastid + 1, action.payload)
              }]
            };
          } :

          state => {
            throw `illegal action: ${action.type}`;
          }
      );
  }

  function toState$(reducer$) {
    return reducer$
      .scan((state, reducer: any) => reducer(state), initialState)
      .share();
  }

  function toModel$(state$) {
    return state$
      .switchMap(state => O.combineLatest(
        ...state.list.map(listItem => listItem.line.DOM)
      ).defaultIfEmpty([]))
      .startWith([]);
  }

  function toLineAction$(state$) {
    lineAction$.let(imitate(
      state$.let(lineDeleter$)));
    return state$;

    function imitate(object$) {
      return function (subject$) {
        return object$.subscribe(next => subject$.next(next));
      };
    }

    function lineDeleter$(state$) {
      return state$
        .switchMap(state => O.merge(
          ...state.list.map(listItem => listItem.line.Delete)
        ));
    }
  }

}

