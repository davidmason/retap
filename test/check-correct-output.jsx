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
ok 1 wrong element type at (root)<div>
ok 2 Missing expected classNames at path (root)<div>
ok 3 Found unexpected classNames at path (root)<div>
ok 4 should have same styles at (root)<div>
ok 5 wrong element type at (root)<div>[0]<h2>
ok 6 Missing expected classNames at path (root)<div>[0]<h2>
ok 7 Found unexpected classNames at path (root)<div>[0]<h2>
ok 8 should have same styles at (root)<div>[0]<h2>
ok 9 Missing expected text at path (root)<div>[0]<h2>
ok 10 Found unexpected text at path (root)<div>[0]<h2>
ok 11 wrong element type at (root)<div>[1]<h3>
ok 12 Missing expected classNames at path (root)<div>[1]<h3>
ok 13 Found unexpected classNames at path (root)<div>[1]<h3>
ok 14 should have same styles at (root)<div>[1]<h3>
ok 15 Missing expected text at path (root)<div>[1]<h3>
ok 16 Found unexpected text at path (root)<div>[1]<h3>
ok 17 wrong element type at (root)<div>[2]<ul>
ok 18 Missing expected classNames at path (root)<div>[2]<ul>
ok 19 Found unexpected classNames at path (root)<div>[2]<ul>
ok 20 should have same styles at (root)<div>[2]<ul>
ok 21 wrong element type at (root)<div>[2]<ul>[0]<li>
ok 22 Missing expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 23 Found unexpected classNames at path (root)<div>[2]<ul>[0]<li>
ok 24 should have same styles at (root)<div>[2]<ul>[0]<li>
ok 25 Missing expected text at path (root)<div>[2]<ul>[0]<li>
ok 26 Found unexpected text at path (root)<div>[2]<ul>[0]<li>
ok 27 wrong element type at (root)<div>[2]<ul>[1]<li>
ok 28 Missing expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 29 Found unexpected classNames at path (root)<div>[2]<ul>[1]<li>
ok 30 should have same styles at (root)<div>[2]<ul>[1]<li>
ok 31 Missing expected text at path (root)<div>[2]<ul>[1]<li>
ok 32 Found unexpected text at path (root)<div>[2]<ul>[1]<li>
ok 33 wrong element type at (root)<div>[2]<ul>[2]<li>
ok 34 Missing expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 35 Found unexpected classNames at path (root)<div>[2]<ul>[2]<li>
ok 36 should have same styles at (root)<div>[2]<ul>[2]<li>
ok 37 Missing expected text at path (root)<div>[2]<ul>[2]<li>
ok 38 Found unexpected text at path (root)<div>[2]<ul>[2]<li>
ok 39 wrong element type at (root)<div>[2]<ul>[3]<li>
ok 40 Missing expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 41 Found unexpected classNames at path (root)<div>[2]<ul>[3]<li>
ok 42 should have same styles at (root)<div>[2]<ul>[3]<li>
ok 43 Missing expected text at path (root)<div>[2]<ul>[3]<li>
ok 44 Found unexpected text at path (root)<div>[2]<ul>[3]<li>
ok 45 wrong element type at (root)<div>[2]<ul>[4]<li>
ok 46 Missing expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 47 Found unexpected classNames at path (root)<div>[2]<ul>[4]<li>
ok 48 should have same styles at (root)<div>[2]<ul>[4]<li>
ok 49 Missing expected text at path (root)<div>[2]<ul>[4]<li>
ok 50 Found unexpected text at path (root)<div>[2]<ul>[4]<li>
ok 51 Missing expected text at path (root)<div>[2]<ul>
ok 52 Found unexpected text at path (root)<div>[2]<ul>
ok 53 Missing expected text at path (root)<div>
ok 54 Found unexpected text at path (root)<div>

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
ok 1 wrong element type at (root)<div>
not ok 2 Missing expected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      [ 'elf-planet' ]
    actual: |-
      []
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:139:8)
  ...
not ok 3 Found unexpected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      []
    actual: |-
      [ 'dwarf-planet' ]
    at: Test._tapeLibTest2.default.isSameClasses (${checkFile}:147:8)
  ...
ok 4 should have same styles at (root)<div>
not ok 5 wrong element type at (root)<div>[0]<h3>
  ---
    operator: equal
    expected: 'h3'
    actual:   'h2'
    at: compare (${checkFile}:79:13)
  ...
ok 6 Missing expected classNames at path (root)<div>[0]<h3>
ok 7 Found unexpected classNames at path (root)<div>[0]<h3>
ok 8 should have same styles at (root)<div>[0]<h3>
ok 9 Missing expected text at path (root)<div>[0]<h3>
ok 10 Found unexpected text at path (root)<div>[0]<h3>
not ok 11 expected no more elements at (root)<div>[1]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<h3>'
    at: compare (${checkFile}:58:15)
  ...
not ok 12 expected no more elements at (root)<div>[2]
  ---
    operator: isSameMarkup
    expected: undefined
    actual:   '<ul>'
    at: compare (${checkFile}:58:15)
  ...
not ok 13 Missing expected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: [ 'No known satellites' ]
    actual:   []
    at: compare (${checkFile}:114:13)
  ...
not ok 14 Found unexpected text at path (root)<div>
  ---
    operator: isSameMarkup
    expected: []
    actual:   [ 'Satellites' ]
    at: compare (${checkFile}:120:13)
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
