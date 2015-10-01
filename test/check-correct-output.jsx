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
ok 1 should have same element type at (root)<div>
ok 2 should have all expected classNames at path (root)<div>
ok 3 should have only expected classNames at path (root)<div>
ok 4 should have same styles at (root)<div>
ok 5 should have same title at (root)<div>
ok 6 should have same element type at (root)<div>[0]<h2>
ok 7 should have all expected classNames at path (root)<div>[0]<h2>
ok 8 should have only expected classNames at path (root)<div>[0]<h2>
ok 9 should have same styles at (root)<div>[0]<h2>
ok 10 should have same title at (root)<div>[0]<h2>
ok 11 should have all expected text at path (root)<div>[0]<h2>
ok 12 should have only expected text at path (root)<div>[0]<h2>
ok 13 should have same element type at (root)<div>[1]<h3>
ok 14 should have all expected classNames at path (root)<div>[1]<h3>
ok 15 should have only expected classNames at path (root)<div>[1]<h3>
ok 16 should have same styles at (root)<div>[1]<h3>
ok 17 should have same title at (root)<div>[1]<h3>
ok 18 should have all expected text at path (root)<div>[1]<h3>
ok 19 should have only expected text at path (root)<div>[1]<h3>
ok 20 should have same element type at (root)<div>[2]<ul>
ok 21 should have all expected classNames at path (root)<div>[2]<ul>
ok 22 should have only expected classNames at path (root)<div>[2]<ul>
ok 23 should have same styles at (root)<div>[2]<ul>
ok 24 should have same title at (root)<div>[2]<ul>
ok 25 should have same element type at (root)<div>[2]<ul>[0]<li>
ok 26 should have all expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 27 should have only expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 28 should have same styles at (root)<div>[2]<ul>[0]<li>
ok 29 should have same title at (root)<div>[2]<ul>[0]<li>
ok 30 should have all expected text at path (root)<div>[2]<ul>[0]<li>
ok 31 should have only expected text at path (root)<div>[2]<ul>[0]<li>
ok 32 should have same element type at (root)<div>[2]<ul>[1]<li>
ok 33 should have all expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 34 should have only expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 35 should have same styles at (root)<div>[2]<ul>[1]<li>
ok 36 should have same title at (root)<div>[2]<ul>[1]<li>
ok 37 should have all expected text at path (root)<div>[2]<ul>[1]<li>
ok 38 should have only expected text at path (root)<div>[2]<ul>[1]<li>
ok 39 should have same element type at (root)<div>[2]<ul>[2]<li>
ok 40 should have all expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 41 should have only expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 42 should have same styles at (root)<div>[2]<ul>[2]<li>
ok 43 should have same title at (root)<div>[2]<ul>[2]<li>
ok 44 should have all expected text at path (root)<div>[2]<ul>[2]<li>
ok 45 should have only expected text at path (root)<div>[2]<ul>[2]<li>
ok 46 should have same element type at (root)<div>[2]<ul>[3]<li>
ok 47 should have all expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 48 should have only expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 49 should have same styles at (root)<div>[2]<ul>[3]<li>
ok 50 should have same title at (root)<div>[2]<ul>[3]<li>
ok 51 should have all expected text at path (root)<div>[2]<ul>[3]<li>
ok 52 should have only expected text at path (root)<div>[2]<ul>[3]<li>
ok 53 should have same element type at (root)<div>[2]<ul>[4]<li>
ok 54 should have all expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 55 should have only expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 56 should have same styles at (root)<div>[2]<ul>[4]<li>
ok 57 should have same title at (root)<div>[2]<ul>[4]<li>
ok 58 should have all expected text at path (root)<div>[2]<ul>[4]<li>
ok 59 should have only expected text at path (root)<div>[2]<ul>[4]<li>
ok 60 should have all expected text at path (root)<div>[2]<ul>
ok 61 should have only expected text at path (root)<div>[2]<ul>
ok 62 should have all expected text at path (root)<div>
ok 63 should have only expected text at path (root)<div>

1..63
# tests 63
# pass  63

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
ok 1 should have same element type at (root)<div>
not ok 2 should have all expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      [ 'elf-planet' ]
    actual: |-
      []
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:137:8)
  ...
not ok 3 should have only expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      []
    actual: |-
      [ 'dwarf-planet' ]
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:145:8)
  ...
ok 4 should have same styles at (root)<div>
ok 5 should have same title at (root)<div>
not ok 6 should have same element type at (root)<div>[0]<h3>
  ---
    operator: equal
    expected: 'h3'
    actual:   'h2'
    at: compare (${checkFile}:67:13)
  ...
ok 7 should have all expected classNames at path (root)<div>[0]<h3>
ok 8 should have only expected classNames at path (root)<div>[0]<h3>
ok 9 should have same styles at (root)<div>[0]<h3>
ok 10 should have same title at (root)<div>[0]<h3>
ok 11 should have all expected text at path (root)<div>[0]<h3>
ok 12 should have only expected text at path (root)<div>[0]<h3>
not ok 13 should have no more elements at (root)<div>[1]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<h3>'
    at: compare (${checkFile}:46:15)
  ...
not ok 14 should have no more elements at (root)<div>[2]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<ul>'
    at: compare (${checkFile}:46:15)
  ...
not ok 15 should have all expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: [ 'No known satellites' ]
    actual:   []
    at: compare (${checkFile}:112:13)
  ...
not ok 16 should have only expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: []
    actual:   [ 'Satellites' ]
    at: compare (${checkFile}:118:13)
  ...

1..16
# tests 16
# pass  9
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
ok 1 should have same element type at (root)<div>
ok 2 should have all expected classNames at path (root)<div>
ok 3 should have only expected classNames at path (root)<div>
ok 4 should have same styles at (root)<div>
ok 5 should have same title at (root)<div>
ok 6 should have same element type at (root)<div>[0]<a>
not ok 7 should have same href in <a> tag at (root)<div>[0]<a>
  ---
    operator: equal
    expected: |-
      'http://www.nasa.gov/mission_pages/newhorizons/images/index.html'
    actual: |-
      'http://www.lutesandguitars.co.uk/htm/gallery.htm'
    at: compare (${checkFile}:78:19)
  ...
ok 8 should have all expected classNames at path (root)<div>[0]<a>
ok 9 should have only expected classNames at path (root)<div>[0]<a>
ok 10 should have same styles at (root)<div>[0]<a>
ok 11 should have same title at (root)<div>[0]<a>
ok 12 should have same element type at (root)<div>[0]<a>[0]<img>
not ok 13 should have same src in <img> tag at (root)<div>[0]<a>[0]<img>
  ---
    operator: equal
    expected: |-
      'http://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-in-false-color.jpg'
    actual: |-
      'http://www.wga.hu/art/r/rombouts/luteplay.jpg'
    at: compare (${checkFile}:74:19)
  ...
ok 14 should have all expected classNames at path (root)<div>[0]<a>[0]<img>
ok 15 should have only expected classNames at path (root)<div>[0]<a>[0]<img>
ok 16 should have same styles at (root)<div>[0]<a>[0]<img>
not ok 17 should have same title at (root)<div>[0]<a>[0]<img>
  ---
    operator: equal
    expected: |-
      'Pluto'
    actual: |-
      'Lute-o'
    at: compare (${checkFile}:86:13)
  ...
ok 18 should have all expected text at path (root)<div>[0]<a>[0]<img>
ok 19 should have only expected text at path (root)<div>[0]<a>[0]<img>
ok 20 should have all expected text at path (root)<div>[0]<a>
ok 21 should have only expected text at path (root)<div>[0]<a>
ok 22 should have all expected text at path (root)<div>
ok 23 should have only expected text at path (root)<div>

1..23
# tests 23
# pass  20
# fail  3

`
    t.equal(actual, expected,
      'should have the expected output for mismatched supported attributes')
  }))
})
