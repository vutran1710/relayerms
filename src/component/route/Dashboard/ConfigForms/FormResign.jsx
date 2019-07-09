import React from 'react'
import { connect } from 'redux-zero/react'
import { addDays, format as timeFormat, distanceInWordsToNow, isPast, parse as dateParse } from 'date-fns'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { PushAlert, AlertVariant } from 'service/frontend'
import * as http from 'service/backend'
import { ResignNotice } from './PresentComponents'


const FormResign = props => {
  const {
    relayer,
    RelayerContract,
    PushAlert,
    updateRelayer,
    refundRelayer,
  } = props

  const [step, setStep] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const nextStep = () => setStep(1)

  const confirmAndClose = async () => {
    handleClose()
    const { status, details } = await RelayerContract.resign({ coinbase: relayer.coinbase })

    if (!status) {
      const alert = { variant: AlertVariant.error, message: details }
      return PushAlert(alert)
    }

    const resigningRelayer = await http.updateRelayer({
      ...relayer,
      resigning: true,
      lock_time: timeFormat(addDays(Date.now(), 28), 'X'),
    })

    return updateRelayer(resigningRelayer)
  }


  const requestRefund = async () => {
    const { status, details } = await RelayerContract.refund({ coinbase: relayer.coinbase })

    if (!status) {
      const alert = { variant: AlertVariant.error, message: details }
      return PushAlert(alert)
    }

    await http.deleteRelayer(relayer.id)
    return refundRelayer(relayer.id)
  }


  if (relayer.resigning) {
    const remainingTime = distanceInWordsToNow(dateParse(relayer.lock_time * 1000))
    const withdrawalable = isPast(dateParse(relayer.lock_time * 1000))
    return (
      <Grid container>
        <Grid container direction="column" item md={8} sm={12} spacing={4}>
          <Grid item>
            <Typography variant="h6">
              The relayer is resigning
            </Typography>
          </Grid>
          <Grid item>
            You can ask for withdrawal after the deposit lock-time has elapsed
          </Grid>
          <Grid item>
            {withdrawalable ? `Lock time has elapsed for ${remainingTime}, you can withdraw now` : `${remainingTime} remaining`}
          </Grid>
          <Grid item container justify="start">
            <Button onClick={requestRefund} disabled={!withdrawalable} color="primary" variant="contained" data-testid="refund-button">
              Refund
            </Button>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container>
      {step === 0 && <ResignNotice confirm={nextStep} />}
      {step === 1 && (
        <Box>
          <Grid item container sm={12} md={8} direction="column" spacing={4}>
            <Grid item sm={12}>
              <Typography variant="h5">
                Resign
              </Typography>
            </Grid>
            <Grid item sm={12}>
              If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
            </Grid>
            <Grid item sm={12} container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  name="name"
                  value={relayer.name}
                  readOnly
                  fullWidth
                  label="Relayer name"
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
              <Grid item>
                <TextField
                  name="coinbase"
                  value={relayer.coinbase}
                  readOnly
                  fullWidth
                  label="Relayer Coinbase"
                  variant="outlined"
                  margin="dense"
                />
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Button onClick={handleClickOpen} data-testid="resign-button" color="primary" variant="contained">
                Resign
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ className: 'p-1' }}
          >
            <DialogTitle id="alert-dialog-title">WARNING!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
              </DialogContentText>
            </DialogContent>
            <Box display="flex" justifyContent="space-between" className="p-1">
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmAndClose} color="secondary" variant="contained" data-testid="accept-button">
                Accept
              </Button>
            </Box>
          </Dialog>
        </Box>
      )}
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  PushAlert,
  updateRelayer: (state, relayer) => {
    const Relayers = Array.from(state.Relayers)
    const index = Relayers.findIndex(r => r.id === relayer.id)
    Relayers[index] = relayer
    return { Relayers, shouldUpdateUserRelayers: true }
  },
  refundRelayer: (state, relayerId) => {
    const Relayers = Array.from(state.Relayers).filter(r => r.id === relayerId)
    return { Relayers, shouldUpdateUserRelayers: true }
  }
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(FormResign)
