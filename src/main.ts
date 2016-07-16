import {model} from './model';
import {view} from './view';
import {intent} from './intent';
import {BowlingLine} from './bowlingLine';
import isolate from '@cycle/isolate';
import {Observable as O} from 'rxjs';

export function main({DOM}) {

  return {DOM:
    view(
      model(
        intent(DOM),
        makeBowlingLineWrapper(DOM)
      )
    )
  };

  function makeBowlingLineWrapper(DOM) {
    return function makeBowlingLine(name, id) {
      const bowlingLine = isolate(BowlingLine)({
        DOM: DOM, props$: O.of({name, id})
      });
      console.log('makeBowlingLine', name, bowlingLine);
      return bowlingLine;
    };
  }
}

