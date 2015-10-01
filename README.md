# retap

Wrapper around [tape](https://www.npmjs.com/package/tape) that adds
functions for testing React components.

## Installation

```
npm install retap --save-dev
```

## Overview

I wanted tests for generated markup that were thorough, and easy to read
and maintain. Use `t.isSameMarkup` to compare a JSX representation of
a component with a JSX representation of the elements you expect to see.

This module can return a
[react-unit](https://www.npmjs.com/package/react-unit) component from
 `t.createComponent`.

## Usage

### Running tests

Since your tests probably include JSX, they need to be transpiled. I use
[babel-tape-runner](https://www.npmjs.com/package/babel-tape-runner):

```
npm install -g babel-tape-runner
babel-tape-runner tests/**/*.jsx
```

That gives raw tap output. You can pipe it to
[faucet](https://www.npmjs.com/package/faucet) to make it easier to read.

```
npm install -g faucet
babel-tape-runner tests/**/*.jsx | faucet
```

Rather than global installs, you can install babel-tape-runner and faucet
as dev dependencies and run them with `npm test`:

```
// package.json
  ...
  "scripts": {
    "test": "babel-tape-runner tests/**/*.jsx | faucet"
  },
  "devDependencies": {
    "babel-tape-runner": "^1.2.0",
    "faucet": "0.0.1",
    "react": "^0.13.3"
  }
  ...
```

### Writing tests

Use it like *tape*, but now you can call `t.isSameMarkup()` with JSX to
compare. You don't have to use JSX - if you feel like using
`React.createElement()`, who am I to stop you?

```
import test from 'retap'
// needed for compiled JSX in expected
import React from 'react'
import DwarfPlanet from '../components/DwarfPlanet'

test('DwarfPlanet generates correct markup', t => {
  const actual = (
    <DwarfPlanet designation="134340 Pluto"
      className="plutoid trans-neptunian-object kuiper-belt-object"
      satellites={['Charon', 'Styx', 'Nix', 'Kerberos', 'Hydra']}/>
  )

  const expected = (
    <div className="dwarf-planet plutoid trans-neptunian-object kuiper-belt-object">
      <h2>134340 Pluto</h2>
      <h3>Satellites</h3>
      <ul>
        <li className="moon">Charon</li>
        <li className="moon">Styx</li>
        <li className="moon">Nix</li>
        <li className="moon">Kerberos</li>
        <li className="moon">Hydra</li>
      </ul>
    </div>
  )

  t.isSameMarkup(actual, expected)

  // it is easier to use t.end() rather than try to figure out how many
  // comparisons isSameMarkup will do to use t.plan()
  t.end()
})

```

You can get a *react-unit* component with `t.createComponent()` to
manually check props and other things (see
[react-unit](https://www.npmjs.com/package/react-unit)). The component
cannot be passed to isSameMarkup (I intend to fix that in future), so
keep the JSX return value if you want to use both approaches:

```
import test from 'retap'
// needed for compiled JSX
import React from 'react'
import DwarfPlanet from '../components/DwarfPlanet'

test('DwarfPlanet generates correct markup', t => {
  const actual = (
    <DwarfPlanet designation="1 Ceres"
      satellites={[]}/>
  )

  const actualComponent = t.createComponent(actual)

  const heading = actualComponent.findByQuery('h2')
  t.equal(heading.props.value, '1 Ceres', 'Should show designation in H2')

  t.isSameMarkup(actual, (
    <div className="dwarf-planet">
      <h2>1 Ceres</h2>
      No known satellites
    </div>
  ))

  // it is easier to use t.end() rather than try to figure out how many
  // comparisons isSameMarkup will do to use t.plan()
  t.end()
})
```


## API

### **`t.isSameMarkup(actual, expected)`**

Generate tap errors in the output for mismatches between *actual* and
*expected*. Not everything is checked, checks run are:

 - elements are of correct types and are in the same tree structure
 - classNames match (in any order)
 - styles match in any order
 - text content matches
 - title attribute matches
 - src matches (for <img> tags)
 - href matches (for <a> tags)
 - content set with dangerouslySetInnerHtml matches

*Note: `isSameMarkup` will perform numerous checks that each count as part
of the test plan, so take these into account if using `t.plan()`.

#### Params

Both must be React elements, which you can make with JSX or manually.

 - *actual* - the element under test, with test props
 - *expected* - the expected markup

e.g.

```
t.isSameMarkup(<MinorPlanet name="Eris"/>,
               <div className="minor-planet">Eris</div>)
```

### **`t.createComponent(jsx)`**

Create a react-unit component. Basically a shortcut to the react-unit
module. See [react-unit](https://www.npmjs.com/package/react-unit)

#### Params

 - *jsx* - React element, specified with JSX or manually.
