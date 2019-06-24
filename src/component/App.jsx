import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import PageHeader from 'component/shared/PageHeader'
import Alert from 'component/shared/Alert'
import { Private } from 'component/utility'
import { SITE_MAP, IS_DEV } from 'service/constant'

/* import {
 *   $autoAuthenticated,
 *   $fetchContract,
 *   $fetchRelayers,
 *   $fetchTokens,
 * } from './shared/actions' */

import 'style/app.scss'

const Router = IS_DEV ? HashRouter : BrowserRouter

class App extends React.Component {

  componentDidMount() {
    /* this.props.$fetchRelayers()
     * this.props.$fetchContract()
     * this.props.$fetchTokens()
     * this.props.$autoAuthenticated() */
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Authentication} />
        </Switch>
      </Router>
    )
  }
}

const mapProps = state => ({
  relayers: state.Relayers
})

const actions = {

}

export default connect(mapProps, actions)(App)
