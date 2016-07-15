import {intent} from './intent';
import {model} from './model';
import {view} from './view';
import {BowlingLine} from './bowlingLine';
import isolate from '@cycle/isolate';
import {Observable as O} from 'rxjs';

export function main(sources) {

  const action$ = intent(sources.DOM);
  const model$ = model(action$, makeBowlingLineWrapper(sources.DOM));
  const vtree$ = view(model$);
  return {DOM: vtree$};

  function makeBowlingLineWrapper(DOMSource) {
    return function makeBowlingLine(name, id) {
      const bowlingLine = isolate(BowlingLine)({
        DOM: DOMSource, props$: O.of({name, id})
      });
      console.log('makeBowlingLine', name, bowlingLine);
      return bowlingLine;
    };
  }
}

