import test from 'tape'
import child_process from'child_process'
import path from'path'
import concat from'concat-stream'

const executable = path.join(__dirname, '..', 'node_modules', 'babel-tape-runner', 'bin', 'babel-tape-runner')

test('correct tap output for no errors', function correctSuccessOutput (t) {
  t.plan(2)

  const proc = child_process.spawn(executable, ['test/passing-test.jsx'])

  proc.on('exit', (code, signal) => {
    t.equal(code, 0, 'exit code should be 0 with no errors')
  })

  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const expected = `TAP version 13
# DwarfPlanet generates correct markup
ok 1 element type should match at (root)<div>
ok 2 should have all expected classNames at path (root)<div>
ok 3 should have only expected classNames at path (root)<div>
ok 4 should have same styles at (root)<div>
ok 5 element type should match at (root)<div>[0]<h2>
ok 6 should have all expected classNames at path (root)<div>[0]<h2>
ok 7 should have only expected classNames at path (root)<div>[0]<h2>
ok 8 should have same styles at (root)<div>[0]<h2>
ok 9 should have all expected text at path (root)<div>[0]<h2>
ok 10 should have only expected text at path (root)<div>[0]<h2>
ok 11 element type should match at (root)<div>[1]<h3>
ok 12 should have all expected classNames at path (root)<div>[1]<h3>
ok 13 should have only expected classNames at path (root)<div>[1]<h3>
ok 14 should have same styles at (root)<div>[1]<h3>
ok 15 should have all expected text at path (root)<div>[1]<h3>
ok 16 should have only expected text at path (root)<div>[1]<h3>
ok 17 element type should match at (root)<div>[2]<ul>
ok 18 should have all expected classNames at path (root)<div>[2]<ul>
ok 19 should have only expected classNames at path (root)<div>[2]<ul>
ok 20 should have same styles at (root)<div>[2]<ul>
ok 21 element type should match at (root)<div>[2]<ul>[0]<li>
ok 22 should have all expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 23 should have only expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 24 should have same styles at (root)<div>[2]<ul>[0]<li>
ok 25 should have all expected text at path (root)<div>[2]<ul>[0]<li>
ok 26 should have only expected text at path (root)<div>[2]<ul>[0]<li>
ok 27 element type should match at (root)<div>[2]<ul>[1]<li>
ok 28 should have all expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 29 should have only expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 30 should have same styles at (root)<div>[2]<ul>[1]<li>
ok 31 should have all expected text at path (root)<div>[2]<ul>[1]<li>
ok 32 should have only expected text at path (root)<div>[2]<ul>[1]<li>
ok 33 element type should match at (root)<div>[2]<ul>[2]<li>
ok 34 should have all expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 35 should have only expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 36 should have same styles at (root)<div>[2]<ul>[2]<li>
ok 37 should have all expected text at path (root)<div>[2]<ul>[2]<li>
ok 38 should have only expected text at path (root)<div>[2]<ul>[2]<li>
ok 39 element type should match at (root)<div>[2]<ul>[3]<li>
ok 40 should have all expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 41 should have only expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 42 should have same styles at (root)<div>[2]<ul>[3]<li>
ok 43 should have all expected text at path (root)<div>[2]<ul>[3]<li>
ok 44 should have only expected text at path (root)<div>[2]<ul>[3]<li>
ok 45 element type should match at (root)<div>[2]<ul>[4]<li>
ok 46 should have all expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 47 should have only expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 48 should have same styles at (root)<div>[2]<ul>[4]<li>
ok 49 should have all expected text at path (root)<div>[2]<ul>[4]<li>
ok 50 should have only expected text at path (root)<div>[2]<ul>[4]<li>
ok 51 should have all expected text at path (root)<div>[2]<ul>
ok 52 should have only expected text at path (root)<div>[2]<ul>
ok 53 should have all expected text at path (root)<div>
ok 54 should have only expected text at path (root)<div>

1..54
# tests 54
# pass  54

# ok

`
    t.equal(actual, expected,
      'should have the expected output when there are no errors')
  }))
})

test('correct tap output for errors', function correctFailureOutput (t) {
  t.plan(2)

  const proc = child_process.spawn(executable, ['test/failing-test.jsx'])
  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const checkFile = path.join(__dirname, '..', 'src', 'retap.jsx')
    const expected = `TAP version 13
# DwarfPlanet generates correct markup
ok 1 element type should match at (root)<div>
not ok 2 should have all expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      [ 'elf-planet' ]
    actual: |-
      []
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:138:8)
  ...
not ok 3 should have only expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      []
    actual: |-
      [ 'dwarf-planet' ]
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:146:8)
  ...
ok 4 should have same styles at (root)<div>
not ok 5 element type should match at (root)<div>[0]<h3>
  ---
    operator: equal
    expected: 'h3'
    actual:   'h2'
    at: compare (${checkFile}:67:13)
  ...
ok 6 should have all expected classNames at path (root)<div>[0]<h3>
ok 7 should have only expected classNames at path (root)<div>[0]<h3>
ok 8 should have same styles at (root)<div>[0]<h3>
ok 9 should have all expected text at path (root)<div>[0]<h3>
ok 10 should have only expected text at path (root)<div>[0]<h3>
not ok 11 should have no more elements at (root)<div>[1]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<h3>'
    at: compare (${checkFile}:46:15)
  ...
not ok 12 should have no more elements at (root)<div>[2]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<ul>'
    at: compare (${checkFile}:46:15)
  ...
not ok 13 should have all expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: [ 'No known satellites' ]
    actual:   []
    at: compare (${checkFile}:113:13)
  ...
not ok 14 should have only expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: []
    actual:   [ 'Satellites' ]
    at: compare (${checkFile}:119:13)
  ...

1..14
# tests 14
# pass  7
# fail  7

`
    t.equal(actual, expected,
      'should have the expected output when there are errors')
  }))
})

test('fails on mismatched element-specific checks', t => {
  t.plan(2)

  const proc = child_process.spawn(executable,
    ['test/element-specific-checks.jsx'])
  proc.on('exit', (code, signal) => {
    t.notEqual(code, 0, 'exit code should be non-0 when there are errors')
  })
  proc.stdout.pipe(concat(function (output) {
    const actual = output.toString('utf8')
    const checkFile = path.join(__dirname, '..', 'src', 'retap.jsx')
    const expected = `TAP version 13
# Renders correct attributes
ok 1 element type should match at (root)<div>
ok 2 should have all expected classNames at path (root)<div>
ok 3 should have only expected classNames at path (root)<div>
ok 4 should have same styles at (root)<div>
ok 5 element type should match at (root)<div>[0]<img>
not ok 6 src should match in <img> tags
  ---
    operator: equal
    expected: |-
      'http://www.wga.hu/art/r/rombouts/luteplay.jpg'
    actual: |-
      'http://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-in-false-color.jpg'
    at: compare (/home/damason/src/davidmason/retap/src/retap.jsx:74:19)
  ...
ok 7 should have all expected classNames at path (root)<div>[0]<img>
ok 8 should have only expected classNames at path (root)<div>[0]<img>
ok 9 should have same styles at (root)<div>[0]<img>
ok 10 should have all expected text at path (root)<div>[0]<img>
ok 11 should have only expected text at path (root)<div>[0]<img>
ok 12 should have all expected text at path (root)<div>
ok 13 should have only expected text at path (root)<div>

1..13
# tests 13
# pass  12
# fail  1

`
    t.equal(actual, expected,
      'should have the expected output for mismatched supported attributes')
  }))
})
