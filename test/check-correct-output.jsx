import test from 'tape'
import child_process from'child_process'
import path from'path'
import concat from'concat-stream'
import { isEmpty } from 'lodash'

const executable = path.join(__dirname, '..', 'node_modules', 'babel-tape-runner', 'bin', 'babel-tape-runner')

// TODO tests should ideally report the location in the JSX under test

test('correct tap output for no errors', function correctSuccessOutput (t) {
  t.plan(4)

  const proc = child_process.spawn(executable, ['test/passing-test.jsx'])

  var stdoutErr;
  proc.stdout.on('error', (e) => {
    stdoutErr = e
  })

  var stderrOutput;
  proc.stderr.pipe(concat(function (output) {
    stderrOutput = output
  }))

  proc.on('exit', (code, signal) => {
    t.equal(code, 0, 'exit code should be 0 with no errors')
    t.error(stdoutErr)
    t.true(isEmpty(stderrOutput), stderrOutput)
  })

  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# DwarfPlanet generates correct markup
ok 1 should have same element type at (root)<div>
ok 2 should have all expected classNames at path (root)<div>
ok 3 should have only expected classNames at path (root)<div>
ok 4 should have same element type at (root)<div>[0]<h2>
ok 5 should have all expected text at path (root)<div>[0]<h2>
ok 6 should have only expected text at path (root)<div>[0]<h2>
ok 7 should have same element type at (root)<div>[1]<h3>
ok 8 should have all expected text at path (root)<div>[1]<h3>
ok 9 should have only expected text at path (root)<div>[1]<h3>
ok 10 should have same element type at (root)<div>[2]<ul>
ok 11 should have same element type at (root)<div>[2]<ul>[0]<li>
ok 12 should have all expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 13 should have only expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 14 should have all expected text at path (root)<div>[2]<ul>[0]<li>
ok 15 should have only expected text at path (root)<div>[2]<ul>[0]<li>
ok 16 should have same element type at (root)<div>[2]<ul>[1]<li>
ok 17 should have all expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 18 should have only expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 19 should have all expected text at path (root)<div>[2]<ul>[1]<li>
ok 20 should have only expected text at path (root)<div>[2]<ul>[1]<li>
ok 21 should have same element type at (root)<div>[2]<ul>[2]<li>
ok 22 should have all expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 23 should have only expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 24 should have all expected text at path (root)<div>[2]<ul>[2]<li>
ok 25 should have only expected text at path (root)<div>[2]<ul>[2]<li>
ok 26 should have same element type at (root)<div>[2]<ul>[3]<li>
ok 27 should have all expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 28 should have only expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 29 should have all expected text at path (root)<div>[2]<ul>[3]<li>
ok 30 should have only expected text at path (root)<div>[2]<ul>[3]<li>
ok 31 should have same element type at (root)<div>[2]<ul>[4]<li>
ok 32 should have all expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 33 should have only expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 34 should have all expected text at path (root)<div>[2]<ul>[4]<li>
ok 35 should have only expected text at path (root)<div>[2]<ul>[4]<li>
ok 36 should have all expected text at path (root)<div>[2]<ul>
ok 37 should have only expected text at path (root)<div>[2]<ul>
ok 38 should have all expected text at path (root)<div>
ok 39 should have only expected text at path (root)<div>

1..39
# tests 39
# pass  39

# ok

`
    t.equal(actual, expected,
      'should have the expected output when there are no errors')
  }))
})

test('correct tap output for errors', function correctFailureOutput (t) {
  t.plan(4)

  const testFile = `${__dirname}/failing-test.jsx`

  const proc = child_process.spawn(executable, ['test/failing-test.jsx'])

  var stdoutErr;
  proc.stdout.on('error', (e) => {
    stdoutErr = e
  })

  var stderrOutput;
  proc.stderr.pipe(concat(function (output) {
    stderrOutput = output
  }))

  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
    t.error(stdoutErr)
    t.true(isEmpty(stderrOutput), stderrOutput)
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# DwarfPlanet generates correct markup
ok 1 should have same element type at (root)<div>
not ok 2 should have all expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      [ 'elf-planet' ]
    actual: |-
      []
    at: Test.failingTest (${testFile}:12:5)
  ...
not ok 3 should have only expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      []
    actual: |-
      [ 'dwarf-planet' ]
    at: Test.failingTest (${testFile}:12:5)
  ...
not ok 4 should have same element type at (root)<div>[0]<h3>
  ---
    operator: equal
    expected: 'h3'
    actual:   'h2'
    at: Test.failingTest (${testFile}:12:5)
  ...
ok 5 should have all expected text at path (root)<div>[0]<h3>
ok 6 should have only expected text at path (root)<div>[0]<h3>
not ok 7 should have no more elements at (root)<div>[1]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   'h3'
    at: Test.failingTest (${testFile}:12:5)
  ...
not ok 8 should have no more elements at (root)<div>[2]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   'ul'
    at: Test.failingTest (${testFile}:12:5)
  ...
not ok 9 should have all expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: [ 'No known satellites' ]
    actual:   []
    at: Test.failingTest (${testFile}:12:5)
  ...
not ok 10 should have only expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: []
    actual:   [ 'Satellites' ]
    at: Test.failingTest (${testFile}:12:5)
  ...

1..10
# tests 10
# pass  3
# fail  7

`
    t.equal(actual, expected,
      'should have the expected output when there are errors')
  }))
})

test('fails on mismatched element-specific checks', t => {
  t.plan(4)

  const testFile = `${__dirname}/element-specific-checks.jsx`

  const proc = child_process.spawn(executable,
    ['test/element-specific-checks.jsx'])

  var stdoutErr;
  proc.stdout.on('error', (e) => {
    stdoutErr = e
  })

  var stderrOutput;
  proc.stderr.pipe(concat(function (output) {
    stderrOutput = output
  }))

  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
    t.error(stdoutErr)
    t.true(isEmpty(stderrOutput), stderrOutput)
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# Renders correct attributes
ok 1 should have same element type at (root)<div>
ok 2 should have same element type at (root)<div>[0]<a>
not ok 3 should have same href in <a> tag at (root)<div>[0]<a>
  ---
    operator: equal
    expected: |-
      'http://www.nasa.gov/mission_pages/newhorizons/images/index.html'
    actual: |-
      'http://www.lutesandguitars.co.uk/htm/gallery.htm'
    at: Test.rendersCorrectAttributes (${testFile}:24:5)
  ...
ok 4 should have same element type at (root)<div>[0]<a>[0]<img>
not ok 5 should have same src in <img> tag at (root)<div>[0]<a>[0]<img>
  ---
    operator: equal
    expected: |-
      'http://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-in-false-color.jpg'
    actual: |-
      'http://www.wga.hu/art/r/rombouts/luteplay.jpg'
    at: Test.rendersCorrectAttributes (${testFile}:24:5)
  ...
not ok 6 should have same title at (root)<div>[0]<a>[0]<img>
  ---
    operator: equal
    expected: |-
      'Pluto'
    actual: |-
      'Lute-o'
    at: Test.rendersCorrectAttributes (${testFile}:24:5)
  ...
ok 7 should have all expected text at path (root)<div>[0]<a>[0]<img>
ok 8 should have only expected text at path (root)<div>[0]<a>[0]<img>
ok 9 should have all expected text at path (root)<div>[0]<a>
ok 10 should have only expected text at path (root)<div>[0]<a>
ok 11 should have all expected text at path (root)<div>
ok 12 should have only expected text at path (root)<div>

1..12
# tests 12
# pass  9
# fail  3

`
    t.equal(actual, expected,
      'should have the expected output for mismatched supported attributes')
  }))
})

test('fails on mismatched dangerous HTML', t => {
  t.plan(2)

  const proc = child_process.spawn(executable, ['test/dangerous-html.jsx'])
  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# Sets inner HTML
ok 1 should have same element type at (root)<div>
not ok 2 should dangerously set same inner html at (root)<div>
  ---
    operator: equal
    expected: 'Danger Mouse'
    actual:   'Penfold'
    at: Test.setsInnerHtml (${__dirname}/dangerous-html.jsx:5:5)
  ...
ok 3 should have all expected text at path (root)<div>
ok 4 should have only expected text at path (root)<div>

1..4
# tests 4
# pass  3
# fail  1

`
    t.equal(actual, expected,
      'should have the expected output for mismatched dangerous HTML')
  }))
})

test('fails on mismatched form elements attributes', t => {
  t.plan(2)

  const proc = child_process.spawn(executable, ['test/form-elements.jsx'])
  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# Compares htmlFor on label
ok 1 should have same element type at (root)<label>
not ok 2 label should be for the same id at (root)<label>
  ---
    operator: equal
    expected: 'me'
    actual:   'you'
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:5:5)
  ...
ok 3 should have all expected text at path (root)<label>
ok 4 should have only expected text at path (root)<label>
# Compares value attributes on input
ok 5 should have same element type at (root)<input>
not ok 6 input should have same value at (root)<input>
  ---
    operator: equal
    expected: 'never'
    actual:   'definitely'
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:13:5)
  ...
ok 7 input should have same defaultValue at (root)<input>
ok 8 should have all expected text at path (root)<input>
ok 9 should have only expected text at path (root)<input>
ok 10 should have same element type at (root)<input>
not ok 11 input should have same value at (root)<input>
  ---
    operator: equal
    expected: |-
      null
    actual: |-
      'gate-crashing'
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:15:5)
  ...
ok 12 input should have same defaultValue at (root)<input>
ok 13 should have all expected text at path (root)<input>
ok 14 should have only expected text at path (root)<input>
ok 15 should have same element type at (root)<input>
not ok 16 input should have same value at (root)<input>
  ---
    operator: equal
    expected: |-
      'where is it?'
    actual: |-
      null
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:17:5)
  ...
ok 17 input should have same defaultValue at (root)<input>
ok 18 should have all expected text at path (root)<input>
ok 19 should have only expected text at path (root)<input>
# Compares type attributes on input
ok 20 should have same element type at (root)<input>
ok 21 input should have same value at (root)<input>
ok 22 input should have same defaultValue at (root)<input>
not ok 23 input should have same type attribute at (root)<input>
  ---
    operator: equal
    expected: 'checkbox'
    actual:   'text'
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:60:5)
  ...
ok 24 input (type=checkbox) should have same checked at (root)<input>
ok 25 input (type=checkbox) should have same defaultChecked at (root)<input>
ok 26 should have all expected text at path (root)<input>
ok 27 should have only expected text at path (root)<input>
ok 28 should have same element type at (root)<input>
ok 29 input should have same value at (root)<input>
ok 30 input should have same defaultValue at (root)<input>
not ok 31 input should have same type attribute at (root)<input>
  ---
    operator: equal
    expected: undefined
    actual:   'radio'
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:62:5)
  ...
ok 32 should have all expected text at path (root)<input>
ok 33 should have only expected text at path (root)<input>
ok 34 should have same element type at (root)<input>
ok 35 input should have same value at (root)<input>
ok 36 input should have same defaultValue at (root)<input>
not ok 37 input should have same type attribute at (root)<input>
  ---
    operator: equal
    expected: 'submit'
    actual:   undefined
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:64:5)
  ...
ok 38 should have all expected text at path (root)<input>
ok 39 should have only expected text at path (root)<input>
# Compares checked attributes on checkbox
ok 40 should have same element type at (root)<input>
ok 41 input should have same value at (root)<input>
ok 42 input should have same defaultValue at (root)<input>
ok 43 input should have same type attribute at (root)<input>
not ok 44 input (type=checkbox) should have same checked at (root)<input>
  ---
    operator: equal
    expected: false
    actual:   true
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:72:5)
  ...
ok 45 input (type=checkbox) should have same defaultChecked at (root)<input>
ok 46 should have all expected text at path (root)<input>
ok 47 should have only expected text at path (root)<input>
ok 48 should have same element type at (root)<input>
ok 49 input should have same value at (root)<input>
ok 50 input should have same defaultValue at (root)<input>
ok 51 input should have same type attribute at (root)<input>
not ok 52 input (type=checkbox) should have same checked at (root)<input>
  ---
    operator: equal
    expected: false
    actual:   true
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:74:5)
  ...
ok 53 input (type=checkbox) should have same defaultChecked at (root)<input>
ok 54 should have all expected text at path (root)<input>
ok 55 should have only expected text at path (root)<input>
ok 56 should have same element type at (root)<input>
ok 57 input should have same value at (root)<input>
ok 58 input should have same defaultValue at (root)<input>
ok 59 input should have same type attribute at (root)<input>
not ok 60 input (type=checkbox) should have same checked at (root)<input>
  ---
    operator: equal
    expected: true
    actual:   false
    at: Test.<anonymous> (${__dirname}/form-elements.jsx:76:5)
  ...
ok 61 input (type=checkbox) should have same defaultChecked at (root)<input>
ok 62 should have all expected text at path (root)<input>
ok 63 should have only expected text at path (root)<input>

1..63
# tests 63
# pass  53
# fail  10

`
    t.equal(actual, expected,
      'should have the expected output for mismatched form element attributes')
  }))
})
