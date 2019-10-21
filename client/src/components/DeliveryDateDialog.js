import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'

import TransferList from './TransferList'
import DateTimePicker from './DateTimePicker'

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  editButton: {
    margin: theme.spacing(1)
  }
}))

const DeliveryDateDialog = props => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(props.deliveryDateObj ? props.deliveryDateObj.date : '')
  const [orderIds, setOrderIds] = useState('')

  const { loading, data } = useQuery(GET_DELIVERYDATES_QUERY)
  const getOrders = useQuery(GET_ORDERS_QUERY)

  const [createDeliveryDate, { error }] = useMutation(CREATE_DELIVERYDATE_MUTATION, {
    variables: {
      date: date.toString(),
      orderIds: JSON.stringify(orderIds)
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_DELIVERYDATES_QUERY
      })

      data.getDeliveryDates = [result.data.createDeliveryDate, ...data.getDeliveryDates]
      proxy.writeQuery({ query: GET_DELIVERYDATES_QUERY, data })

      handleClose()
    }
  })

  function handleClickOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  const getDateCallback = date => {
    setDate(date)
  }

  const getOrdersCallback = data => {
    if (data.length > 0) setOrderIds(data)
    else console.log('Unable to save empty data')
  }

  return (
    <div style={{ textAlign: 'right', marginBottom: 20 }}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        {props.action === 'add' ? 'Add New' : 'Edit'}
        {props.action === 'add' ? (
          <AddIcon className={classes.rightIcon} />
        ) : (
          <EditIcon className={classes.rightIcon} />
        )}
      </Button>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Delivery Date</DialogTitle>
        <DialogContent>
          <DateTimePicker
            date={props.deliveryDateObj ? props.deliveryDateObj.date : null}
            parentCallback={getDateCallback}
          />
          <br />
          {!getOrders.loading ? (
            <TransferList
              orders={getOrders.data.getOrders}
              savedData={props.deliveryDateObj}
              parentCallback={getOrdersCallback}
            />
          ) : (
            'loading'
          )}
        </DialogContent>
        <DialogActions>
          {error && (
            <Typography
              variant="body2"
              color="error"
              paragraph
              key={error.graphQLErrors[0].message}
            >
              *{error.graphQLErrors[0].message}
            </Typography>
          )}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createDeliveryDate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const GET_DELIVERYDATES_QUERY = gql`
  {
    getDeliveryDates {
      id
      date
      orders {
        id
        totalCost
        deliveryDate
      }
    }
  }
`

const GET_ORDERS_QUERY = gql`
  query getOrders {
    getOrders {
      id
      name
      email
      foods {
        name
        quantity
        price
        cost
      }
      totalCost
      deliveryDate
      #   status
      paid
      createdAt
    }
  }
`

const CREATE_DELIVERYDATE_MUTATION = gql`
  mutation createDeliveryDate($date: String!, $orderIds: String!) {
    createDeliveryDate(deliveryDateInput: { date: $date, orderIds: $orderIds }) {
      id
      date
      orders {
        id
        totalCost
        deliveryDate
      }
    }
  }
`

export default DeliveryDateDialog
