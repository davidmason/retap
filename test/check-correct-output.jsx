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
ok 9 wrong element type at (root)<div>[1]<h3>
ok 10 Missing expected classNames at path (root)<div>[1]<h3>
ok 11 Found unexpected classNames at path (root)<div>[1]<h3>
ok 12 should have same styles at (root)<div>[1]<h3>
ok 13 wrong element type at (root)<div>[2]<ul>
ok 14 Missing expected classNames at path (root)<div>[2]<ul>
ok 15 Found unexpected classNames at path (root)<div>[2]<ul>
ok 16 should have same styles at (root)<div>[2]<ul>
ok 17 wrong element type at (root)<div>[2]<ul>[0]<li>
ok 18 Missing expected classNames at path (root)<div>[2]<ul>[0]<li>
ok 19 Found unexpected classNames at path (root)<div>[2]<ul>[0]<li>
ok 20 should have same styles at (root)<div>[2]<ul>[0]<li>
ok 21 wrong element type at (root)<div>[2]<ul>[1]<li>
ok 22 Missing expected classNames at path (root)<div>[2]<ul>[1]<li>
ok 23 Found unexpected classNames at path (root)<div>[2]<ul>[1]<li>
ok 24 should have same styles at (root)<div>[2]<ul>[1]<li>
ok 25 wrong element type at (root)<div>[2]<ul>[2]<li>
ok 26 Missing expected classNames at path (root)<div>[2]<ul>[2]<li>
ok 27 Found unexpected classNames at path (root)<div>[2]<ul>[2]<li>
ok 28 should have same styles at (root)<div>[2]<ul>[2]<li>
ok 29 wrong element type at (root)<div>[2]<ul>[3]<li>
ok 30 Missing expected classNames at path (root)<div>[2]<ul>[3]<li>
ok 31 Found unexpected classNames at path (root)<div>[2]<ul>[3]<li>
ok 32 should have same styles at (root)<div>[2]<ul>[3]<li>
ok 33 wrong element type at (root)<div>[2]<ul>[4]<li>
ok 34 Missing expected classNames at path (root)<div>[2]<ul>[4]<li>
ok 35 Found unexpected classNames at path (root)<div>[2]<ul>[4]<li>
ok 36 should have same styles at (root)<div>[2]<ul>[4]<li>

1..36
# tests 36
# pass  36

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
    const dir = path.join(__dirname, '..')
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
    at: Test._tapeLibTest2.default.isSameClasses (${dir}/index.jsx:125:8)
  ...
not ok 3 Found unexpected classNames at path (root)<div>
  ---
    operator: isSameClasses
    expected: |-
      []
    actual: |-
      [ 'dwarf-planet' ]
    at: Test._tapeLibTest2.default.isSameClasses (${dir}/index.jsx:133:8)
  ...
ok 4 should have same styles at (root)<div>
not ok 5 child elements should be identical at (root)<div>
  ---
    operator: equal
    expected: <h3></h3>
    actual:   [ <h2></h2>, <h3></h3>, <ul></ul> ]
    at: compare (${dir}/index.jsx:109:15)
  ...

1..5
# tests 5
# pass  2
# fail  3

`
    t.equal(actual, expected,
      'should have the expected output when there are errors')
  }))
})
