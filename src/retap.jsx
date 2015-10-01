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

function ifEitherDefined(a, b, callback) {
  if (!isUndefined(a) || !isUndefined(b)) {
    callback(a, b)
  }
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

  // harness.equal(expectedRender, {}, 'just for debug')

  compare(actualRender, expectedRender)

  function compare (actual, expected, context = []) {
    if (isUndefined(actual) && isUndefined(expected)) {
      return
    }

    if (isUndefined(expected)) {
      harness._assert(false, {
        message: `should have no more elements at ${ctx(context)}`,
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
        message: `should have more elements at ${ctx(localContext)}`,
        operator: 'isSameMarkup',
        actual: undefined,
        expected: expected // '<' + expected.type + '>'
      })
      return
    }

    harness.equal(actual.type, expected.type,
      `should have same element type at ${ctx(localContext)}`)

    // if types are the same, check type-specific attributes
    if (actual.type === expected.type) {
      switch (expected.type) {
        case 'img':
          harness.equal(actual.props.src, expected.props.src,
            `should have same src in <img> tag at ${ctx(localContext)}`)
          break;
        case 'a':
          harness.equal(actual.props.href, expected.props.href,
            `should have same href in <a> tag at ${ctx(localContext)}`)
      }
    }

    ifEitherDefined(className(actual), className(expected),
      (actual, expected) => {
        harness.isSameClasses(actual, expected, localContext)
      })
    ifEitherDefined(style(actual), style(expected), (actual, expected) => {
      harness.deepEqual(actual, expected,
        `should have same styles at ${ctx(localContext)}`)
    })
    ifEitherDefined(title(actual), title(expected), (actual, expected) => {
      harness.equal(actual, expected,
        `should have same title at ${ctx(localContext)}`)
    })
    ifEitherDefined(innerHTML(actual), innerHTML(expected),
      (actual, expected) => {
        harness.equal(actual.__html, expected.__html,
          `should dangerously set same inner html at ${ctx(localContext)}`)
      })

    // FIXME .text and .texts both give combined text from elements
    //       but I want to treat the immediate child text similar to
    //       other children and just compare it

    const actualChildren = isArray(children(actual))
      ? children(actual) : [children(actual)]
    const expectedChildren = isArray(children(expected))
      ? children(expected) : [children(expected)]


    // zipWith does not give the position within the array pairs
    // so I track it manually
    let index = 0
    // not entirely comfortable using zipWith just for side effects
    // but it is the best fit I have found so far
    // TODO change to use zip, then foreach
    zipWith(actualChildren, expectedChildren, (actual, expected) => {
        compare(actual, expected, localContext.concat(index))
        index++
      }
    )

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

function className (item) {
  return item.props ? item.props.className : undefined
}

function style (item) {
  return item.props ? item.props.style : undefined
}

function children (item) {
  return item.props ? item.props.children : undefined
}

function title (item) {
  return item.props ? item.props.title : undefined
}

function innerHTML (item) {
  return item.props ? item.props.dangerouslySetInnerHTML : undefined
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
