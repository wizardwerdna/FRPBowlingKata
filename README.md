# FRP Bowling Kata

This repository contains a responsive functional application using Cycle.js and
Typescript to implement an interactive bowling scoring program.  The Kata will be
built with a homegrown two-function testing suite that displays its results
in the browser console.

<center><img src="https://raw.githubusercontent.com/wizardwerdna/FRPBowlingKata/master/Display.png" width="600px"></center>

[Click here for a running version of the FRP Bowling application](http://wizardwerdna.github.io).

The purpose is to demonstrate how to use Test First Development to execute the
[Classical Bowling Kata](http://codingdojo.org/cgi-bin/index.pl?KataBowling).
This Kata varies from he Classical Kata, in that the scoring program can handle
partial games and will properly score partial strikes and spares.


## Screencasts

This application's development was recorded in a series of screencasts following
the TDD development of the application.  They take forever to load, and I will
update the list as I get them out, the introduction and three principal modules
are presently laid out.  None have been carefully edited -- this round is primarily
or comments and discussion.  All mistakes are mine.  A written outline of the development
will also be posted here as it is completed.  Please remember, these are all very
rough drafts.

| name | description |
| --- | --- |
| [01 - FRP Bowling - Introduction](https://www.youtube.com/watch?v=pym3exC74Zw) | Introduction to the application, overview of its modules, overview of TDD, and the testing framework.|
| [02 - FRP Bowling - Scorer$](https://www.youtube.com/watch?v=gf5IvtlJdck) | TDD development of the scorer$, which transforms a stream of rolls into a stream of frame scores. |
| [03 - FRP Bowling - Displayer$](https://www.youtube.com/watch?v=nMk0bqDetqw) | TDD development of the displayer$, which transforms a stream of rolls into a singleton stream of a string representing the display of the stream of rolls. |
| [04 - FRP Bowling - Enabler](https://www.youtube.com/watch?v=CsGYNkLjtbI) | TDD development of the enabler, which, given an array of scores from the scorer$ and  string from the displayer$, determines which roll buttons are to be disableto be disabled. |

The key functional parts built with corresponding unit tests are:

| name | description |
| --- | --- |
| scorer$ | transforms a stream of rolls into a stream of frame scores |
| displayer$ | transforms a stream of rolls into a string (as a singleton stream), in which gutter balls are shown as "-", spares are shown as "/" and strikes are shown as " X" (or just "X" for the tenth frame). |
| enabled | a function that returns a value representing the maximum button to be enabled |

## Running the application

To install and run the application, clone the repository, go to the directory and install dependencies and start the webpack-dev-server.

```bash
git clone git@github.com:wizardwerdna/FRPBowlingKata.git
cd FRPBowlingKata
npm run setup
npm start
```
Then open your browser to http://localhost:8080/

## Using the Seed Application to Perform the Kata Yourself

If you care to follow the development in the Screencasts, you might want to start
with the current version of the browser-base testing framework at my Seed site,
and follow along the kata development to perform it yourself.

```bash
git clone git@github.com:wizardwerdna/RxJS.git <yourdesiredfolder>
cd <yourdesiredfolder>
npm run setup
npm start
```



## Testsuite (Brower-console-based Test Functions).

The seed development system includes a homegrown test system that displays
test results in the console of a Browser.

```javascript
test('string identifying test or tests', function_containing_assertions, display)
```

A `test` function posts a group to the browser console, bearing the string
as its identifier, and then runs the function.  The third parameter `display` indicates whether the group for the test is initially opened (when true, the default), or closed.  Tests may be nested, where they will post groups internal to parent tests.  Statistics of tests run,
passed and errors are maintained and will be posted after the outermost
nested function is completed.

```javascript
expect(actual)
expect(actual).not
```

Expectations retain the value of `actual` for use with subsequent testing
functions as shown below.  If followed with a `.not`, it will change the
meaning of the testing function, passing when the function would fail, and vice-versa.  Thus, `expect(1).toBe(1)` passes and `expect(1).not.toBe(1)` fails.  Likewise, `expect(1).not.toBe(false)` passes and `expect(1).toBe(false)` fails.

```javascript
expect(actual).toBe(expected)
```

This test is passed, when `actual === expected`, in the javascript
sense of '==='.  Thus,

```javascript
expect(actual).toEqual(expected)
```

This test is passed, when `JSON.stringify(actual) === JSON.stringify(expected)`.

```javascript
expect(actual$).toMarble(expected_marble_diagram)
```

This test is passed, when `str2mbl(actual$) === expected_marble_diagram`.

```javascript
expect(actual$).toBeStreamOf(expected)
```

For each element `ele` of actual$, this expectation runs `expect(ele).toBe(expected)`, as separate expectations.  Thus, no tests are run when actual$ is the empty stream.

```typescript
mbl2str$(marble_diagram)
```

This returns a stream corresponding to the ASCII marble diagram.  The stream is treated synchronously, giving no meaning to each '-', except as a separator of
the elements presented.  Thus `mbl2str$('--a-b--c--|')` is the same stream as `mbl2str$('-a-b-c|')`;

## Development of the `scorer$`

### The Empty Game
```typescript
test('empty', testScore('-|', '-|'));

function testScore(rolls, expected) {
  return function () {
    const rolls$ = mbl2str$(rolls);
    expect(scorer$(rolls$)).toMarble(expected);
  };
}
```

and we are <span style="color: red">red</span>!


```typescript
return Observable.empty();
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Gutter Ball
```typescript
test('gutter', testScore('-0|', '-0|'));
```

and we are <span style="color: red">red</span>!


```typescrtipt
return roll$
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Open Frame I
```typescript
test('open', testScore('-0-0|', '-0|'));
```

and we are <span style="color: red">red</span>!


```typescrtipt
return roll$.take(1)
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Open Frame II
```typescript
test('open', testScore('-0-1|', '-1|'));
```

and we are <span style="color: red">red</span>!


```typescrtipt
return roll$.takeLast(1)
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Open Frame III
```typescript
test('open', testScore('-1-1|', '-2|'));
```

and we are <span style="color: red">red</span>!


```typescript
const sum = (acc, curr) => acc + curr;
return roll$.reduce(sum);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Two Open Frames I
```typescript
test('two open', testScore('-0-0-1-1|', '-0-2|'));
```

and we are <span style="color: red">red</span>!


```typescript
const frameScorer = frame =>
  frame.reduce(sum); 
return roll$
  .windowCount(2)
  .mergeMap(frameScorer);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Two Open Frames II
```typescript
test('two open', testScore('-1-1-2-2|', '-2-6|'));
```

and we are <span style="color: red">red</span>!


```typescript
return roll$
  .windowCount(2)
  .mergeMap(frameScorer);
  .scan(sum);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Spare I
```typescript
test('spare', testScore('-5-5-5|', '-15-20|'));
```

and we are <span style="color: red">red</span>!


```typescript
const frameScorer = frame =>
  frame.reduce((acc, curr) =>
    acc + curr === 10 ?
      acc + curr + 5 :
      acc + curr
  );
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Spare II
```typescript
test('spare', testScore('-5-5-9|', '-19-28|'));
```

and we are <span style="color: red">red</span>!


```typescript
...
const frameScorer = frame =>
  frame.reduce((acc, curr) =>
    curr[0] + curr[1] ?
      curr.reduce(sum) :
      curr[0] + (curr[1] || 0)
  );
...
return roll$
  .bufferCount(3, 1);
  .windowCount(2)
  .mergeMap(frameScorer);
  .scan(sum);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Strike
```typescript
test('strike', testScore('-10-1-2|', '-13-16|'));
```

and we are <span style="color: red">red</span>!


```typescript
...
const isStrike = (curr) => curr[0] === 10;

const frameMarker = (acc, curr) => (
  acc.lastRoll && isSrike(curr) ?
    { pins: curr, frame: acc.frame + 1, lastRoll: true }
    {
      pins: curr,
      frame: acc.lastRoll ? acc.frame + 1 : acc.frame,
      lastRoll: !acc.lastRoll
    }
)

...
return roll$
  .bufferCount(3, 1)
  .scan(frameMarker)
  .groupBy(m => m.frame, m => m.pins)
  .mergeMap(frameScorer);
  .scan(sum);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Partial Spare
```typescript
test('partial spare', testScore('-5-5|', '-|'));
```

and we are <span style="color: red">red</span>!


```typescript
return roll$
  .bufferCount(3, 1)
  .map(trip => trip.concat(NaN, NaN).slice(0, 3))
  .scan(frameMarker)
  .groupBy(m => m.frame, m => m.pins)
  .mergeMap(frameScorer);
  .scan(sum)
  .filter(score => !isNaN(score))
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Spare Game
```typescript
test('spare game', testScore(
  '-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5|',
  '-15-30-45-60-75-90-105-120-135-150|'
));
```

and we are <span style="color: red">red</span>!

```typescript
return roll$
  ...
  .take(10);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

```typescript
roll$
  .let(makeFrames)
  .let(scoreFrames)
  .let(cleanPartials);

function makeFrames(roll$) {
  return roll$
    .bufferCount(3, 1)
    .map(trip => trip.concat(NaN, NaN).slice(0, 3))
    .scan(frameMarker)
    .groupBy(m => m.frame, m => m.pins)
}

function scoreFrames(frame$) {
  return frame$
    .mergeMap(frameScorer);
    .scan(sum)
}

function cleanPartials(score$) {
  return score$  
    .filter(score => !isNaN(score))
    .take(1)
}

```

## Development of the `displayer$`

TO BE DONE

### The Empty Game
```javascript
  test('empty', testDisplay('-|', ''));
  function testDisplay(rolls, expected) {
    return function() {
      const roll$ = mbl2str$(rolls);
      expect(displayer$(roll$)).toBeStreamOf(expected);
    };
  }
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Gutter Ball
```javascript
  test('gutter', testDisplay('-0|', '-'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Strike
```javascript
  test('strike', testDisplay('-10|', ' X'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Non-gutter, Non-strike Roll I
```javascript
  test('other', testDisplay('-1|', '1'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Non-gutter, Non-strike Roll II
```javascript
  test('other', testDisplay('-9|', '9'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Two Rolls
```javascript
  test('two rolls', testDisplay('-0-9|', '-9'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Spare
```javascript
  test('spare', testDisplay('-5-5|', '5/'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Non-Strike
```javascript
  test('tenth frame', function() {
    const preRolls = '-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0';
    const preDisplay = '------------------';
    test('spare', testDisplay(preRolls + '-0-10|', preDisplay + '-/'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Spare/Non
```javascript
    test('spare/non', testDisplay(preRolls + '-0-10-0|', preDisplay + '-/-'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Tenth Frame: Spare/Strike
```javascript
    test('spare/strike', testDisplay(preRolls + '-0-10-10|', preDisplay + '-/X'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike
```javascript
    test('strike', testDisplay(preRolls + '-10|', preDisplay + 'X'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike/Non
```javascript
    test('strike/non', testDisplay(preRolls + '-10-0|', preDisplay + 'X-'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Open
```javascript
    test('strike/open', testDisplay(preRolls + '-10-0-0|', preDisplay + 'X--'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike/Spare
```javascript
    test('strike/spare', testDisplay(preRolls + '-10-0-10|', preDisplay + 'X-/'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Double
```javascript
    test('double', testDisplay(preRolls + '-10-10|', preDisplay + 'XX'));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Turkey
```javascript
    test('turkey', testDisplay(preRolls + '-10-10-10|', preDisplay + 'XXX'));
  });
```
and we are <span style="color: red">red</span>!

```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

## Development of the `enabler`

TO BE DONE

### The Empty Game
```javascript
test('empty', testEnable('', [], 10));
  function testEnable(display, scores, expected) {
    return () => expect(enabler(display, scores)).toBe(expected);
  }
}
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### One Gutter Ball
```javascript
  test('gutter', testEnable('-', [0], 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Non-Gutter Ball
```javascript
  test('other', testEnable('4', [4], 6));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Open Frame
```javascript
  test('open', testEnable('44', [8], 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Spare
```javascript
  test('spare', testEnable('4/', [], 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Spare / Other
``javascript
  test('spare/other', testEnable('4/4', [], 6));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Gutter Ball
```javascript
  test('tenth frame', function() {
    const preDisplay = '------------------';
    const preScores = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    test('gutter', testEnable(preDisplay + '-', preScores.concat(0), 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Non-Gutter Ball
```javascript
    test('other', testEnable(preDisplay + '3', preScores.concat(3), 7));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Open Frame
```javascript
    test('open', testEnable(preDisplay + '34', preScores.concat(7), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Partial Spare
```javascript
    test('partial spare', testEnable(preDisplay + '3/', preScores, 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Complete Spare
```javascript
    test('complete spare', testEnable(
      preDisplay + '3/2', preScores.concat(12), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike
```javascript
    test('strike', testEnable(preDisplay + 'X', preScores, 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike/Gutter
```javascript
    test('strike/gutter', testEnable(preDisplay + 'X-', preScores, 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike / Other
```javascript
    test('strike/other', testEnable(preDisplay + 'X3', preScores, 7));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike / Open
```javascript
    test('strike/open', testEnable(preDisplay + 'X34', preScores.concat(13), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Strike / Spare
```javascript
    test('strike/spare', testEnable(preDisplay + 'X3/', preScores.concat(20), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Double
```javascript
    test('double', testEnable(preDisplay + 'XX', preScores, 10));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Double / Gutter
```javascript
    test('double/gutter', testEnable(
      preDisplay + 'XX-', preScores.concat(20), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Double / Other
```javascript
    test('double/other', testEnable(preDisplay + 'XX3', preScores.concat(23), -1));
```
and we are <span style="color: red">red</span>!
```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

### Tenth Frame: Turkey
```javascript
    test('turkey', testEnable(preDisplay + 'XXX', preScores.concat(30), -1));
```
and we are <span style="color: red">red</span>!

```typescript
SOLUTION GOES HERE
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!
