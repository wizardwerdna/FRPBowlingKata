import {test, expect} from '../testsuite';
import {Subject, Observable as O} from 'rxjs';
import {model} from './model';
import {div} from '@cycle/dom';
export function modelTests() {

  const vtree = (id, name) =>
    div(`#${id}`, [
      div('.name', name)
    ]);
  const mockBowlingLine = (id, name) => ({
    DOM: O.of( vtree(id, name)),
    Delete: O.empty()
  });
  const mockLineAction$ = new Subject();

  test('no actions', function() {
    expect(
      model(O.empty(), mockBowlingLine, mockLineAction$).last()
    ).toBeStreamOf([]);
  });

  test('Add Bowling Line', function() {
    expect(
      model(O.of(
        {type: 'ADD ITEM', payload: 'Andrew'}
      ), mockBowlingLine, mockLineAction$)
      .last()
    ).toBeStreamOf([
      vtree(1, 'Andrew')
    ]);
  });

  test('Add Bowling Line twice', function() {
    expect(model(O.from([
      {type: 'ADD ITEM', payload: 'Andrew'},
      {type: 'ADD ITEM', payload: 'William'}
    ]), mockBowlingLine, mockLineAction$)
    .last())
    .toBeStreamOf([
      vtree(1, 'Andrew'),
      vtree(2, 'William')
    ]);
  });

  test('Remove a singleton Bowling Line', function() {
    expect(
      model(O.from([
        {type: 'ADD ITEM', payload: 'Andrew'},
        {type: 'DELETE ITEM', payload: 1}
      ]), mockBowlingLine, mockLineAction$)
      .last()
    ).toBeStreamOf([]);
  });

  test('Remove first Bowling Line', function() {
    expect(
      model(O.from([
        {type: 'ADD ITEM', payload: 'Andrew'},
        {type: 'ADD ITEM', payload: 'William'},
        {type: 'DELETE ITEM', payload: 1}
      ]), mockBowlingLine, mockLineAction$)
      .last()
    ).toBeStreamOf([
      vtree(2, 'William')
    ]);
  });

  test('Remove last Bowling Line', function() {
    expect(
      model(O.from([
        {type: 'ADD ITEM', payload: 'Andrew'},
        {type: 'ADD ITEM', payload: 'William'},
        {type: 'DELETE ITEM', payload: 2}
      ]), mockBowlingLine, mockLineAction$)
      .last()
    ).toBeStreamOf([
      vtree(1, 'Andrew')
    ]);
  });
}
