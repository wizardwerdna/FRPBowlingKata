import {Observable as O} from 'rxjs';
import {div, mockDOMSource} from '@cycle/dom';
import RxJSAdapter from '@cycle/rxjs-adapter';
//
// test driver global state shared among all tests
export const initTestData = {
  run : 0,
  passed : 0,
  failed : 0,
  error :  0,
  nest :  0,
};
export let data = initTestData;

export function test(testName, tests, isOpen = true) {
  data.nest++;
  if (isOpen) {
    console.group(testName);
  } else {
    console.groupCollapsed(testName);
  }
  try {
    tests();
  } catch (err) {
    console.error('Error Runing Test:', err);
    data.error++;
  }
  console.groupEnd();
  data.nest--;
  if (data.nest === 0) {
    console.log('%cReport: %d run; %d passed; %d failed; %d errors',
      (data.run === data.passed ? 'color: green' : 'color: red'),
      data.run, data.passed, data.failed, data.error);
  }
}

export function expect(actual) {
  return {
    toBe: expected => assertIdentical(expected, actual),
    toEqual: expected => assertEqual(expected, actual),
    toMarble: expected => assertMarble(expected, actual),
    toBeStreamOf: expected => assertStreamOf(expected, actual),
    not: {
      toBe: expected => assertIdentical(expected, actual, true),
      toEqual: expected => assertEqual(expected, actual, true),
      toMarble: expected => assertMarble(expected, actual, true),
      toBeStreamOf: expected => assertStreamOf(expected, actual, true),
    }
  };
}

function markPass1(message, string1, negated) {
  if (negated) {
    console.error(message, 'color: red', string1);
    data.failed++;
  } else {
    console.info(message, 'color: green', string1);
    data.passed++;
  }
};

function markPass2(message, string1, string2,  negated) {
  if (negated) {
    console.error(message, 'color: red', string1, string2);
    data.failed++;
  } else {
    console.info(message, 'color: green', string1, string2);
    data.passed++;
  }
}

export function assertIdentical(expected, actual, negated = false) {
  data.run++;
  try {
    if (expected === actual) {
      markPass1('%cactual is equal to expected "%o"', expected, negated);
    } else {
      markPass2('%c%o is NOT equal to expected "%o"', actual, expected, !negated);
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function assertEqual(expected, actual, negated = false) {
  data.run++;
  try {
    if (JSON.stringify(expected) === JSON.stringify(actual)) {
      markPass1('%cactual is equal to expected "%o"', actual, negated);
    } else {
      markPass2('%c%o is NOT equal to expected "%o"', actual, expected, !negated);
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function assertMarble(
  expected: string, str$: O<any>, negated = false
) {
  data.run++;
  str2mbl$(str$).subscribe(
    actual => {
      if (expected === actual) {
        markPass1('%cstream has expected marble diagram %o', expected, negated);
      } else {
        markPass2('%cstream marble diagram %o is NOT the expected %o',
          actual, expected, !negated);
      }
    },
    err => {
      console.error('Error:', err);
      data.error++;
    }
  );
}

export function assertStreamOf(
  expected, stream$: O<any>, negated = false
) {
  if (!stream$) { throw('stream is not defined'); };
  if (typeof stream$.subscribe !== 'function') {
    throw('%s is not a stream', typeof stream$);
  }
  stream$.subscribe(
    actual => {
      data.run++;
      if (JSON.stringify(expected) === JSON.stringify(actual)) {
        markPass1('%cstream contains expected value %o', expected, negated);
      } else {
        markPass2('%cstream contained %o, NOT the expected value %o',
         actual, expected, !negated);
      }
    },
    err => {
      data.run++;
      console.error('Error:', err);
      data.error++;
    }
  );
}

export function str2mbl$(stream$: O<any>): O<string> {
  if (!stream$) { throw('Undefined is not a stream'); };
  if (typeof stream$.subscribe !== 'function') {
    throw(stream$, 'is not a stream');
  }
  return stream$
    .defaultIfEmpty('')
    .reduce((acc, item) => acc  + '-' + item.toString())
    .map(mbl => '-' + mbl + '|');
}

export function mbl2str$(mbl: string): O<any> {
  return O.from(
    mbl
      .replace(/--+/g, '-')
      .replace(/[ |]/g, '')
      .replace(/^[ |-]+/, '')
      .replace(/[ |-]+$/, '')
      .split('-')
      .filter(each => each !== '')
      .map(each => isNaN(parseInt(each)) ? each : parseInt(each))
  );
}

// From: http://staltz.com/unidirectional-user-interface-architectures.html
//
// Introduced as a fully reactive unidirectional architecture based on RxJS 
// Os, Model-View-Intent is the primary architectural pattern in the 
// framework Cycle.js. The O event stream is a primitive used everywhere,
// and functions over Os are pieces of the architecture.
//
// Parts:
//
// Intent: function from O of user events to O of “actions”
// Model: function from O of actions to O of state
// View: function from O of state to O of rendering
// Custom element: subsection of the rendering which is in itself a UI program. 
// May be implemented as MVI, or as a Web Component. Is optional to use in a View.

export function assertMVIComponent(Component) {
  const nullModel = (action$, ...rest) => O.of([]);
  const nullView = (model$, ...rest) => O.empty();
  const nullIntent = (DOMSource, ...rest) => O.of({});

  return function() {

    test('component provides model, view and intent, each called once', function() {
      let visits = {
        model: 0,
        view: 0,
        intent: 0
      };
      Component({}, model, view, intent);
      function model() { visits.model++; return O.of([]); }
      function view() { visits.view++; return O.empty(); }
      function intent() { visits.intent++; return O.empty(); }
      expect(visits).toEqual({model: 1, view: 1, intent: 1});
    });

    test('intent is function from DOMSource to observable of actions', function() {
      const DOM = mockDOMSource(RxJSAdapter, {
        '.foo': {
          'click': O.of({target: {innerHTML: '123'}})
        }
      });
      Component({DOM}, nullModel, nullView, intent);
      function intent(DOMSource, ...rest) {
        const rollButton$ = DOMSource.select('.foo').events('click');
        expect(rollButton$.map(evt => evt.target.innerHTML)).toBeStreamOf('123');
        return O.empty();
      }
    });

    test('model is function from actions$ to observable of models', function() {
      ['first action', 'second action'].forEach(expected => {
        const intent = (sources, ...rest) => O.of(expected);
        Component({}, model, nullView, intent);

        function model(action$, ...rest) {
          expect(action$).toBeStreamOf(expected);
        }
      });
    });

    test('view is function from model$ to observable of renderings', function() {
      [div('first'), div('second')].forEach(expected => {
        const model = (actions$, ...rest) => O.of(expected);
        Component({}, model, view, nullIntent);

        function view(model$, ...rest) {
          expect(model$).toBeStreamOf(expected);
        }
      });
    });

    test('component returns object with DOM attribute as stream from view', () => {
      const testView = (model$: O<any>) => O.of(div('testDOM'));
      expect(Component({}, nullModel, testView, nullIntent).DOM)
        .toBeStreamOf(div('testDOM'));
    });
  };
}
