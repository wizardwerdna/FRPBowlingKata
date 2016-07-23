# FRP Bowling Kata

In this kata, we will build out and implement a program for
an interactive bowling scoring program using Functional Responsive Programming,
with RxJS and CycleJS technologies.  Using
Test-First disciplines, we will build these applications from scratch,
starting with an empty file. The Kata will be
built with a testing suite that displays its results
in the browser console.

I hope these katas may inspire you to
adopt these terrific agile practices to change the world with your own
examples and craftsmanship.


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
| [05 - CycleJS Static DOM Display](https://www.youtube.com/watch?v=zc6TyL5TK2g) | TDD development of the view for a bowling line  component of a CycleJS Application |

The key functional parts built with corresponding unit tests are:

| name | description |
| --- | --- |
| scorer$ | transforms a stream of rolls into a stream of frame scores |
| displayer$ | transforms a stream of rolls into a string (as a singleton stream), in which gutter balls are shown as "-", spares are shown as "/" and strikes are shown as " X" (or just "X" for the tenth frame). |
| enabled | a function that returns a value representing the maximum button to be enabled |

## What is a Code Kata?

A Kata is a stylized solution to a small-ish and well-defined problem, meant
to illustrate key development techniques. I will perform each kata for you
in a screencast and in written materials summarizing the development.
Then it is your turn.  Based on what you read and saw, perform the kata yourself
until you have assimilated the techniques for its solution.

Correct performance has nothing to do with mimicking what I show you,
but by finding your own chops and improving on the craft.
We repeat katas to better comprehend the practices and to build mental
"muscle memory" so that skills flow quickly from your mind, as though you
were touch typing the ideas themselves. They should take your breath
away, as can a Mozart aria.

My name is Andrew Greenberg, and I would be grateful for your comments
and suggestions as you work through these forms. You can find me by
e-mail at wizardwerdna@gmail.com, or at @wizardwerdna on twitter. Now,
let's get this kata started.

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

# Building the CycleJS Application From the building Blocks

1.  Build the `scorer$`, `displayer$` and `enabler` modules.
1.  Building the `run` function.
1.  Building the `main` function using the reducer pattern.
    1. Building the "dumb" DOM Return
    1. Connect DOM.sources to actions$
    1. Connect actions$ to build a state model$
    1. Connect the "dumb" DOM Return with the model data
1.  Implement Undo/Redo functionality
1.  Making and using a BowlingLine Component
1.  Building a UI to create a multi-line application.
1.  Building the Delete line functionality.
    1. In component
        1. add key to vtree from props.id
        1. add delete buttons to each component
        1. add DELETE actions
        1. return a Delete stream
    1. In top level
        1. in model, pull a merged stream of individual Delete streams
        1. in index, create a proxy to receive individual pulls
        1. after model, push the erged stream  to proxy
        1. in intent, respond to received Delete ctions with DELETEPLAYER
        1. add DELETEPLAYER actions and reducer to model, deleting lines

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

and we are <span style="color: red">red</span>!  So we can at last write some
code.  The test requires the function to return an empty Observable, so the
easiest way to accomplish this is simply to return that constant.  We call this
use of a constant in testing a "slime."  The advantage is that it makes no
commitment how that value is computed, its just the value itself.  Of course
more tests will force us to take this specific constraint and generalize it.  As
"Uncle Bob" Martin wrote

```text
As the tests get more specific, the code gets more generic.
```

So we write the most specific code we can imagine, and replace the return
statement with:


```typescript
return Observable.empty();
```

and we are <span style="color: green">green</span>!

### Gutter Ball
```typescript
test('gutter', testScore('-0|', '-0|'));
```

and we are <span style="color: red">red</span>!  Examining these two test
side-by-side, we notice that each test responds with its input alone.  Thus,
this test can be satisfied simply by returning its input.

```typescrtipt
return roll$
```

and we are <span style="color: green">green</span>!


### Open Frame I
```typescript
test('open', testScore('-0-0|', '-0|'));
```

and we are <span style="color: red">red</span>!  This test does not allow our
last solution to work any longer, because it returns two, and not one 0.  But
RxJS has an operation that will help us by simply selecting the first value
of the input stream, or the empty stream in the case of an empty stream.

Ok, bear with me.  I realize this is a stupid, dumb-as-dirt, way to solve
the two gutter rolls from single gutter rolls.  But our tests say the result
is the same for both of them.  So our new test fails by copying the [0,0].
It turns out there is a five-character way to do this, so we do this, using
the [`take Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-take)
which simple takes the first element of the two cases, or empty, if there are no
elements.
<center><img src="http://reactivex.io/rxjs/img/take.png" width="600px"></center>

```typescrtipt
return roll$.take(1)
```

and we are <span style="color: green">green</span>!


### Open Frame II

So, in response to our solution, the test writing person writes a test that
trivially avoids our gambit, focusing on the last element, and not the first:


```typescript
test('open', testScore('-0-1|', '-1|'));
```

and we are <span style="color: red">red</span>.   That said, there is a
trivial solution that solves the problem.  Yes, I know we could write deeper
code, but this is the simplest thing that works for our tests.  We simply replace
the `take` operator with one that focuses on the last element:

`Rxjs` has a
[`takeLast Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-takeLast)
<center><img src="http://reactivex.io/rxjs/img/takeLast.png" width="600px"></center>

and we code:

```typescrtipt
return roll$.takeLast(1)
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Open Frame III
OK, finally, our test-writer self changes the test slightly in a way that makes
trivial solutions far more difficult to write.

```typescript
test('open', testScore('-1-1|', '-2|'));
```

and we are <span style="color: red">red</span>!  Clearly, the solution is to
simply add up the numbers.  RxJS has an operator for that: the
[`reduce Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-reduce).
<center><img src="http://reactivex.io/rxjs/img/reduce.png" width="600px"></center>

This operator will be familiar with anyone who has used the corresponding `reduce`
function with Javascript arrays.  We code:

```typescript
return roll$.reduce((acc, curr) => acc + curr);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

```typescript
const sum = (acc, curr) => acc + curr;
return roll$.reduce(sum);
```

### Two Open Frames I

For our next test, we write code handling more than one frame:

```typescript
test('two open', testScore('-0-0-1-1|', '-0-2|'));
```

which fails because our existing code only returns a single number.  We are <span style="color: red">red</span>!


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
We now write:


```typescript
const frameScorer = frame => frame.reduce(sum);
return roll$
  .windowCount(2)
  .mergeMap(frameScorer);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!


### Two Open Frames II

But our code still isn't satisfactory, because it doesn't return a running sum
of frame scores (because the previous example had a first frame score of zero).
We work around this with the following test, to force a generalization.

```typescript
test('two open', testScore('-1-1-2-2|', '-2-6|'));
```

and we are <span style="color: red">red</span>!

We now add a new operator that handles this.  `reduce` would not suffice,
because it returns a single result, the sum of all the elements in the
stream.  Rxjs has yet another useful result: [the `scan Operator`](
http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan).
<center><img src="http://reactivex.io/rxjs/img/scan.png" width="600px"></center>

Scan performs the acccumulation as does reduce, but emits the result of the process with an element for each time.  So we just add a scan to the end

```typescript
return roll$
  .windowCount(2)
  .mergeMap(frameScorer);
  .scan(sum);
```

and we are <span style="color: green">green</span>!  And so its time to move
on to a different subject: the spare!


### Spare I

In American ten pins, a spare scores a spare frame as 10 pins plus the pins
for the next roll.  Thus:

```typescript
test('spare', testScore('-5-5-5|', '-15-20|'));
```

and we are <span style="color: red">red</span>!  Se we solve this by generalizing
the frameScorer:


```typescript
const frameScorer = frame =>
  frame.reduce((acc, curr) =>
    acc + curr === 10 ?
      acc + curr + 5 :
      acc + curr
  );
```

and we are <span style="color: green">green</span>.  Now, yes, I know we used
the 5 bonus as a slime, but this solution is helpful because it gives us the
shape of our next generalization, which will be forced by our next test.

### Spare II

```typescript
test('spare', testScore('-5-5-9|', '-19-28|'));
```

and we are <span style="color: red">red</span>!  Here is our problem, the
windowCount solution does not let us look at rolls beyond the two roll frame.
So we need to gather and use that information somehow.  RxJS has a solution for
that, the `bufferCount`.

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

Then, to score a substream (we call them frames), we pick off the first triplet
of that substream and check to see if its a spare.  If so, we add all three
elements, otherwise we add the first two, as we would for any open frame.

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

and we are <span style="color: green">green</span>!  Time to solve the strike!

### Strike

A strike is scored differently from the spare, in that the strike frame gets
ten pins plus the next *two* rolls, instead of just one.  We write:

```typescript
test('strike', testScore('-10-1-2|', '-13-16|'));
```

and we are <span style="color: red">red</span>! This fails in two regards, getting
both scores wrong.  The first frame is scored as an 11, and the second frame adds
two, and not 3 pins.  We solve the first issue first, which requires only a
minor adjustment to the framescorer to add up the three pins for strikes as
well as spares,

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

which solves part of the problem, not outputting 13 for the first frame,
 but doesn't solve the miscounting of the second one.

The problem is that while we are still breaking up every frame into two
rolls using `windowCount(2)`, but strike frames take only one roll.  Thus,
our program took the strike frame from the rolls 10 and 1, and then the
second frame with the roll 2.  This requires a structural change, braking
frames into 1 or two rolls, depending on whether they are strikes or
non-strikes.  The `windowCount` operator doesn't cut it here.

But Rx has another operator that will suit us fine, after a bit of
preprocessing.  Consider the

[`groupBy`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-groupBy) operator.
<center><img src="http://reactivex.io/rxjs/img/groupBy.png" width="600px"></center>

`groupBy`, like `windowCount` breaks the stream up to a stream of substreams,
but runs a "key" function to determine how to break up the frames.  If we somehow
preprocess the stream of triplets into a stream of objects of the form:

{frame: <framenumber> pins: <triplet>}

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
.groupBy(roll => roll.frame, roll => roll.pins)
```

and then write a frameReducer to break up frames the same manner as windowCount.
The second parameter removes the scaffolding to return to the original roll
triplets.

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

We are not scoring every type of frame correctly.  In particular, when a frame
has a mark like a strike or a spare, by convention, we do not score the frame
until the bowler has rolled all of the bonus pins.  We write a test to prove
this:

```typescript
test('partial spare', testScore('-5-5|', '-|'));
```

and we are <span style="color: red">red</span>!  This happens because bufferCount
does not always produce arrays having three elements, and this makes reduces
err quietly.  To fix this, we map all the responses from bufferCount to have
three elements, expanding short arrays with `NaN` elements, so that the sum
reduce results in NaN for the frame score.  Then we filter out the NaNs.


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

There is one last problem to solve before we can move on to the displayer: the
spare game scores the last dangling 5 as a partial open and eleventh frame,
as shown by this test:

```typescript
test('spare game', testScore(
  '-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5-5|',
  '-15-30-45-60-75-90-105-120-135-150|'
));
```

and we are <span style="color: red">red</span>!  We solve this simply
by limiting the number of frames we return, using the `take` operator.

```typescript
return roll$
  ...
  .take(10);
```

and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!  This yields a rather pretty piece of code that looks like
it was designed by first and coded top-down.  Agreed it is pretty.  What do you
think?

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
    .take(10)
}

```

## Development of the `displayer$`

The `displayer$` takes the same stream of rolls as the `scorer$` and returns
a singleton stream containing a string that would be displayed in the rolls
display line of the game display.  Gutter balls are displayed as '-', not a
0.  Strikes are display as a space followed by an X, except for the tenth
frame, and all other rolls are displayed either as the number of pins if an
open frame or first roll, and as a '/' if its a successful spare attempt.

We begin, as before, with a test for the empty game, which yields an empty
string.

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
and we are <span style="color: red">nred</span>!
```typescript
function displayer$(roll$) {
  return Observer.of('');
}
```
and we are <span style="color: green">green</span>!

### One Gutter Ball
```javascript
test('gutter', testDisplay('-0|', '-'));
```
and we are <span style="color: red">red</span>! We need to return different results
depending upon whether or not roll$ is empty.  It turns out there is an operator
that can handle this case.  `Rxjs` has a
[`defaultIfEmpty Operator`](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-defaultIfEmpty)
<center><img src="http://reactivex.io/rxjs/img/defaultIfEmpty.png" width="600px"></center>

```typescript
return roll$
  .mapTo('-')
  .defaultIfEmpty('')
```
and we are <span style="color: green">green</span>!

### One Strike
```javascript
test('strike', testDisplay('-10|', ' X'));
```
and we are <span style="color: red">red</span>!
```typescript
roll$
  .map(pins =>
    pins === 10 ?
      ' X' :
    '-'
  )
  .defaultIfEmpty('');
```
and we are <span style="color: green">green</span>!

### One Non-gutter, Non-strike Roll I
```javascript
test('other', testDisplay('-1|', '1'));
```
and we are <span style="color: red">red</span>!  So we resolve this by adding
another case, and then defaulting non-empty streams to '1', which is a slime.
```typescript
roll$
  .map(pins =>
    pins === 10 ?
      ' X' :
    pins === 0 ?
      '-' :
    '1'
  )
  .defaultIfEmpty('');
```
and we are <span style="color: green">green</span>!  We add another test forcing
us to generalize the slime.

### One Non-gutter, Non-strike Roll II
```javascript
  test('other', testDisplay('-9|', '9'));
```
and we are <span style="color: red">red</span>!  Of course, we could add a `pins === 1 ?`
case, and on and on for the rest of the pincounts, but there is a much shorter
generalization that works, and that is precisely when we do generalize -- when it is
more painful to do things case-by-case.  As tests get more specific, the code gets
more generic.
```typescript
roll$
  .map(pins =>
    pins === 10 ?
      ' X' :
    pins === 0 ?
      '-' :
    pins.toString();
  )
  .defaultIfEmpty('');
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

```typescript

const displayOneRoll = (pins) =>
  pins === 10 ?
    ' X' :
  pins === 0 ?
    '-' :
  pins.toString();

roll$
  .map(displayOneRoll)
  .defaultIfEmpty('');
```

### Two Rolls
```javascript
test('two rolls', testDisplay('-0-9|', '-9'));
```
and we are <span style="color: red">red</span>!  So we must generalize in the
single roll case, and reduce screams out as the alternative.
```typescript
const displayOneRoll = (pins) =>
  pins === 10 ?
    ' X' :
  pins === 0 ?
    '-' :
  pins.toString();

roll$
  .reduce((display, roll) => display + displayOneRoll(roll), '')
  .defaultIfEmpty('');
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>! Because
the reduce handles the empty case effetively, we cand delete the call to `defaultIfEmpty`.

```typescript
const isStrike = pins => pins === 10;
const isGutter = pins => pins === 0;
const displayOneRoll = (pins) =>
  isStrike(pins) ?
    ' X' :
  isGutter(pins) ?
    '-' :
  pins.toString();

const addPinToDisplay = (display, pins) => display + displayOneRoll(pins);

roll$.display(addPinToDisplay, '');
```

### One Spare
```javascript
test('spare', testDisplay('-0-10|', '-/'));
test('spare', testDisplay('-5-5|', '5/'));
```
and we are <span style="color: red">red</span>!  To determine whether a roll yield
a strike or a spare attempt, we will need the information from display in the
displayOneRoll code.  Basically, its a spare if its a spare attempt and the
roll plus the pins from the last roll add to 10.  We begin with the obvious
efforts, noting that the case `-0-10|` should result in `-/`:
```typescript
...
const displayOneRoll = (display, pins) =>

  display.length > 0 &&
    pins + (parseInt(display[display.length - 1]) || 0)  === 10  ?
    '/' :
  isStrike(pins) ?
    ' X' :
  isGutter(pins) ?
    '-' :
  pins.toString();

const addPinToDisplay = (display, pins) => display + displayOneRoll(display, pins);
...
```
and we are <span style="color: green">green</span>, then we <span style="color: orange">refactor</span>!

```typescript
...
const lastRoll = display => parseInt(display[display.length - 1]) || 0;
const isSpareAttempt = (display, pins) => display.length > 0
const isSpare = (display, pins) =>
  isSpareAttempt(display, pins) && pins + lastRoll(display, pins) === 10;

const displayOneRoll = (display, pins) =>
  isSpare(display, pins) ?
    '/' :
  isStrike(pins) ?
    ' X' :
  isGutter(pins) ?
    '-' :
  pins.toString();

const addPinToDisplay = (display, pins) => display + displayOneRoll(display, pins);
...
```

Now this is the structure we will end up with.  Really, the rest of our tests
provide details for isSpareAttempt and how to handle isStrike in the tenth frame.
I will leave the roll-by-roll development as an exercise, I will provide the tests
and we end up with the following refactored version.  Note in particular the
development of `isSpareAttempt` and the introduction of `spaceUnlessTenth`.

### Two Frame Spare and Tenth Frame Tests
```javascript
  test('two spares', testDisplay('-5-10-0-5|', '5/-/'))
  test('tenth frame', function() {
    const preRolls = '-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0';
    const preDisplay = '------------------';
    test('spare', testDisplay(preRolls + '-0-10|', preDisplay + '-/'));
    test('spare/non', testDisplay(preRolls + '-0-10-0|', preDisplay + '-/-'));
    test('spare/strike', testDisplay(preRolls + '-0-10-10|', preDisplay + '-/X'));
    test('strike', testDisplay(preRolls + '-10|', preDisplay + 'X'));
    test('strike/non', testDisplay(preRolls + '-10-0|', preDisplay + 'X-'));
    test('strike/open', testDisplay(preRolls + '-10-0-0|', preDisplay + 'X--'));
    test('strike/spare', testDisplay(preRolls + '-10-0-10|', preDisplay + 'X-/'));
    test('double', testDisplay(preRolls + '-10-10|', preDisplay + 'XX'));
    test('turkey', testDisplay(preRolls + '-10-10-10|', preDisplay + 'XXX'));
  });
```
and we are <span style="color: red">red</span>!

```typescript
function displayer$(pins$) {

  const lastRoll = (display, pins) => parseInt(display[display.length - 1]) || 0;
  const isDoubleAttempt = (display, pins) =>
    display.length === 19 && display[18] === 'X';
  const isStrikeSpareAttempt = (display, pins) =>
    display.length === 20 && display[18] === 'X' && display[19] !== 'X';
  const isOddRoll = (display, pins) => display.length % 2 === 1;
  const isSpareAttempt = (display, pins) =>
    (isOddRoll(display, pins) && !isDoubleAttempt(display, pins)) ||
      isStrikeSpareAttempt(display, pins);
  const isSpare = (display, pins) =>
    isSpareAttempt(display, pins) && pins + lastRoll(display, pins) === 10;
  const isGutter = (display, pins) => pins === 0;
  const isStrike = (display, pins) => pins === 10;
  const spaceUnlessTenth = (display) => display.length >= 18 ? '' : ' ';

  const displayOneRoll = (display, pins) =>
    isSpare(display, pins) ?
      '/' :
    isGutter(display, pins) ?
      '-' :
    isStrike(display, pins) ?
      spaceUnlessTenth(display) + 'X' :
    pins.toString();

  const addPinsToDisplay = (display, pins) =>
    display + displayOneRoll(display, pins);

  return pins$.reduce(addPinsToDisplay);
}
```
and we are <span style="color: green">green</span>!

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
