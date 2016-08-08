import {Observable as O} from 'rxjs';
import {model as modelFn} from './model';
import {view as viewFn} from './view';
import {intent as intentFn} from './intent';
import {Subject} from 'rxjs';
import {BowlingLine as BowlingLineFn} from './bowlingLine';
import isolateFn from '@cycle/isolate';

export function main(
  sources,
  model = modelFn, view = viewFn, intent = intentFn,
  makeBowlingLineWrapper = makeBowlingLineWrapperFn
) {
  const lineAction$ = new Subject();
  const action$ = intent(sources.DOM, lineAction$);
  const model$ = model(action$, makeBowlingLineWrapper(sources), lineAction$);
  const vtree$ = view(model$);
  return {DOM: vtree$};
}

export function makeBowlingLineWrapperFn(
  sources,
  isolate = isolateFn,
  BowlingLine = BowlingLineFn
) {
  return function makeBowlingLine(id: number, name: string) {
    return isolate(BowlingLine)(
      Object.assign({}, sources, {props$: O.of({id, name})})
    );
  };
}
