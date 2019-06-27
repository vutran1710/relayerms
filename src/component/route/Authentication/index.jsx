import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Container,
  Typography,
} from '@material-ui/core'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { compose } from 'service/helper'
import Header from './Header'
import MethodBar from './MethodBar'
import TomoWallet from './Methods/TomoWallet'
import BrowserWallet from './Methods/BrowserWallet'
import LedgerWallet from './Methods/LedgerWallet'
import TrezorWallet from './Methods/TrezorWallet'
import SoftwareWallet from './Methods/SoftwareWallet'


const MethodOptions = [
  UNLOCK_WALLET_METHODS.TomoWallet,
  UNLOCK_WALLET_METHODS.BrowserWallet,
  UNLOCK_WALLET_METHODS.LedgerWallet,
  UNLOCK_WALLET_METHODS.TrezorWallet,
  UNLOCK_WALLET_METHODS.SoftwareWallet,
]

/**
 * Enptry point for Authenticationn/Wallet unclock
 * Output: saving a WalletSigner instance to GlobalStore
 * @class Authentication
 * @extends {React.Component}
 */
class Authentication extends React.Component {

  state = {
    unlockingMethod: 0,
    QRCodeLink: '',
  }

  componentDidMount() {
    this.getQRCode()
  }

  getQRCode = () => {
    const isAndroid = window.navigator.userAgent.match(/Android/i)
    const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    const socket = this.props.socket

    socket.onmessage = async stringData => {
      const data = JSON.parse(stringData.data)
      const QRCodeLink = meta => `tomochain:sign?message=${encodeURI(meta.message)}&submitURL=${meta.url}`

      if (data.type === 'QR_CODE_REQUEST') {
        this.setState({ QRCodeLink: QRCodeLink(data.meta) })
      }

      if (data.type === 'QR_CODE_LOGIN') {
        // NOTE: do something on logged on
      }
    }

    const getQR = () => socket.send(JSON.stringify({
      request: 'QR_CODE_LOGIN',
      meta: { agentQuery },
    }))

    if (socket.readyState === socket.OPEN) {
      getQR()
    } else {
      socket.onopen = getQR
    }

  }

  changeMethod = (unlockingMethod) => this.setState({ unlockingMethod })

  confirmWallet = wallet => {
    // NOTE: convert PurserWallet to a ready-use WalletSigner
    this.props.saveWallet(wallet)
    this.props.history.push('/')
  }

  render () {
    const {
      unlockingMethod,
      QRCodeLink,
    } = this.state
    // NOTE: QRCode component's render is very expensive and will cause
    // lagging on switching between methods
    // So we keep it on the DOM instead of disposing the component
    return (
      <Box display="flex" flexDirection="column">
        <Container maxWidth="md" className="pt-4">
          <Header />
          <MethodBar value={unlockingMethod} onChange={this.changeMethod} options={MethodOptions}>
            <Typography component="small" className="text-alert">
              using node at <i className="text-alert">{process.env.REACT_APP_RPC}</i>
            </Typography>
          </MethodBar>
          <div style={{ display: unlockingMethod === 0 ? 'initial' : 'none' }}>
            <TomoWallet qrCode={QRCodeLink} />
          </div>
          {unlockingMethod === 1 && <BrowserWallet onConfirm={this.confirmWallet} />}
          {unlockingMethod === 2 && <LedgerWallet onConfirm={this.confirmWallet} />}
          {unlockingMethod === 3 && <TrezorWallet onConfirm={this.confirmWallet} />}
          {unlockingMethod === 4 && <SoftwareWallet onConfirm={this.confirmWallet} />}
        </Container>
      </Box>
    )
  }
}

const mapProps = state => ({
  socket: state.socket,
})

const actions = store => ({
  saveWallet: (state, wallet) => {
    const user = { ...state.user, wallet }
    return { user, auth: true }
  }
})

export default compose(
  withRouter,
  connect(mapProps, actions)
)(Authentication)
