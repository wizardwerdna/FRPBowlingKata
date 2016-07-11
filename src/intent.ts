import {Observable} from 'rxjs';

export function intent(DOMSources) {

  const newGameButton$ = DOMSources.select('#newgame').events('click');
  const undoButton$ = DOMSources.select('#undo').events('click');
  const redoButton$ = DOMSources.select('#redo').events('click');
  const rollButton$ = DOMSources.select('.rollButton').events('click');

  return Observable.merge(
    newGameButton$
      .startWith(null)
      .map(evt => (
        { type: 'NEWGAME' }
      )),

    undoButton$
      .map(evt => (
        { type: 'UNDO' }
      )),

    redoButton$
      .map(evt => (
        { type: 'REDO' }
      )),

    rollButton$
      .map(evt => parseInt(evt.target.innerHTML))
      .map(payload => (
        { type: 'ROLL', payload }
      ))
  );

}
