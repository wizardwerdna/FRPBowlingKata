import {Observable as O} from 'rxjs';
export function intent(DOMSource) {
  const rollButton$ = DOMSource.select('.rollButton').events('click');
  const newButton$ = DOMSource.select('.newGame').events('click');
  const undoButton$ = DOMSource.select('.undo').events('click');
  const redoButton$ = DOMSource.select('.redo').events('click');
  const deleteButton$ = DOMSource.select('.delete').events('click');

  return O.merge(
    rollButton$.map(evt => (
      {type: 'ROLL', payload: +evt.target.innerHTML}
    )),
    newButton$.map(evt => ({type: 'NEW GAME'})),
    undoButton$.map(evt => ({type: 'UNDO'})),
    redoButton$.map(evt => ({type: 'REDO'})),
    deleteButton$.map(evt => ({type: 'DELETE'}))
  );
}
