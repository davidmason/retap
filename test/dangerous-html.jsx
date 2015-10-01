import test from '../src/retap.jsx'
import React from 'react'

test('Sets inner HTML', t => {
  t.isSameMarkup(<div dangerouslySetInnerHtml={{__html: 'Penfold'}}/>,
                 <div dangerouslySetInnerHtml={{__html: 'Danger Mouse'}}/>)
  t.end()
})
