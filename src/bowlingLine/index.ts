import {intent} from './intent';
import {model} from './model';
import {view} from './view';

export function BowlingLine({DOM, props$}) {

  const actions$ = intent(DOM, props$);
  const model$ = model(actions$, props$);
  const vdom$ = view(model$);
  const deleters$ = actions$
    .filter((action: any) => action.type === 'DELETE');
  vdom$.subscribe( x => console.log(x));
  return {DOM: vdom$, Delete: deleters$};

}
