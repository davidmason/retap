
import test from '../src/retap.jsx'
import React from 'react'
import DwarfPlanet from './DwarfPlanet'

test('DwarfPlanet generates correct markup', t => {
  const actual = (
    <DwarfPlanet designation="134340 Pluto"
      className="plutoid trans-neptunian-object kuiper-belt-object"
      satellites={['Charon', 'Styx', 'uNix', 'Kerberos', 'Hydra']}/>
  )

  // FIXME does not compare the text in these

  const expected = (
    <div className="dwarf-planet plutoid trans-neptunian-object kuiper-belt-object">
      <h2>134340 Pluto</h2>
      <h3>Satellites</h3>
      <ul>
        <li className="moon">Charleston</li>
        <li className="moon">Styx</li>
        <li className="moon">Nix</li>
        <li className="moon">Kerberos</li>
        <li className="moon">Hydra</li>
      </ul>
    </div>
  )

  t.isSameMarkup(actual, expected)
  t.end()
})
