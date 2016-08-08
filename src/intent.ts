import {Observable as O} from 'rxjs';
export function intent(DOMSource, bowlingLineAction$) {
  const nameInput$ = DOMSource.select('input.name').events('keydown');
  return O.merge(
    nameInput$
      .filter(evt => evt.keyCode === 13 && evt.target.value.trim())
      .map(evt => (
        {type: 'ADD ITEM', payload: evt.target.value.trim()}
      )),

    bowlingLineAction$
      .map(action => (
        {type: 'DELETE ITEM', payload: action.payload}
      ))
  );
}
