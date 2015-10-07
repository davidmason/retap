import test from '../src/retap.jsx'
import React from 'react'

test('Compares htmlFor on label', t => {
  t.isSameMarkup(<label htmlFor="you"/>,
                 <label htmlFor="me"/>)
  t.end()
})
