import {Observable as O} from 'rxjs';
import {mockDOMSource} from '@cycle/dom';
import RxAdapter from '@cycle/rxjs-adapter';
import {test, expect} from '../../testsuite';
import {intent} from './intent';
export function testBowlingLineIntent() {
  test('confirm actions from DOM', function() {
    [
      [mockDOMSource(
        RxAdapter, {'.rollButton': {'click': O.of({target: {innerHTML: '5'}})}}
      ), {type: 'ROLL', payload: 5}],
      [mockDOMSource(
        RxAdapter, {'.newGame': {'click': O.of({})}}
      ), {type: 'NEW GAME'}],
      [mockDOMSource(
        RxAdapter, {'.undo': {'click': O.of({})}}
      ), {type: 'UNDO'}],
      [mockDOMSource(
        RxAdapter, {'.redo': {'click': O.of({})}}
      ), {type: 'REDO'}],
      [mockDOMSource(
        RxAdapter, {'.delete': {'click': O.of({})}}
      ), {type: 'DELETE'}]
    ].forEach(([DOMSource, action]) =>
      test(action, function() {
        expect(intent(DOMSource).isEmpty()).toBeStreamOf(false);
        expect(intent(DOMSource)).toBeStreamOf(action);
      })
    );
  });
}
