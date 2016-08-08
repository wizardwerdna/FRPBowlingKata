import {model} from './model.ts';
import {test, expect} from '../../testsuite';
import {Observable as O} from 'rxjs';
export function testBowlingLineModel() {
  const mockProps = {
    id: 1, name: 'Andrew'
  };
  const mockProps$ = O.of(mockProps);
  test('empty game', function () {
    expect(model(O.empty(), mockProps$)).toBeStreamOf(['', [], false, false, mockProps]);
  });
  test('gutter roll action', function() {
    expect(model(O.of({type: 'ROLL', payload: 0}), mockProps$).last()).toBeStreamOf(
      ['-', [0], true, false, mockProps]
    );
  });
  test('other roll action', function() {
    expect(model(O.of({type: 'ROLL', payload: 1}), mockProps$).last()).toBeStreamOf(
      ['1', [1], true, false, mockProps]
    );
  });
  test('two roll actions', function() {
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'ROLL', payload: 2})
    ), mockProps$).skip(1).first()).toBeStreamOf(
      ['1', [1], true, false, mockProps]
    );
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'ROLL', payload: 2})
    ), mockProps$).last()).toBeStreamOf(
      ['12', [3], true, false, mockProps]
    );
  });
  test('new game', function() {
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'NEW GAME'})
    ), mockProps$).skip(1).first()).toBeStreamOf(
      ['1', [1], true, false, mockProps]
    );
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'NEW GAME'})
    ), mockProps$).last()).toBeStreamOf(
      ['', [], true, false, mockProps]
    );
  });
  test('undo/redo', function() {
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'UNDO'}),
      O.of({type: 'REDO'})
    ), mockProps$).skip(1).first()).toBeStreamOf(
      ['1', [1], true, false, mockProps]
    );
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'UNDO'}),
      O.of({type: 'REDO'})
    ), mockProps$).skip(2).first()).toBeStreamOf(
      ['', [], false, true, mockProps]
    );
    expect(model(O.merge(
      O.of({type: 'ROLL', payload: 1}),
      O.of({type: 'UNDO'}),
      O.of({type: 'REDO'})
    ), mockProps$).last()).toBeStreamOf(
      ['1', [1], true, false, mockProps]
    );
  });
}
