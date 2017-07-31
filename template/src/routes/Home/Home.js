import React from 'react'
import { FormattedMessage } from 'react-intl'

export class Home extends React.Component {
  static displayName = 'Home'

  render = () => {
    return <h1><FormattedMessage id="home.welcome" /></h1>
  }
}

export default Home
