import {intent} from './intent';
import {model} from './model';
import {view} from './view';

export function BowlingLine(sources) {
  console.log('props$', sources.props$);
  const action$ = intent(sources);
  const model$ = model(action$, sources.props$);
  const vtree$ = view(model$);
  const deleters$ = action$.filter((action: any) => action.type === 'DELETE');
  deleters$.subscribe(x => console.log('deleters', x));
  return {
    DOM:    vtree$,
    Remove: deleters$
  };
}
