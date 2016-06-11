export function testSuite () {
  test("should know the truth", function(){
    assertEqual(true, true);
  });
}

export function assertEqual(expected, value) {
  if (JSON.stringify(expected) === JSON.stringify(value)) {
    console.info("%cexpected value %o was returned", "color: green", expected);
  } else {
    console.error("expected %o, but got %o", expected, value);
  }
}

export function test(testName, tests, isOpen = true) {
  if (isOpen)
    console.group(testName);
  else
    console.groupCollapsed(testName);
  tests();
  console.groupEnd();
}
