import {intent} from './intent';
import {model} from './model';
import {view} from './view';

export function main(sources) {
  const action$ = intent(sources.DOM);
  const model$ = model(action$);
  const vtree$ = view(model$);
  return {DOM: vtree$};
}

