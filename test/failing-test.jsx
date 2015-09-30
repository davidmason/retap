
import test from '../src/retap.jsx'
import React from 'react'
import DwarfPlanet from './DwarfPlanet'

test('DwarfPlanet generates correct markup', t => {
  const actual = (
    <DwarfPlanet designation="1 Ceres"
      satellites={['something']}/>
  )

  t.isSameMarkup(actual, (
    <div className="elf-planet">
      <h3>1 Ceres</h3>
      No known satellites
    </div>
  ))
  t.end()
})
