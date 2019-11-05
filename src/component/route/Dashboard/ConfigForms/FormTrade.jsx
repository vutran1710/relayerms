import React from 'react'
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'
import TokenPairList from 'component/shared/TokenPairList'


const FormTrade = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  relayer,
}) => {

  const setPairsValues = pairs => {
    setFieldValue('from_tokens', pairs.map(p => p.from.address))
    setFieldValue('to_tokens', pairs.map(p => p.to.address))
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid item container direction="column" spacing={8}>
          <Grid item>
            <TextField
              label="Choose Trade Fee (min: 0.1%, max: 9.9%)"
              name="trade_fee"
              id="trade_fee-input"
              value={values.trade_fee}
              onChange={handleChange}
              error={errors.trade_fee}
              type="number"
              variant="outlined"              
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                endAdornment: '%',
                inputProps: {
                  step: 0.1,
                  max: 9.99,
                  min: 0.1,
                }
              }}
            />
          </Grid>
          <Grid item container direction="column" spacing={1}>
            <Grid item container justify="space-between" alignItems="center">
              <Typography variant="body1" className="m-0">
                Set trade Tokens
              </Typography>
            </Grid>
            <Grid item>
              <TokenPairList
                value={values}
                onChange={setPairsValues}
                disabled={isSubmitting}
                viewOnly={relayer.resigning}
                dexUrl={relayer.link}
              />
            </Grid>
          </Grid>
          <Grid item container justify="center">
            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting} data-testid="save-button">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.tradeForm
export default compose(formConnect, storeConnect)(FormTrade)
