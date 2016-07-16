import {Observable} from 'rxjs';

export function intent(DOM) {

  const buttonClick$ = DOM.select('button').events('click');

  return Observable.merge(

    buttonClick$
      .filter(evt => evt.target.className === 'newgame')
      .map(evt => (
        { type: 'NEWGAME' }
      )),

    buttonClick$
    .filter(evt => evt.target.className === 'undo')
    .map(evt => ({ type: 'UNDO' })),

    buttonClick$
      .filter(evt => evt.target.className === 'redo')
      .map(evt => ( { type: 'REDO' })),

    buttonClick$
      .filter(evt => evt.target.className === 'rollButton')
      .map(evt => parseInt(evt.target.innerHTML))
      .map(payload => (
        { type: 'ROLL', payload }
      ))

  ).startWith({type: 'NEWGAME'});

}
