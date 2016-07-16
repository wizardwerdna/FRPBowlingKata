import {Observable} from 'rxjs';

export function intent(DOMSources, deleter$) {

  const CR = 13;

  const playerInput$ = DOMSources.select('.playerInput').events('keydown');

  return Observable.merge(

    playerInput$
      .map(evt => ({keyCode: evt.keyCode, value: evt.target.value}))
      .filter(each => each.keyCode === CR && each.value.trim())
      .map(each => ({type: 'ADDPLAYER', payload: each.value.trim()})),

    deleter$
      .map(lineDeleter => ({
        type: 'DELETEPLAYER',
        payload: lineDeleter.payload
      }))

  ).share();
}
