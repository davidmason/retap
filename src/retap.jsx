import Test from 'tape/lib/test'
import tape from 'tape'
import defined from 'defined'
import _, { any, isArray, isEmpty, isUndefined, startsWith, zip } from 'lodash'
import has from 'has'
import path from 'path'
import find from 'find-filename'
import { ctx } from './print'
import createComponent from 'react-unit'

/**
 * Extend tape with comparisons for React component trees
 */

/* Directories of test harness scripts, to skip over when finding location
 * of failed assertion. Must be defined here since extending tape changes
 * its reported __dirname to the extending module.
 */
var harnessDirs = [
  // src and lib are used instead of this module's root so that lines in the
  // scripts in ./test will be reported rather than skipped (otherwise I could
  // not test that lines are properly identified).
  path.dirname(__dirname) + '/src/',
  path.dirname(__dirname) + '/lib/',
  // tape performs checks internally so should be skipped.
  path.dirname(find(tape)) + '/',
  // lodash utility methods can execute callbacks from here, prevent them
  // being used as the code location
  path.dirname(find(_)) + '/'
]



// FIXME plain JSX does not have type 'function' even before render, so
//       some better way is needed to tell
// function rendered (jsx) {
//   // type is function until render
//   return typeof jsx.type !== 'function'
// }

Test.prototype.createComponent = createComponent

function eitherDefined(a, b) {
  return !isUndefined(a) || !isUndefined(b)
}

/**
 * Check that elements, classes and inline styles are as expected.
 *
 * Ignores all other attributes and properties.
 */
Test.prototype.isSameMarkup = function isSameMarkup (actual, expected) {
  const harness = this

  const actualRender = //rendered(actual) ? actual :
    createComponent(actual)
  const expectedRender = //rendered(expected) ? expected :
    createComponent(expected)

  compare(actualRender, expectedRender)

  // TODO separate traversal from checks
  //      (not with async though, need intact stack)
  // TODO split checks into separate functions
  function compare (actual, expected, context = []) {
    // treat empty string the same as undefined
    const haveActual = !isUndefined(actual) &&
      (typeof actual !== 'string' || actual.length)
    const haveExpected = !isUndefined(expected) &&
      (typeof expected !== 'string' || expected.length)

    if (!haveActual && !haveExpected) {
      return
    }

    if (!haveExpected) {
      harness._assert(false, {
        message: `should have no more elements at ${ctx(context)}`,
        operator: 'isSameMarkup',
        actual: actual.type,
        expected: undefined
      })
      return
    }
    // context is based on expected structure
    const localContext = context.concat(expected.type)

    if (!haveActual) {
      harness._assert(false, {
        message: `should have more elements at ${ctx(localContext)}`,
        operator: 'isSameMarkup',
        actual: undefined,
        expected: expected.type
      })
      return
    }

    harness.equal(actual.type, expected.type,
      `should have same element type at ${ctx(localContext)}`)

    // if types are the same, check type-specific attributes
    if (actual.type === expected.type) {
      switch (expected.type) {
        case 'img':
          let actualSrc = prop(actual, 'src')
          let expectedSrc = prop(expected, 'src')
          if (eitherDefined(actualSrc, expectedSrc)) {
            harness.equal(actualSrc, expectedSrc,
              `should have same src in <img> tag at ${ctx(localContext)}`)
          }
          break
        case 'a':
          let actualHref = prop(actual, 'href')
          let expectedHref = prop(expected, 'href')
          if (eitherDefined(actualHref, expectedHref)) {
            harness.equal(actualHref, expectedHref,
              `should have same href in <a> tag at ${ctx(localContext)}`)
          }
          break
        case 'label':
          let actualFor = prop(actual, 'htmlFor')
          let expectedFor = prop(expected, 'htmlFor')
          if (eitherDefined(actualFor, expectedFor)) {
            harness.equal(actualFor, expectedFor,
              `label should be for the same id at ${ctx(localContext)}`)
          }
          break
        case 'input':
          for (let propName of ['type', 'value', 'defaultValue']) {
            let actualProp = prop(actual, propName)
            let expectedProp = prop(expected, propName)
            if (eitherDefined(actualProp, expectedProp)) {
              harness.equal(actualProp, expectedProp,
                `input should have same ${propName} at ${ctx(localContext)}`)
            }
          }

          // TODO switch on prop.type (checkbox, radio, etc.)


          // value and defaultValue do not appear to work for textarea
        // case 'textarea':
        //   harness.comment(Object.getOwnPropertyNames(actual.props).join(' '))
        //   for (let propName of ['defaultValue', 'value']) {
        //     // getting `null` values here, tripping up stuff
        //     let actualProp = prop(actual, propName)
        //     let expectedProp = prop(expected, propName)
        //     if (eitherDefined(actualProp, expectedProp)) {
        //       harness.comment(`${propName} ${actualProp} ${expectedProp}`)
        //       harness.equal(actualProp, expectedProp,
        //         `textarea should have same ${propName} at ${ctx(localContext)}`)
        //     }
        //   }
          break
      }
    }

    if (eitherDefined(className(actual), className(expected))) {
      harness.isSameClasses(className(actual), className(expected),
        localContext)
    }
    if (eitherDefined(style(actual), style(expected))) {
      harness.deepEqual(style(actual), style(expected),
        `should have same styles at ${ctx(localContext)}`)
    }
    if (eitherDefined(title(actual), title(expected))) {
      harness.equal(title(actual), title(expected),
        `should have same title at ${ctx(localContext)}`)
    }
    if (eitherDefined(innerHTML(actual), innerHTML(expected))) {
      harness.equal(innerHTML(actual).__html, innerHTML(expected).__html,
        `should dangerously set same inner html at ${ctx(localContext)}`)
    }

    // FIXME .text and .texts both give combined text from elements
    //       but I want to treat the immediate child text similar to
    //       other children and just compare it

    const actualChildren = isArray(children(actual))
      ? children(actual) : [children(actual)]
    const expectedChildren = isArray(children(expected))
      ? children(expected) : [children(expected)]


    let index = 0
    for (let [actual, expected] of zip(actualChildren, expectedChildren)) {
      compare(actual, expected, localContext.concat(index))
      index++
    }

    // check text after children so that more specific text differences are
    // shown first
    const textDiff = arrayCompare(expected.texts, actual.texts)
    harness._assert(!textDiff.missing.length, {
      message: `should have all expected text at path ${ctx(localContext)}`,
      operator: 'isSameMarkup',
      actual: [],
      expected: textDiff.missing
    })
    harness._assert(!textDiff.added.length, {
      message: `should have only expected text at path ${ctx(localContext)}`,
      operator: 'isSameMarkup',
      actual: textDiff.added,
      expected: []
    })
  }
}

Test.prototype.isSameClasses = function (actual, expected, context) {
  const actualClasses = isEmpty(actual) ? [] : actual.split(/\s+/g)
  const expectedClasses = isEmpty(expected) ? [] : expected.split(/\s+/g)

  const diff = arrayCompare(expectedClasses, actualClasses)

  // TODO could add array missing and added functions to prototype
  //      and call with custom message instead
  //      or array difference function

  // TODO maybe provide the full list of classes
  this._assert(!diff.missing.length, {
    message: `should have all expected classNames at path ${ctx(context)}`,
    operator: 'isSameClasses',
    actual: [],
    expected: diff.missing
  })

  // TODO maybe provide the full list of classes
  this._assert(!diff.added.length, {
    message: `should have only expected classNames at path ${ctx(context)}`,
    operator: 'isSameClasses',
    actual: diff.added,
    expected: []
  })
}

function prop(item, propName) {
  return item.props ? item.props[propName] : undefined
}

function className (item) {
  return prop(item, 'className')
}

function style (item) {
  return prop(item, 'style')
}

function children (item) {
  return prop(item, 'children')
}

function title (item) {
  return prop(item, 'title')
}

function innerHTML (item) {
  return prop(item, 'dangerouslySetInnerHTML')
}

function htmlFor (item) {
  return prop(item, 'htmlFor')
}

function arrayCompare (actual, expected) {
  return {
    missing: without(actual, expected),
    added: without(expected, actual)
  }
}

function without (array, values) {
  return _.without.apply(_, [array].concat(values))
}

/**
 * Copied from tape to modify how the reported test location is determined.
 *
 * tape uses the first stacktrace line that is not for a file in the tape
 * directory, but this version will also skip lines for files in the retap
 * directory.
 */
Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};

    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator)
    };
    if (has(opts, 'actual') || has(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has(opts, 'expected') || has(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);

    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }

    if (!ok) {
        var e = new Error('exception');
        var err = (e.stack || '').split('\n');

        for (var i = 0; i < err.length; i++) {
            var m = /^[^\s]*\s*\bat\s+(.+)/.exec(err[i]);
            if (!m) {
                continue;
            }

            var s = m[1].split(/\s+/);
            var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
            if (!filem) {
                filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[2]);

                if (!filem) {
                    filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);

                    if (!filem) {
                        continue;
                    }
                }
            }

            if (any(harnessDirs, dir => startsWith(filem[1], dir))) {
              continue;
            }

            res.functionName = s[0];
            res.file = filem[1];
            res.line = Number(filem[2]);
            if (filem[3]) res.column = filem[3];

            res.at = m[1];
            break;
        }
    }

    self.emit('result', res);

    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }

    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self._plan - pendingAsserts
        });
    }
};



export default tape
