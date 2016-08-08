import {test, expect} from '../testsuite';
import {mockDOMSource} from '@cycle/dom';
import RxJSAdapter from '@cycle/rxjs-adapter';
import {Observable as O} from 'rxjs';
import {intent} from './intent';

export function intentTests() {
  test('no input', function() {
    const DOM = mockDOMSource(RxJSAdapter, {});
    expect(intent(DOM, O.empty()).isEmpty()).toBeStreamOf(true);
  });
  test('CR, but having only white space', function() {
    const DOM = mockDOMSource(RxJSAdapter, {
      'input.name': {
        'keydown': O.of({
          keyCode: 13,
          target: {value: '  '}
        })
      }
    });
    expect(intent(DOM, O.empty()).isEmpty()).toBeStreamOf(true);
  });
  test('CR having both text and white space', function() {
    const DOM = mockDOMSource(RxJSAdapter, {
      'input.name': {
        'keydown': O.of({
          keyCode: 13,
          target: {value: '  Andrew Greenberg  '}
        })
      }
    });
    expect(intent(DOM, O.empty()).last()).toBeStreamOf(
      {type: 'ADD ITEM', payload: 'Andrew Greenberg'}
    );
  });
  test('Delete Item', function() {
    const DOM = mockDOMSource(RxJSAdapter, {});
    const mockBLaction$ = O.of({type: 'DELETE', payload: 11});

    expect(intent(DOM, mockBLaction$).isEmpty())
    .toBeStreamOf(false);
    expect(intent(DOM, mockBLaction$).last())
    .toBeStreamOf({type: 'DELETE ITEM', payload: 11});
  });
}
