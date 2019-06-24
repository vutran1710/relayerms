import React from 'react'
import { AppBar, Box, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const mainColor = '#00a99d'

const BoxWrap = withStyles({
  root: {
    margin: '50px auto',
    width: '700px',
  }
})(props => <Box {...props} />)

const StyledAppBar = withStyles({
  root: {
    backgroundColor: 'transparent',
    border: `solid 1px ${mainColor}`,
    boxShadow: 'inset 1px 1px 3px 0px rgba(0,0,0,.2)',
    borderRadius: 5,
    marginBottom: 10,
  }
})(props => <AppBar {...props} />)

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      width: '100%',
      height: '110px',
      backgroundColor: mainColor,
      transform: 'translateY(-108px)',
      zIndex: -1,
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />)

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: 'gray',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(16),
    padding: 25,
    height: 108,
  },
  selected: {
    color: 'white',
  },
}))(props => <Tab disableRipple {...props} />)

const MethodBar = ({
  value,
  onChange,
  options,
  children,
}) => (
  <BoxWrap>
    <StyledAppBar position="static" color="default">
      <StyledTabs
        value={value}
        onChange={(_, value) => onChange(value)}
        variant="fullWidth"
      >
        {options.map(op => <StyledTab label={op} key={op} />)}
      </StyledTabs>
    </StyledAppBar>
    {children}
  </BoxWrap>
)

export default MethodBar
