
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

bash
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

bash
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
