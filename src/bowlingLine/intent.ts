import {Observable} from 'rxjs';

export function intent(sources) {

  const DOMSources = sources.DOM;
  const newGameButton$ = DOMSources.select('.newgame').events('click');
  const undoButton$ = DOMSources.select('.undo').events('click');
  const redoButton$ = DOMSources.select('.redo').events('click');
  const deleteButtons$ = DOMSources.select('.delete').events('click');
  const rollButton$ = DOMSources.select('.rollButton').events('click');

  return Observable.merge(
    newGameButton$
      .startWith(null)
      .map(evt => (
        { type: 'NEWGAME' }
      )),

    undoButton$.map(evt => ({ type: 'UNDO' })),
    redoButton$.map(evt => ( { type: 'REDO' })),

    deleteButtons$.withLatestFrom(sources.props$, (_, props) => props)
      .map(props => ({type: 'DELETE', payload: props})),

    rollButton$
      .map(evt => parseInt(evt.target.innerHTML))
      .map(payload => (
        { type: 'ROLL', payload }
      ))
  );

}
