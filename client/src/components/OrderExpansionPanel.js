import React from 'react'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'

import PaymentStatusButton from './PaymentStatusButton'
import OrderStatusStepper from './OrderStatusStepper'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15)
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20
  },
  details: {
    // alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, .03)'
  },
  column: {
    flexBasis: '33.33%'
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2)
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

const OrderExpansionPanel = ({ order }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ExpansionPanel key={order.id} square="false">
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <Typography className={classes.heading}>
              {moment.unix(order.createdAt / 1000).format('lll')}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>{order.name}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>{order.email}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.heading}>{order.paid ? 'Paid' : 'Unpaid'}</Typography>
          </div>
        </ExpansionPanelSummary>
        <OrderStatusStepper status={order.status} />
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Order ID</b>
                  </td>
                  <td>{order.id}</td>
                </tr>
                <tr>
                  <td>
                    <b>Name</b>
                  </td>
                  <td>{order.name}</td>
                </tr>
                <tr>
                  <td>
                    <b>Email</b>
                  </td>
                  <td>{order.email}</td>
                </tr>
                <tr>
                  <td>
                    <b>Delivery Date</b>
                  </td>
                  <td>{order.deliveryDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={classes.column}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Food Name</b>
                  </td>
                  <td>
                    <b>Qty</b>
                  </td>
                  <td>
                    <b>Price</b>
                  </td>
                  <td>
                    <b>Cost</b>
                  </td>
                </tr>
                {order.foods.length > 0
                  ? order.foods.map(food => (
                      <tr key={food.name}>
                        <td>{food.name}</td>
                        <td>{food.quantity}</td>
                        <td>P{food.price}</td>
                        <td>P{food.cost}</td>
                      </tr>
                    ))
                  : ''}
              </tbody>
            </table>
          </div>
          <div className={clsx(classes.column, classes.helper)}>
            <Typography>
              <b>Total Cost</b> : P{order.totalCost}
              <br />
              <PaymentStatusButton orderId={order.id} paid={order.paid} />
            </Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
      </ExpansionPanel>
    </div>
  )
}

export default OrderExpansionPanel
