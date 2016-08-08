import {view as viewFn} from './view';
import {model as modelFn} from './model';
import {intent as intentFn} from './intent';

// return {DOM: sources |> intent |> model |> view|
export function BowlingLine(
  sources,
  model = modelFn, view = viewFn, intent = intentFn
) {
  const action$ = intent(sources.DOM);
  const model$ = model(action$, sources.props$);
  const vtree$ = view(model$);
  const delete$ = deleteActions(action$, sources.props$);
  return {DOM: vtree$, Delete: delete$};
}

function deleteActions(action$, props$) {
  return action$
    .filter((action: any) => action.type === 'DELETE')
    .combineLatest(
      props$,
      (action, props: any) => ({type: 'DELETE', payload: props.id})
    );
}
