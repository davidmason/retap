import Test from 'tape/lib/test'
import tape from 'tape'
import defined from 'defined'
import _, { isArray, isEmpty, isUndefined, zipWith } from 'lodash'

import { ctx } from './print'

import createComponent from 'react-unit'

/**
 * Extend tape with comparisons for React component trees
 */

// FIXME plain JSX does not have type 'function' even before render, so
//       some better way is needed to tell
// function rendered (jsx) {
//   // type is function until render
//   return typeof jsx.type !== 'function'
// }

Test.prototype.createComponent = createComponent

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

  // harness.equal(expectedRender, {}, 'just for debug')

  compare(actualRender, expectedRender)

  function compare (actual, expected, context = []) {
    if (isUndefined(actual) && isUndefined(expected)) {
      return
    }

    if (isUndefined(expected)) {
      harness._assert(false, {
        message: `expected no more elements at ${ctx(context)}`,
        operator: 'isSameMarkup',
        actual: '<' + actual.type + '>',
        expected: undefined
      })
      return
    }
    // context is based on expected structure
    const localContext = context.concat(expected.type)

    if (isUndefined(actual)) {
      harness._assert(false, {
        message: `expected to find more elements at ${ctx(localContext)}`,
        operator: 'isSameMarkup',
        actual: undefined,
        expected: expected // '<' + expected.type + '>'
      })
      return
    }

    harness.equal(actual.type, expected.type,
      `wrong element type at ${ctx(localContext)}`)

    harness.isSameClasses(className(actual), className(expected), localContext)

    // TODO compare styles without order

    harness.deepEqual(style(actual), style(expected),
      `should have same styles at ${ctx(localContext)}`)

    // FIXME .text and .texts both give combined text from elements
    //       but I want to treat the immediate child text similar to
    //       other children and just compare it

    // TODO handle one children not defined
    //      or is a string

    const actualChildren = isArray(children(actual))
      ? children(actual) : [children(actual)]
    const expectedChildren = isArray(children(expected))
      ? children(expected) : [children(expected)]


    // zipWith does not give the position within the array pairs
    // so I track it manually
    let index = 0
    // not entirely comfortable using zipWith just for side effects
    // but it is the best fit I have found so far
    zipWith(actualChildren, expectedChildren, (actual, expected) => {
        compare(actual, expected, localContext.concat(index))
        index++
      }
    )

    const textDiff = arrayCompare(expected.texts, actual.texts)
    harness._assert(!textDiff.missing.length, {
      message: `Missing expected text at path ${ctx(localContext)}`,
      operator: 'isSameMarkup',
      actual: [],
      expected: textDiff.missing
    })
    harness._assert(!textDiff.added.length, {
      message: `Found unexpected text at path ${ctx(localContext)}`,
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

  // TODO maybe provide the full list of classes
  this._assert(!diff.missing.length, {
    message: `Missing expected classNames at path ${ctx(context)}`,
    operator: 'isSameClasses',
    actual: [],
    expected: diff.missing
  })

  // TODO maybe provide the full list of classes
  this._assert(!diff.added.length, {
    message: `Found unexpected classNames at path ${ctx(context)}`,
    operator: 'isSameClasses',
    actual: diff.added,
    expected: []
  })
}

function className (item) {
  return item.props.className
}

function style (item) {
  return item.props.style
}

function children (item) {
  return item.props.children
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

export default tape
