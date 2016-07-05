# FRP Bowling Kata

This repository contains a responsive functional application using Cycle.js and
Typescript to implement an interactive bowling scoring program.  The Kata will be
built with a homegrown two-function testing suite that displays its results
in the browser console.

<center><img src="https://raw.githubusercontent.com/wizardwerdna/FRPBowlingKata/master/Display.png" width="600px"></center>

The purpose is to demonstrate how to use Test First Development to execute the
[Classical Bowling Kata](http://codingdojo.org/cgi-bin/index.pl?KataBowling).
This Kata varies from he Classical Kata, in that the scoring program can handle
partial games and will properly score partial strikes and spares.

The key functional parts built with corresponding unit tests are:

| name | description |
| --- | --- |
| scorer$ | transforms a stream of rolls into a stream of frame scores |
| displayer$ | transforms a stream of rolls into a string (as a singleton stream), in which gutter balls are shown as "-", spares are shown as "/" and strikes are shown as " X" (or just "X" for the tenth frame). |
| enabled | a function that returns a value representing the maximum button to be enabled |

## Running the application

To install and run the application, clone the repository, go to the directory and install dependencies and start the webpack-dev-server.

bash
```bash
git clone git@github.com:wizardwerdna/FRPBowlingKata.git
cd FRPBowlingKata
npm install && tsd install
webpack-dev-server
```
# Developing the Scorer$ function

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


## Our first test: Scoring an Empty Game

The surprising benefits of the minimalist style of coding with TDD is that we
often finding ourselves refactoring into a simple, elegant and expressive result.
Although our tests do not suggest any carefully designed-up-front code, the end-result tends to refactor into an elegant solution.  We will end up with code that
looks as thought it were beautifully designed from the top:

```typescript
export function scorer$(roll$) {

  return roll$
    .let(buildFrames$)
    .let(scoreFrames$)
    .let(cleanPartialFrames$);

  function buildFrames$(input$) {
  ...
  }

  function scoreFrames$(frames$) {
  ...
  }

  function cleanPartialFrames$(scoredFrames$) {
  ...
  }

}
```

To start, we write the minimum amount of code necessary to compile and run our
test suite for the scorer$.

scorer.ts
```typescript
function scorer$(roll$) {
  Observable.throw('there is no code here');
}
```

Then we write our first test.

scorer.spec.ts
```typescript
import { test, assertEqual  } from "./testSuite";
import { scorer$ } from "./scorer";
export function scorer$Suite() {
  test("score the empty game", function(){
    const roll$ = Observable.from([]);
    scorer$(roll$).toArray().subscribe(
      actual => assertEqual([], actual),
      error  => console.error(error),
      ()     => console.info('completed')
    );
  });
}
```

and we are <span style="color: red">red</span>!  So now we can write some code.

We write code to pass the test, returning the empty stream.  There is a creation
function is Rxjs, just for that purpose.
[`Observable.empty`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-empty).
And so we write, using Rxjs:

scorer.ts
```typescript
import { Observable } from "rxjs";
export function scorer$(roll$) {
  return Observable.empty();
};
```

And that is enough to go <span style="color: green">green</span>.  Clearly, this
is not all that useful, since EVERY game gets scored to the empty stream.  That
said, it passes, the test, and its the simplest stream that goes green.  In TDD,
we write the least and simplest code needed to to pass the test.  
Then, we add more tests to generalize the code.  As Uncle Bob
Martin wrote:
```text
As the tests get more specific, the code gets more generic.
```

## Partial Open Frame

So now we add a new test, to capture a simple gutter ball, which scores as the
singleton stream of `--0--`.

scorer.spec.ts
```typescript
test("score a gutter ball", function(){
  const roll$ = Observable.from([0]);
  scorer$(roll$).toArray().subscribe(
    actual => assertEqual([0], actual),
    error  => console.error(error),
    ()     => console.info('completed')
  );
});
```

And we are <span style="color: red">red</span>.  We solve this by simply returning
the input stream. (Note: for the previous test, we chose to use the constant
`Observable.empty()` trying to write the most specific code possible.) 

scorer.ts
```typescript
export function scorer$(roll$) {
  return roll$; 
}
```

And now we are <span style="color: green"</span>.  We take a breath, and use
this opportunity to <span style="color: orange">refactor</span> the duplicated code in our test.

scorer.spec.ts
```typescript
import { test, assertEqual  } from "./testsuite";
import { scorer$ } from "./scorer";


export function scorer$Suite() {
  test("Score the empty game", function(){
    assertScorer$([], []);
  });

  test("Score a gutter ball", function(){
    assertScorer$([0], [0]);
  });

  function assertScore(rolls, expected) {
    const roll$ = Observable.from(rolls);
    scorer$(roll$).toArray().subscribe(
      actual => assertEqual(expected, actual),
      error  => console.error(error),
      ()     => console.info('completed')
    );
  }
}
```

We remain <spec style="color: green">green</spec> and move on to the next test.

## Full Open Frame

Testing for other partial open frames will obviously result in a valid answer,
scoring a `--5--` with a a `--5--`, and so forth, so we look for a test that
will require a generalization.  We begin with:

scorer.spec.ts
```typescript
test("Full open frame", function(){
  assertScorer$([0, 0], [0]);
});

```

So we generalize when the generalization is simpler than more specific code.
And now we are <span style="color: green">green</span>.  We add a test for a
full open frame of gutter balls (`--0--0--`) which scores as `--0--`.


Ok, bear with me.  I realize this is a stupid, dumb-as-dirt, way to solve
the two gutter rolls from single gutter rolls.  But our tests say the result
is the same for both of them.  So our new test fails by copying the [0,0].
It turns out there is a five-character way to do this, so we do this, using
the [`take Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-take)
which simple takes the first element of the two cases, or empty, if there are no
elements.
<center><img src="http://reactivex.io/rxjs/img/take.png" width="600px"></center>

Note that a similar operator, `first` exists that would works just as well in
the `--0--0--` and --0--, cases, but `first` errors when used in connection
with an empty stream.  This could be resolved by adding a `catch` for the empty
game case, but `take(1)` doesn't require it.  So we choose this:

```typescript
export function scorer$(roll$) {
  return rolls$.take(1);
}
```

We are <span style="color: green">green</span>. Dumb-as-dirt, no doubt, but this
is the simplest solution that could possibly work.  What now?  Easy, add a
test for which the `take(1) Operator` fails.

## Full Open Frame II

scorer.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
});
```

Sure, taking the first element fails for
this case.  But we're much smarter than that.  `Rxjs` has a
[`takeLast Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-takeLast)
<center><img src="http://reactivex.io/rxjs/img/takeLast.png" width="600px"></center>

scorer.ts
```typecript
export function scorer$(roll$) {
  return roll$.takeLast(1);
}
```

Which handles all cases (`--`, `--0--`, `--0--0--`, `--0--1--`) and we are <span style="color: green'">green</span>

## Full Open Frame III

Damn, we are too smart for our own good, sneaking around with new tests, and new responses.  
But (think Smeagol) we are even smarter yet.  We write a better
test that won't admit a trivial solution.

Here's a more specific test that can't be trivially solved with "take-based" operators:
`--1--1--`, which scores to `--2--`:

scorer.spec.ts
```typescript
test("full open frame", function(){
  testScorer([0, 0], [0]);
  testScorer([0, 1], [1]);
  testScorer([1, 1], [2]);
});
```

And with that, we are <span style="red">red</span> again.  So it seems that a single frame is
not scored just by copying, but rather by *adding* the elements.  Rxjs has an operator for that
too, a familiar one to people who understand the Javascript `Array` type.  Using a reducer to sum
the elements with the
[`reduce Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-reduce).
<center><img src="http://reactivex.io/rxjs/img/reduce.png" width="600px"></center>

It is important to note that the result of every operator on a stream is a
stream.  Thus, the result of the `reduce` operator is a singleton stream returning
the result of the reduce.

scorer.ts
```typescript
export function scorer$(roll$) {
  return $rolls.reduce((acc: any, curr) => acc + curr);
}
```

## Two Open Frames

And now we are <span style="color: green;">green</span>.  Our code seems to work
for all single open frames.  But what happens when we add a new frame?

scorer.spec.ts
```typecript
test("two open frames", function(){
  testScorer([0, 0, 1, 2], [0, 3]);
});
```

Note that this is now <span style="color: red;">red</span>
because adding up all the elements produces just the single [3], rather than the expected result.

This is a bit trickier than the earlier task, because we want to break up the
open frames into separate groups before we reduce it with a sum.  Happily, Rx has operators
for that, one of which is 

[`windowCount(2) Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-windowCount).
<center><img src="http://reactivex.io/rxjs/img/windowCount.png" width="600px"></center>


This operator will take a stream, and break it up into substreams each of 
which has two elements, so that we can operate on each substream separately.  
If there are an even number of elements, an additional empty stream 
appears at the end, and if there are an odd number of elements, 
then the last element of the stream is added as a singleton stream with the last
element.  What we have is a resulting stream of streams, each of which we can `reduce`.

The problem is that we want to have a flattened stream of the resulting 
reductions, and there is an operator for that too:
[`mergeMap Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap).
Folks familiar with other functional languages may recognize this as a function
called `flatMap`;
<center><img src="http://reactivex.io/rxjs/img/mergeMap.png" width="600px"></center>

What `mergemap` does to an Observable of Observables is to first apply the map
function to each supplied inner Observable, and then merge the results together.
For those in the know, this is equivalent to a `map`, followed by a `mergeAll`.

scorer.ts
```typescript
export function scorer$(roll$) {
  return roll$
    .windowCount(2)
    .mergeMap(frame =>
      frame.reduce(acc: any, curr) => acc + curr);
}
```

And now we are <span style="color: green">green</span>!  Time to 
<span style="color: orange">refactor</span>.

scorer.ts
```typescript
export function scorer$(roll$) {
  const sumReducer = (acc: number, curr) => acc + curr;
  return roll$
    .windowCount(2)
    .mergeMap(frame =>
      frame.reduce(sumReducer)
    );
}
```

## Two Open Frames II

Still <span style="color: green">green</span>, so we add another test.
Our last test works for two adjacent frames when the score of the first frame
is zero, but fails when the first frame does not score to zero, because the
score of each frame must add the score of the previous frame.  So when we
test for that scenario:

scorer.spec.ts
```typescript
  testScorer$([0, 1, 2, 3], [1, 6])
```

we are <span style="color: red">red</span>, because the existing code
incorrectly scores this game as `--1--5--`. 

We now add a new operator that handles this.  `reduce` would not suffice,
because it returns a single result, the sum of all the elements in the
stream.  Rxjs has yet another useful result: [the `scan Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan).
<center><img src="http://reactivex.io/rxjs/img/scan.png" width="600px"></center>

Scan performs the acccumulation as does reduce, but emits the result of the process with an
element for each time.  So we just add a scan to the end

scorer.ts
```typescript
  .scan(sumReducer);
}
```

and when this test passes, we refactor to yield:

scorer.ts
```typecript
export function scorer$(roll$) {
  const sumReducer = (acc: number, curr) => acc + curr;
  const frameScorer = frame => frame.reduce(sumReducer);
  return roll$
    .windowCount(2)
    .mergeMap(frameScorer)
    .scan(sumReducer);
};
```

This leads us to a nice, concise solution for a game of open frames.

These are all green, so now we move on to spares.

## One completed spare

Now, we need to handle some slightly more complex scanarios, the spare and
then the strike.  We add a test for a simple spare followed by a 5, and we are
<span style="color: red">red</span>.

scorer.spec.ts
```typecript
test("Score a completed spare", function(){
  testScorer([5, 5, 5], [15, 20]);
});
```

So now we fail, because we are not scoring the bonuses.  If we assume the bonus
is always 5, we can go <span style="color: green'">green</span> with the following
changes to framescorer.

scorer.ts
```typescript
const frameScorer = frame => frame.reduce((acc, curr) =>
  acc+curr===10 ?
    acc + curr + 5 :
    acc + curr
);
```

Once again, we might have been tempted to try to address the more general testing
rather than relying upon the constant "5" (in the trade, sometimes called a slime).
But it is almost always better to use the slime first and minimize structural
generalizations when we can.  As we see, it will more likely lead to a simpler
generalization to do this a little bit at a time.

## 9. One Completed Spare 2

The trick with a spare frame is that it scores to 10 points (also the sum of
the rolls in that frame), plus the pincount of the next roll.  Thus we add a test
forcing a generalization of the constant "5."

scorer.spec.ts
```typescript
test("Score a completed spare", function() {
  assertScorer$([5, 5, 5], [15, 20]);
  assertScorer$([5, 5, 9], [19, 28]);
});
```

and this brings us <span style="color: red">red</span> because the previous
code gives the first frame a frame bonus of 5, leading to a result of 
`--15--24--` instead of the desired `--19--28--`.  Looking at the code we
that a structural change is necessary, because there is no way within a roll
to "look-ahead" to the rolls in a future frame without "bringing in" the next
roll at the end of a frame.

We have a few steps to solve this puzzle.  The first is to figure out
how to "look ahead" to the next frame, and then to parse that frame
for the result.  Again, we exploit a special Rxjs operator: 
[`bufferCount Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferCount).
<center><img src="http://reactivex.io/rxjs/img/bufferCount.png" width="600px"></center>

This reduces a stream of values into a stream of arrays, of the length passed in
as the first parameter.  If a second parameter is given, then the next array starts
that many items after the last one.  Thus for the example stream in our test: 
`--5--5--9--|`, bufferCount(3,1)
results in the stream: `--[5,5,9]--[5,9]--[9]--`.  Then, we break that stream
up into the observable of observables, the first one having the first two
elements `--[5,5,9]--[5,9]--`, and the second one having the remainder `--[9]--`

Then, to score a substream (we call them frames), we pick off the first tripleet 
of that substream and check to see if its a spare.  If so, we add all three
elements, otherwise we add the first two, as we would for any open frame.

```typescript
export function scorer$(roll$) {
  const sumReducer = (acc, curr) => acc + curr;
  const frameScorer = frame =>
    frame.
      take(1).
      map(rolls =>
        rolls[0] + rolls[1] === 10 ?
          rolls.reduce(sumReducer) :
          rolls[0] + (rolls[1] || 0)
      );

  return roll$
    .bufferCount(3, 1)    // change rolls into triplets
    .windowCount(2)       // break frames into two-roll sets
    .mergeMap(frameScorer)// score each frame separately
    .scan(sumReducer);    // add the frames
}
```


## 10. One Completed Strike

For our next trick, we begin to handle strikes.  When a player knocks down
every pin on the first roll of a frame, he gets 10 pins plus the next two
rolls.  Our two roll lookahead will serve us well in scoring the frame.

So we add a new test to start.

scorer.spec.ts
```typecript
test("one completed strike", function(){
  testScorer([10, 1, 2], [13, 16]);
});
```

and revise the frameScorer to recognize a strike roll.


```typecript
const frameScorer = frame =>
  frame.
    take(1).
    map(rolls =>
      rolls.pins[0] === 10 || rolls.pins[0] + rolls.pins[1] === 10 ?
        rolls.pins.reduce(sumReducer) :
        rolls.pins[0] + (rolls.pins[1] || 0)
    );
```

But we are still <span style="color: red;">red</span>!  Instead of the 
desired --13--16--, we ended up with --13--15--.  Why?

The problem is that while we are still breaking up every frame into two
rolls using `windowCount(2)`, but strike frames take only one roll.  Thus,
our program took the strike frame from the rolls 10 and 1, and then the
second frame with the roll 2.  This requires a structural change, braking
frames into 1 or two rolls, depending on whether they are strikes or
non-strikes.  The `windowCount` operator doesn't cut it here.

But Rx has another operator that will suit us fine, after a bit of
preprocessing.  Consider the 

[`takeLast Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-groupBy)
<center><img src="http://reactivex.io/rxjs/img/groupBy.png" width="600px"></center>

`groupBy`, like `windowCount` breaks the stream up to a stream of substreams,
but runs a "key" function to determine how to break up the frames.  If we somehow
preprocess the stream of triplets into a stream of objects of the form:

{frame: <framenumber> rolls: <triplet>}

we can use `groupBy(x => x.frame)` will break the stream into substreams by frame. 

We begin by restructuring the sequence

```typescript
.bufferCount(3,1)
.windowCount(2)
```

as

```typescript
.bufferCount(3,1)
.scan(frameReducer, {frame: 0, isLastRoll: true}
.groupBy(roll => roll.frame, roll => roll.rolls)
```

and then write a frameReducer to break up frames the same manner as windowCount.
The second parameter removes the scaffolding to return to the original roll
triplets.

```typescript
const frameReducer = (acc, curr) =>
  ({
    frame: acc.lastRoll ? acc.frame+1 : acc.frame,
    lastRoll: !acc.lastRoll,
    rolls: curr    
  });
```

and with this structure, our old tests are all working, except for the strike
test, and now we can move forward to try to bring this <span style="color: red">red</span>.

## One Completed Strike II

To bring this red, we must change the frameReducer to properly handle strikes

```typescript
const frameReducer = (acc, curr) =>
  curr[0] === 10 ?
    { frame: acc.frame + 1, lastRoll: true, rolls: curr } :
    {
      frame: acc.lastRoll ? acc.frame+1 : acc.frame,
      lastRoll: !acc.lastRoll,
      rolls: curr
    }
```

And we are <span style="color: green">green</span>.  The gift of passing tests
is we can now refactor freely, to yield.

```typescript
import { Observable } from "rxjs";
export function scorer$(roll$) {
  const isStrike = triplet => triplet[0] === 10
  const isSpare = triplet => triplet[0] + triplet[1] === 10
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame
      .take(1)
      .map(x=> 
        isStrike(x) || isSpare(x) ?
          x.reduce(sumReducer) :
          x[0] + (x[1]||0)
      );

  const frameReducerInit = {frame: 0, lastRoll: true};
  const frameReducer = (acc, curr) =>
    isStrike(curr) ?
      { frame: acc.frame + 1, lastRoll: true, rolls: curr } :
      {
        frame: acc.lastRoll ? acc.frame+1 : acc.frame,
        lastRoll: !acc.lastRoll,
        rolls: curr
      }

  return roll$
    .bufferCount(3, 1)
    .scan(frameReducer, frameReducerInit)
    .groupBy(roll => roll.frame, roll=> roll.rolls)
    .mergeMap(frameScorer)
    .scan(sumReducer);
};

```

## Partial Mark Frames

By convention, we do not score partial strike or spare frames until they
are completed with their bonuses.  Let us test to see how this code works.

scorer.spec.ts
```typescript
  test("partial marks", function(){
    test("partial spare", function(){
      assertScorer$([5, 5], []);
    });

    test("partial strike", function(){
      assertScorer$([10], []);
      assertScorer$([10, 5], []);
      assertScorer$([10, 10], []);
    });
  })
```

This fails because we get "partial triplets" in most of these cases,
and don't track this.  We can accomplish this by mapping partial
triplets into full triplets ending in NaN, and then filtering the
resulting NaN's at the end.

scorer.ts
```typescripty
return roll$
  .bufferCount(3, 1)
  .map(trip => trip.concat(NaN, NaN, NaN).slice(0, 3))
  .scan(frameReducer, frameReducerInit)
  .groupBy(roll => roll.frame, roll=> roll.rolls)
  .mergeMap(frameScorer)
  .scan(sumReducer)
  .filter(x => !isNaN(x))
```

And we are <span style="color: green">green</span>!

## Completing the Scorer`

So just to make sure we have captured the edge cases, lets check out some
complete games.  We write tests:

scorer.spec.ts
```typecript
test("complete games", function() { 
  test("open frame games", function(){
    assertScorer$(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    );
    assertScorer$(
      [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
      [8, 16, 24, 32, 40, 48, 56, 64, 72, 80]
    );
  });
  test("spare game", function(){
    assertScorer$(
      [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
      [15, 30, 45, 60, 75, 90, 105, 120, 135, 150]
    );
  });
  test("perfect game", function(){
    assertScorer$(
      [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
      [30, 60, 90, 120, 150, 180, 210, 240, 270, 300]
    );
  })
})
```

And we discover that the spare game wraps over to an eleventh frame part score.
This can be handled using the `take(10)` operator at end, giving us a completed
scorer.

scorer.
```typescript
import { Observable } from "rxjs";
export function scorer$(roll$) {
  const isStrike = triplet => triplet[0] === 10
  const isSpare = triplet => triplet[0] + triplet[1] === 10
  const sumReducer = (acc, curr) => acc + curr;

  const frameScorer = frame =>
    frame
      .take(1)
      .map(x=> 
        isStrike(x) || isSpare(x) ?
          x.reduce(sumReducer) :
          x[0] + (x[1]||0)
      );

  const frameReducerInit = {frame: 0, lastRoll: true};
  const frameReducer = (acc, curr) =>
    isStrike(curr) ?
      { frame: acc.frame + 1, lastRoll: true, rolls: curr } :
      {
        frame: acc.lastRoll ? acc.frame+1 : acc.frame,
        lastRoll: !acc.lastRoll,
        rolls: curr
      }

  return roll$
    .bufferCount(3, 1)
    .map(trip => trip.concat(NaN, NaN, NaN).slice(0, 3))
    .scan(frameReducer, frameReducerInit)
    .groupBy(roll => roll.frame, roll=> roll.rolls)
    .mergeMap(frameScorer)
    .scan(sumReducer)
    .filter(x => !isNaN(x))
    .take(10)
};

```

# Developing the display$ Function

Given a source stream of rolls, we will want to display it on a traditional
bowling score sheet.  For the following stream of rolls:

```
--5--0--5--5--10--10--10--
```

we would expect to display as follows:

<center><img src="https://raw.githubusercontent.com/wizardwerdna/FRPBowlingKata/master/ScoreSheet.png" width="600px"></center>

For each frame except the last we would have two "slots" to show rolls.  For the
last frame, we would expect to have "slots."  A gutter ball (0 roll) will be displayed
as a hyphen, a roll making a spare (regardless of the initial roll) will be displyed
as a "/" and a roll making a strike will be displayed as a space and then an X. 

Thus, we will create a function, `display$` that will take an incoming stream and
return a singleton stream with a string for displaying the roll as described above.

We begin, by setting up for testing display$([]). We start by adding 

app.ts
```typescript
test(">>> FRP Bowling display$", display$Suite);
```

and writing code until we can compile, creating display.spec.ts and display.ts.
Then we add a single test for the empty game.

app.ts
```ypecript
import { testSuite, test, assertEqual } from "./testsuite.ts";
import { scorer$Suite } from "./scorer.spec.ts";
import { display$Suite  } from "./display.spec.ts";
console.clear();
test(">>> FRP Bowling Test Suite", testSuite);
test(">>> FRP Bowling scorer$", scorer$Suite);
test(">>> FRP Bowling display$", display$Suite);
```

## Display Empty Game

display.spec.ts
```typecript
import { test, assertEqual } from "./testSuite.ts";
import { display$ } from "./display.ts";
export function display$Suite() {
  test("display empty game", function(){
    display$([]).subscribe(
      x => assertEqual("", x) 
    );
  });
}
```

display.ts
```typescript
import { Observable } from "rxjs";
export function display$(roll$) {
  return Observable.of(undefined);
}
```
and now we are <span style="color: red">red</span> so we can write some code.

We begin with the slime

display.ts
```typescript
import { Observable } from "rxjs";
export function display$(roll$) {
  return Observable.of("");
}
```

and we are <span style="color: green">green</span>

## Display Gutter Ball

display.spec.ts
```typecript
test("display gutter ball", function(){
  display$([0]).subscribe(
    x => assertEqual("-", x) 
  );
});
```

display.ts
```typescript
export function display$(roll$) {
  return roll$
    .reduce((acc, curr) => '-', '');
}
```

and we are <span style="color: green">green</span>, so we can 
<span style="color: orange">refactor</span> our tests to remove
duplication of code:

display.spec.ts
```typescript
function assertDisplay$(roll$, expected) {
  display$(roll$).subscribe(
    x => assertEqual(expected, x) 
  );
}
export function display$Suite() {
  test("display empty game", function(){
    assertDisplay$([], "");
  });
  test("display gutter ball", function(){
    assertDisplay$([0], "-");
  });
}

```

## Display Two Gutter Balls

display.spec.ts
```typescript
test("display two gutter balls", function(){
  assertDisplay$([0, 0], "--");
})
```

which we resolve by catenating the result with the accumulator

display.ts
```typescript
return roll$
  .reduce((acc, curr) => acc + '-', '');
```

## Display a pin-drop

display.spec.ts
```typescript
test("display a pin-drop", function(){
  assertDisplay$([1], "1");
})
```

display.ts
```typescript
export function display$(roll$) {
  return roll$
    .reduce((acc, curr) =>
      curr === 0 ?
        acc + '-' :
        acc + curr.toString()
    , '');
}
```


## Display a Strike

display.spec.ts
```typescript
test("display a strike", function(){
  assertDisplay$([10], " X");
})
```

display.ts
```typescript
return roll$
  .reduce((acc, curr) =>
    curr === 0 ?
      acc + '-' :
    curr === 10 ?
      acc + ' X' :
      acc + curr.toString()
  , '');
```

## Display a Spare


display.spec.ts
```typescript
test("display a spare", function(){
  assertDisplay$([6, 4], "6, 4")
});
```

Up until now, the development has been straightforward TDD.  Now we must
add some state to keep track of whether a roll is the first or second roll
of a frame and distinguish spares `--0--10--`, which should yield "-/"
from strikes and spares `--10--0--10--`, which should yield " X-/"

For this test, we cheat:

display.ts
```typescript
return roll$
  .reduce((acc, curr) =>
    curr === 0 ?
      acc + '-' :
    curr === 10 ?
      acc + ' X' :
    curr === 4  ? // mock spare
      acc + '/' :
      acc + curr.toString()
  , '');
```

## Display a Spare II

display.spec.ts
```typescript
test("display a spare", function(){
  assertDisplay$([6, 4], "6/");
  assertDisplay$([7, 3], "7/");
});
```

Forcing us to generalize:

display.ts
```typescript
export function display$(roll$) {
  return roll$
    .reduce((acc: any, curr) =>
      curr === 0 ?
        {acc: acc.acc + '-' }:
      curr === 10 ?
        {acc: acc.acc + ' X' } :
      curr === 4 ?
        {acc: acc.acc + '/' } :
        {acc: acc.acc + curr.toString() }
    , {acc: ''})
    .map(state => state.acc);
```

And now we add some state to distirguitsh strikes from spares

display.ts
```typescript
export function display$(roll$) {
  return roll$
    .reduce((acc: any, curr) =>
      curr === 0 ?
        {acc: acc.acc + '-', lastRoll: isNaN(acc.lastRoll) ? curr : NaN }:
      curr === 10 ?
        {acc: acc.acc + ' X', lastRoll: NaN } :
      acc.lastRoll + curr === 10 ?
        {acc: acc.acc + '/', lastRoll: isNaN(acc.lastRoll) ? curr : NaN } :
        {acc: acc.acc + curr.toString(), lastRoll: isNaN(acc.lastRoll) ? curr : NaN }
    , {acc: '', lastRoll: NaN})
    .map(state => state.acc);
}
```

display.spec.ts
```typescript
test("display a spare", function(){
  assertDisplay$([6, 4], "6/");
  assertDisplay$([7, 3], "7/");
  assertDisplay$([0, 103], "-/");
});
```

display.ts
```typescript
  return roll$
    .reduce((acc: any, curr) =>
      curr === 0 ?
        {acc: acc.acc + '-', lastRoll: isNaN(acc.lastRoll) ? curr : NaN }:
      acc.lastRoll + curr === 10 ?
        {acc: acc.acc + '/', lastRoll: isNaN(acc.lastRoll) ? curr : NaN } :
      curr === 10 ?
        {acc: acc.acc + ' X', lastRoll: NaN } :
        {acc: acc.acc + curr.toString(), lastRoll: isNaN(acc.lastRoll) ? curr : NaN }
    , {acc: '', lastRoll: NaN})
    .map(state => state.acc);
}
```

display.spec.ts
```typescript
test("open frame games", function(){
  assertDisplay$(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "--------------------"
  );
  assertDisplay$(
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    "44444444444444444444"
  );
});
test("spare game", function(){
  assertDisplay$(
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    "5/5/5/5/5/5/5/5/5/5/5"
  );
});
test("perfect game", function(){
  assertDisplay$(
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    " X X X X X X X X XXXX"
  );
})
```

display.ts
```typescript
export function display$(roll$) {
  return roll$
    .reduce((acc: any, curr) =>
      curr === 0 ?
        {acc: acc.acc + '-', lastRoll: isNaN(acc.lastRoll) ? curr : NaN }:
      acc.lastRoll + curr === 10 ?
        {acc: acc.acc + '/', lastRoll: isNaN(acc.lastRoll) ? curr : NaN } :
      curr === 10 ?
        {acc: acc.acc + (acc.acc.length>17 ? '' : ' ') + 'X', lastRoll: NaN } :
        {acc: acc.acc + curr.toString(), lastRoll: isNaN(acc.lastRoll) ? curr : NaN }
    , {acc: '', lastRoll: NaN})
    .map(state => state.acc);
}
```

And we are <span style="color: green">green</span>!  Now, at last, we
<span style="color: orange">refactor</span> for our complete displayer
function.

display.spec.ts
```typescript
export function display$(roll$) {

  const nextLastRoll = (acc, curr) =>
    isNaN(acc.lastRoll) ? curr : NaN;

  const nextState = (nxt, acc, curr) =>
    ({acc: acc.acc + nxt, lastRoll: nextLastRoll(acc, curr)});

  const tenthStrikeSpace = (acc) => acc.acc.length>17 ? '' : ' ';

  const isSpare = (acc, curr) => acc.lastRoll + curr === 10 ;

  const displayReducerInit = {acc: '', lastRoll: NaN}
  const displayReducer = (acc, curr) =>
    isSpare(acc, curr) ?
      nextState('/', acc, curr) :
    curr === 0 ?
      nextState('-', acc, curr):
    curr === 10 ?
      {acc: acc.acc + tenthStrikeSpace(acc)  + 'X', lastRoll: NaN } :
      nextState(curr.toString(), acc, curr)

  return roll$
    .reduce(displayReducer, displayReducerInit)
    .map(state => state.acc);
}
```
