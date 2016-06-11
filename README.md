# FRP Bowling Kata

## Installation

To install the application, clone the repository, go to the directory and install
dependencies.

bash
```bash
git clone git@github.com:wizardwerdna/FRPBowlingKata.git
cd FRPBowlingKata
npm install && tsd install
```

The system uses webpack, so create an index.html file that integrates
the `bundle.js` script.

index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
</head>
<body>
  <div><h1>FRP Bowling Kata</h1</div>
  <script src="bundle.js"></script>
</body>
</html>
```

app.ts
```typescript
console.log('app.ts here');
```

# The Scorer$ function

We will first drive out the development of a function, `scorer$` which takes as
an input any Observable stream, array or iterable representing a sequence of
integers inclusively between 0 and 10, each representing the number of pins dropped
in a roll of bowling.  The function will return an Observable stream of integers
representing the score for each frame of the game.

```
-- 5-- 5--10--10--10-- 1-- 2|
  scorer$
------20----------50--71---(84,87)|
```

In driving out the development, we will not be concerned about the timing
of this stream, but will require that the stream accurately recount the game.
Note that the inputs may result in different prefixes, as partial open frames
are scored, but if the frame is completed to a spare, then the spare frame
will be unscored until the bonus pins are dropped.

```
-- 5|
  scorer$
-- 5|                       (partial open frame is scored)

-- 5-- 5|
  scorer$
--------|                   (partial spare is unscored)

-- 5-- 5-- 5|
  scorer$
-----------(15, 20)|        (spare is scored, as is the following partial spare)

-- 5-- 5-- 5-- 5|
  scorer$
----------15----|           (completed spare is scored, but partial spare is not)
```

## 1. EmptyGame

We begin building our first tests, using a simple test driver that logs
test results into the browser console.  We also add our first test, scoring an
empty game as the empty stream.  The test is red, throwing an error from an
`rxjs` Observable.

app.ts
```typescript
import { test, testSuite } from "./testsuite";

test(">>>> BEGIN FRP Bowling Test Suite", testSuite);
```

testsuite.ts
```typescript
import { Observable } from "rxjs";

const scorer$ = (fromSource) => { return Observable.throw("funny"); };

export function testSuite () {

  test("should know the truth", function(){
    assertEqual(true, true);
  });

  test("should score empty game", function(){
    scorer$([]).toArray()
      .subscribe(
        result => assertEqual([], result),
        error  => console.error("Error: ", error)
      );
  });

}

function assertEqual(expected, value) {
  if (JSON.stringify(expected) === JSON.stringify(value)) {
    console.info("%cexpected value %o was returned", "color: green", expected);
  } else {
    console.error("expected %o, but got %o", expected, value);
  }
}

export function test(testName, tests) {
  console.group(testName);
  tests();
  console.groupEnd();
}
```

## 2. Partial Open Frame

We write code to pass the test, returning the empty Observable. 
[`Observable.empty`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-empty) 
Of course, this isn't the end of the game, since *every* game will be scored as the empty
set.  That's precisely the point.  In TDD, we write the least and simplest code
to to pass the test.  Then, we add more tests to generalize the code.  As Uncle Bob
Martin wrote:

```text
As the tests get more specific, the code gets more generic.
```


scorer.ts
```typescript
import { Observable } from "rxjs"

export function scorer$(fromSource) {
  return Observable.empty();
}
```

Now that we are <span style="color: green">green</span>, we <span style="color: orange;">refactor</span> the tests
(yes we <span style="color: orange;">refactor</span> tests and code) to shorten the tests.  And then go 
<span style="color: red">red</span> with a new test to score a gutter ball 
with the array [0].

testsuite.ts
```typescript
import { scorer$ } from "./scorer";

export function testSuite () {

  test("should know the truth", function(){
    assertEqual(true, true);
  });

  test("should score empty game", function(){
    testScorer([], []);
  });

  test("partial open frame", function(){
    testScorer([0], [0]);
  });
}

function testScorer(fromSource, expected) {
  scorer$(fromSource).toArray()
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
```

## 3. Full Open Frame

We score the partial open frame by responding with an Observable that
scores a list of rolls by duplicating it. 
[`Observable.from`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-from)
Although more generic than, for
example, code distinguishing the empty stream `--` from a singleton stream of `--0--` 
any obvious way of implementing that code would be more complex than the
following one-liner:

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource);
}
```

So we generalize when the generalization is simpler than more specific code.
And now we are <span style="color: green">green</span>.  We add a test for a
full open frame of gutter balls (`--0--0--`) which scores as `--0--`.

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
});
```

# 4. Full Open Frame 2
scorer.ts

Ok, bear with me.  I realize this is a stupid, dumb-as-dirt, way to solve
the two gutter rolls from single gutter rolls.  But our tests say the result
is the same for both of them.  So our new test fails by copying the [0,0].
It turns out there is a five-character way to do this, so we do this, using
the [`take Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-take)
which simple takes the first element of the two cases, or empty, if there are no
elements.
![take Marble Disagram](http://reactivex.io/rxjs/img/take.png)

```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource).take(1);
}
```

Dumb-as-dirt, yes, but its the simplest thing that could possibly work, and it
does.  We are <span style="color: green">green</span>. What now?  Easy, add a
test for which the `take(1) Operator` fails.

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
});
```

# 5. Full Open Frame 3

Sure, taking the first element fails for
this case.  But we're much smarter than that.  `Rxjs` has a
[`takeLast Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-takeLast)
![takeLast Marble Disagram](http://reactivex.io/rxjs/img/takeLast.png)

scorer.ts
```typecript
export function scorer$(fromSource) {
  return Observable.from(fromSource).takeLast(1);
}
```

Which handles all cases (`--`, `--0--`, `--0--0--`, `--0--1--`) and we are <span style="color: green'">green</span>
Damn, we are too smart for our own good.  But (think Smeagol) we are even smarter yet.  We write a better
test that won't trivially.  Here's a more specific test that will resolve all the "take-based" operators:
`--1--1--`, which scores to `--2--`:

testsuite.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
  testScorer([1, 1], [2]);
});
```
## 6. Two Open Frames

And with that, we are <span style="red">red</span> again.  So it seems that a single frame is
not scored just by copying, but rather by *adding* the elements.  Rxjs has an operator for that
too, a familiar one to people who understand the Javascript `Array` type.  Using a reducer to sum
the elements with the
[`reduce Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-reduce).
![reduce Marble Disagram](http://reactivex.io/rxjs/img/reduce.png)

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .reduce((acc: any, curr) => acc + curr);
}
```

and we are <span style="color: green;">green</span>.  The limitation of this approach,
of course, is that adding only makes sense for a single open frame.  So we add a test
setting up for two open frames one after another.  Note that this is now <span style="color: red;">red</span>
because adding up all the elements produces just the single [3], rather than the expected result.

testsuite.ts
```typecript
test("two open frames", function(){
  testScorer([0, 0, 1, 2], [0, 3]);
});
```

## 7. Two Open Frames 2

This is a bit trickier than the earlier task, because we want to break up the
open frames into separate groups before we reduce it with a sum.  Rx has operators
for that, one of which is 
[`windowCount(2) Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-windowCount).
![windowCount Marble Disagram](http://reactivex.io/rxjs/img/windowCount.png)


This operator will take a stream, and break it up into substreams each of 
which has two elements, so that we can operate on each group separately.  
If there are an even number of elements, an additional empty stream 
appears at the end, and if there are an odd number of elements, 
then the last element of the stream is added as a singleton stream.
What we have is a resulting stream of streams, each of which we can `reduce`.

The problem is that we want to have a flattened stream of the resulting 
reductions, and there is an operator for that too:
[`mergeMap Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap).
Folks familiar with other functional languages may recognize this as a function
called `flatMap`;
![mergeMap Marble Disagram](http://reactivex.io/rxjs/img/mergeMap.png)

What `mergemap` does to an Observable of Observables is to first apply the map
function to each supplied inner Observable, and then merge the results together.
For those in the know, this is equivalent to a `map`, followed by a `mergeAll`.

scorer.ts
```typescript
export function scorer$(fromSource) {
  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frame =>
      frame.reduce(acc: any, curr) => acc + curr);
}
```

And now we are <span style="color: green">green</span>.  We add another test
that shows that the reported score for each frame is not the result of that
frame, but the result of that frame added to the previous frame score.  The
last test finessed that issue because the score of the first frame is 0.
So we add a new example where the first frame is non-zero.  And now we are
<span style="color: red">red</span>.

testsuite.ts
```typecript
test("two open frames", function(){
  testScorer([0, 1, 1, 2], [1, 4]);
});
```

## 8. One Completed Spare

We now add a new operator that handles this.  `reduce` would not suffice,
because it returns a single result, the sum of all the elements in the
stream.  Rxjs has yet another useful result: [the `scan Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan).
![scan Marble Disagram](http://reactivex.io/rxjs/img/scan.png)

Scan performs the acccumulation as does reduce, but emits the result of the process with an
element for each time.

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame => frame.reduce(sumReducer);

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
}
```

This does the trick, and we are <span style="color: green">green</span>!  Now
we <span style="color: orange;">refactor</span>, extracting the function for `sum` and `reduce`.  This leads to a
nice, concise solution for a game of open frames.

Now, we need to handle some slightly more complex scanarios, the spare and
then the strike.  We add a test for a simple spare followed by a 5, and we are
<span style="color: red">red</span>.

testsuite.ts
```typecript
test("one completed spare", function(){
  testScorer([5, 5, 5], [15, 20]);
});
```

## 9. One Completed Spare 2

The trick with a spare frame is that it scores to 10 points (also the sum of
the rolls in that frame), plus the pincount of the next roll, 
which will also count in the next frame.  But this test doesn't require anything
special, so we handle it simply by adding a conditional to the frameScorer function.

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.reduce((acc, curr) => acc + curr + (acc + curr === 10 ? 5 : 0));

  return Observable.from(fromSource)
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
}
```

And we are now <span style="color: green">green</span>, simply by using
the constant 5 from the test. (A TDD trick we call a "slime").  Remember,
we don't do more than is necessary to pass the test, unless generalizing
is an obviously simpler choice.  Of course, this elegant solution only works
if every spare frame is followed by a 5-pin roll. 

So our next test follows the spare with something else, here a 9-pin roll,
and now we are <span style="red">red</span>

testsuite.ts
```typecript
test("one completed spare", function(){
  testScorer([5, 5, 5], [15, 20]);
  testScorer([5, 5, 9], [19, 28]);
});
```

## 10. One Completed Strike

We have a few steps to solve this puzzle.  The first is to figure out
how to "look ahead" to the next frame, and then to parse that frame
for the result.  Again, we exploit a special Rxjs operator: 
[`bufferCount Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferCount).
![scan Marble Disagram](http://reactivex.io/rxjs/img/bufferCount.png)

This reduces a stream of values into a stream of arrays, of the length passed in
as the first parameter.  If a second parameter is given, then the next array starts
that many items after the last one.  Thus for the example stream in our test: 
`--5--5--9--|`, bufferCount(3,1)
results in the stream: `--[5,5,9]--[5,9]--[9]--`.  Then, we break that stream
up into the observable of observables, the first one having the first two
elements `--[5,5,9]--[5,9]--`, and the second one having the remainder `--[9]--`

Then, to score a substream (we call them frames), we pick off the first roll 
of that substream and check to see if its a spare.  If so, we add all three
elements, otherwise we add the first two, as we would for any open frame.

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
        rolls[0] + rolls[1] === 10 ?
          rolls.reduce(sumReducer) :
          rolls[0] + (rolls[1] || 0)
      );

  return Observable.from(fromSource)
    .bufferCount(3, 1)    // change rolls into triplets
    .windowCount(2)       // break frames into two-roll sets
    .mergeMap(frameScorer)// score each frame separately
    .scan(sumReducer);    // add the frames
}
```

testsuite.ts
```typecript
test("one completed strike", function(){
  testScorer([10, 1, 2], [13, 16]);
});
```

## 11. Partial Mark Frames

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
          rolls.pins[0] === 10 || rolls.pins[0] + rolls.pins[1] === 10 ?
          rolls.pins.reduce(sumReducer) :
          rolls.pins[0] + (rolls.pins[1] || 0)
      );

  const frameReducer =
    (acc, curr) => {
      if (curr[0] === 10 && acc.isLastInFrame)
        return {
          frame: acc.frame + 1,
          isLastInFrame: true,
          pins: curr
        };
      else
        return {
          frame: acc.isLastInFrame ? acc.frame + 1 : acc.frame,
          isLastInFrame: !acc.isLastInFrame,
          pins: curr
        };
    };

  const sourceToFrame$ = fromSource =>
    Observable.from(fromSource)
      .bufferCount(3, 1)
      .scan(frameReducer, {isLastInFrame: true, frame: 0});

  return sourceToFrame$(fromSource)
    .groupBy(roll => roll.frame)
    .mergeMap(frameScorer)
    .scan(sumReducer)
    .take(10);
}
```

testsuite.ts
```typecript
test("partial spare", function(){
  testScorer([5, 5], []);
});

test("partial strike", function(){
  testScorer([10], []);
  testScorer([10, 5], []);
  testScorer([10, 10], []);
});

test("zero game", function(){
  testScorer(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  );
});

test("spare game", function(){
  testScorer(
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [15, 30, 45, 60, 75, 90, 105, 120, 135, 150]
  );
});

test("perfect game", function(){
  testScorer(
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    [30, 60, 90, 120, 150, 180, 210, 240, 270, 300]
  );
});
```

## 12. Completed Scorer

scorer.ts
```typescript
export function scorer$(fromSource) {
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
          rolls.pins[0] === 10 || rolls.pins[0] + rolls.pins[1] === 10 ?
          rolls.pins.reduce(sumReducer) :
          rolls.pins[0] + (rolls.pins[1] || 0)
      );

  const frameReducer =
    (acc, curr) => {
      if (curr[0] === 10 && acc.isLastInFrame)
        return {
          frame: acc.frame + 1,
          isLastInFrame: true,
          pins: curr
        };
      else
        return {
          frame: acc.isLastInFrame ? acc.frame + 1 : acc.frame,
          isLastInFrame: !acc.isLastInFrame,
          pins: curr
        };
    };

  const sourceToFrame$ = fromSource =>
    Observable.from(fromSource)
      .bufferCount(3, 1)
      .map(trip => trip.concat(NaN, NaN, NaN).slice(0, 3))
      .scan(frameReducer, {isLastInFrame: true, frame: 0});

  return sourceToFrame$(fromSource)
    .groupBy(roll => roll.frame)
    .mergeMap(frameScorer)
    .scan(sumReducer)
    .take(10)
    .filter(roll => !isNaN(roll));
}
```

# Displayer

## 20. Display Empty Game 

displayer.ts
```typescript
import { Observable } from "rxjs";
export function displayer$(fromSource) {
  return Observable.throw("no result");
}
```

displayer.spec.ts
```typescript
import { Observable } from "rxjs";
import { displayer$ } from "./displayer";
import { test, assertEqual } from "./testsuite.ts";

export function displayer$Tests() {
  test("testing truth", function(){
    assertEqual(true, true);
  });

  test("displaying empty game", function(){
    testDisplayer([], "");
  });
}

function testDisplayer(fromSource, expected) {
  displayer$(fromSource)
  .subscribe(
    result => assertEqual(expected, result),
    error  => console.error("Error: ", error)
  );
}
```

### 21.  Display Gutter Ball

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.empty();
}
```

displayer.spec.ts
```typescript
test("displaying gutter ball", function(){
  testDisplayer([0], "-");
});
```

### 22.  Display Strike

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.from(fromSource)
    .map(roll => "-");
```

displayer.spec.ts
```typescript
test("displaying strike", function(){
  testDisplayer([10], " X");
});
```

### 23.  Display Other Rolls

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .map(roll => {
    if ( roll === 0 )
      return "-";
    else
      return " X";
  })
  .reduce((acc, curr) => acc + curr, "")
  ;
}
```

displayer.spec.ts
```typescript
test("displaying other single rolls", function(){
  testDisplayer([3], "3");
});
```

### 24. Display Single Spares 

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .map(roll => {
    if ( roll === 0 )
      return "-";
    else
      return " X";
    else
      return roll.toString();
  })
  .reduce((acc, curr) => acc + curr, "")
  ;
}
```

displayer.spec.ts
```typescript
test("displaying open frames and strikes", function(){
  testDisplayer([0, 6], "-6");
  testDisplayer([0, 6, 10, 0, 9], "-6 X-9");
});
test("display spares", function(){
  testDisplayer([5, 5, 5], "5/5");
});
```

### 25. Display Complete Games

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .scan((acc: any, curr) => {
    if ( curr === 0 )
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: "-"
      };
    else if ( curr === 10 && isNaN(acc.carry))
      return {
        carry: NaN,
        pins: " X"
      };
    else if ( curr + acc.carry === 10 )
      return {
       carry: NaN,
       pins: "/" };
    else
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: curr.toString()
      };
  }, {carry: NaN})
  .map(roll => roll.pins);
  .reduce((acc, curr) => acc + curr, "")
  ;
}
```

displayer.spec.ts
```typescript
  test("display spares", function(){
    testDisplayer([5, 5, 5], "5/5");
    testDisplayer([0, 10, 5], "-/5");
  });
  test("display complete games", function(){
    testDisplayer(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "--------------------"
    );
    testDisplayer(
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      "5/5/5/5/5/5/5/5/5/5/5"
    );
    testDisplayer(
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      " X X X X X X X X XXXX"
    );
  });
```

## 26.  Complete Display

displayer.ts
```typescript
export function displayer$(fromSource) {
  return Observable.from(fromSource)
  .scan((acc: any, curr, index) => {
    if ( curr === 0 )
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: "-",
        chars: acc.chars + 1
      };
    else if ( curr === 10 && isNaN(acc.carry))
      return {
        carry: NaN,
        pins: acc.chars < 18 ? " X" : "X",
        chars: acc.chars + (acc.chars < 18 ? 2 : 1)
      };
    else if ( curr + acc.carry === 10 )
      return {
        carry: NaN,
        pins: "/",
        chars: acc.chars + 1
      };
    else
      return {
        carry: isNaN(acc.carry) ? curr : NaN,
        pins: curr.toString(),
        chars: acc.chars + 1
      };
  }, {carry: NaN, chars: 0})
  .map(roll => roll.pins);
}
```
