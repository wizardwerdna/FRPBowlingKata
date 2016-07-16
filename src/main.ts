import {model} from './model';
import {view} from './view';
import {intent} from './intent';
import {BowlingLine} from './bowlingLine';
import isolate from '@cycle/isolate';
import {Observable as O, Subject} from 'rxjs';

export function main({DOM}) {

  const proxy$ = new Subject();
  const action$ = intent(DOM, proxy$);
  const models = model(action$, makeBowlingLineWrapper(DOM));
  models.Delete.subscribe(next => proxy$.next(next));
  const vdom$ = view(models.DOM);
  return {DOM: vdom$};

  function makeBowlingLineWrapper(DOM) {
    return function makeBowlingLine(name, id) {
      const bowlingLine = isolate(BowlingLine)({
        DOM: DOM, props$: O.of({name, id})
      });
      return bowlingLine;
    };
  }
}

