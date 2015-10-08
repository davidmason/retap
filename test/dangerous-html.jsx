import test from '../src/retap.jsx'
import React from 'react'

test('Sets inner HTML', function setsInnerHtml (t) {
  t.isSameMarkup(<div dangerouslySetInnerHTML={{__html: 'Penfold'}}/>,
                 <div dangerouslySetInnerHTML={{__html: 'Danger Mouse'}}/>)
  t.end()
})
