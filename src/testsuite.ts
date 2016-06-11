export function testSuite () {
  test('should know the truth', function(){
    assertEqual(true, true);
  });
}

const data = {
  run : 0,
  passed : 0,
  failed : 0,
  error :  0,
  nest :  0,
};

export function assertEqual(expected, value) {
  data.run++;
  try {
    if (JSON.stringify(expected) === JSON.stringify(value)) {
      console.info('%cexpected value %o was returned', 'color: green', expected);
      data.passed++;
    } else {
      console.error('expected %o, but got %o', expected, value);
      data.failed++;
    }
  } catch (err) {
    console.error('Error:', err);
    data.error++;
  }
}

export function test(testName, tests, isOpen = true) {
  data.nest++;
  if (isOpen) {
    console.group(testName);
  } else {
    console.groupCollapsed(testName);
  }
  tests();
  console.groupEnd();
  data.nest--;
  if (data.nest === 0) {
    console.log('%cReport: %d run; %d passed; %d failed; %d errors',
      (data.run === data.passed ? 'color: green' : 'color: red'),
      data.run, data.passed, data.failed, data.error);
  }
}
