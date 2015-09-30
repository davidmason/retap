
import cx from 'classnames'
import React from 'react'

const DwarfPlanet = React.createClass({

  render: function () {
    const className = cx('dwarf-planet', this.props.className)

    let heading
    let moonList = 'No known satellites'

    if (this.props.satellites && this.props.satellites.length) {
      heading = <h3>Satellites</h3>
      let moons = this.props.satellites.map(moon => {
        return <li key={moon} className="moon">{moon}</li>
      })
      moonList = <ul>{moons}</ul>
    }

    return (
      <div className={className}>
        <h2>{this.props.designation}</h2>
        {heading}
        {moonList}
      </div>
    )
  }
})

export default DwarfPlanet
