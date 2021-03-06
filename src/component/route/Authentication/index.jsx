import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { compose } from 'service/helper'
import {
  PushAlert,
} from 'service/frontend'
import Header from './Header'
import MethodBar from './MethodBar'
import BrowserWallet from './Methods/BrowserWallet'
import LedgerWallet from './Methods/LedgerWallet'
// import TrezorWallet from './Methods/TrezorWallet'
import PrivatekeyWallet from './Methods/PrivatekeyWallet'
import MnemonicWallet from './Methods/MnemonicWallet'

import {
  ConfirmLogin,
} from './actions'


const {
  BrowserWallet: _BrowserWallet_,
  LedgerWallet: _LedgerWallet_,
  // TrezorWallet: _TrezorWallet_,
  SoftwareWalletMnemonic: _MnemonicWallet_,
  SoftwareWalletPrivate: _PrivateWallet_,
} = UNLOCK_WALLET_METHODS


class Authentication extends React.Component {

  state = {
    unlockingMethod: 0,
    QRCodeLink: '',
  }

  MethodOptions = [
    _BrowserWallet_,
    _LedgerWallet_,
    // _TrezorWallet_,
    _PrivateWallet_,
    _MnemonicWallet_,
  ]

  componentDidMount() {
    const isAndroid = window.navigator.userAgent.match(/Android/i)
    const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    if (agentQuery === 'mobile') {
      this.MethodOptions = this.MethodOptions.filter(r => ![
        UNLOCK_WALLET_METHODS.LedgerWallet,
        UNLOCK_WALLET_METHODS.TrezorWallet,
        UNLOCK_WALLET_METHODS.SoftwareWalletPrivate,
        UNLOCK_WALLET_METHODS.SoftwareWalletMnemonic,
      ].includes(r))
      this.forceUpdate()
    }
  }

  changeMethod = (unlockingMethod) => this.setState({ unlockingMethod })

  confirmWallet = this.props.ConfirmLogin

  render () {

    const {
      unlockingMethod,
    } = this.state

    const isActiveMethod = (method) => unlockingMethod === this.MethodOptions.indexOf(method)

    return (
      <Box>
        <Header />
        <MethodBar
          value={unlockingMethod}
          onChange={this.changeMethod}
          options={this.MethodOptions}
        />
        {isActiveMethod(_BrowserWallet_) && <BrowserWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_LedgerWallet_) && <LedgerWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_PrivateWallet_) && <PrivatekeyWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_MnemonicWallet_) && <MnemonicWallet onConfirm={this.confirmWallet} />}
      </Box>
    )
  }
}

const mapProps = state => ({
  socket: state.socket,
})

const actions = store => ({
  PushAlert,
  ConfirmLogin,
})

export default compose(
  withRouter,
  connect(mapProps, actions),
)(Authentication)
