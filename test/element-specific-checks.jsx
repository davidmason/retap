
import test from '../src/retap.jsx'
import React from 'react'

test('Renders correct attributes', t => {
  const actual = (
    <div>
      <img title="Pluto"
        src="http://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-in-false-color.jpg"/>
    </div>
  )

  const expected = (
    <div>
      <img title="Lute-o"
        src="http://www.wga.hu/art/r/rombouts/luteplay.jpg"/>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})
