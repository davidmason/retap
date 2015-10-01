
import test from '../src/retap.jsx'
import React from 'react'

test('Renders correct attributes', t => {
  const actual = (
    <div>
      <a href="http://www.lutesandguitars.co.uk/htm/gallery.htm">
        <img title="Lute-o"
          src="http://www.wga.hu/art/r/rombouts/luteplay.jpg"/>
      </a>
    </div>
  )

  const expected = (
    <div>
      <a href="http://www.nasa.gov/mission_pages/newhorizons/images/index.html">
        <img title="Pluto"
          src="http://www.nasa.gov/sites/default/files/thumbnails/image/nh-pluto-in-false-color.jpg"/>
      </a>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})
