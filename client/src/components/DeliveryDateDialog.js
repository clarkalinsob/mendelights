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
  const [orderIds, setOrderIds] = useState(
    props.deliveryDateObj ? props.deliveryDateObj.orders : []
  )
  const [formerIds, setFormerIds] = useState([])
  const getOrders = useQuery(GET_ORDERS_QUERY)

  const mutation =
    props.action === 'add' ? CREATE_DELIVERYDATE_MUTATION : EDIT_DELIVERYDATE_MUTATION

  const [mutationCallback, { error }] = useMutation(mutation, {
    variables: {
      deliveryDateId: props.deliveryDateObj ? props.deliveryDateObj.id : null,
      date: date.toString(),
      orderIds: JSON.stringify(orderIds),
      formerIds: JSON.stringify(formerIds)
    },
    update(proxy, result) {
      if (result.data.createDeliveryDate) {
        const data = proxy.readQuery({
          query: GET_DELIVERYDATES_QUERY
        })

        data.getDeliveryDates = [result.data.createDeliveryDate, ...data.getDeliveryDates]
        proxy.writeQuery({ query: GET_DELIVERYDATES_QUERY, data })
      } else {
        const data = proxy.readQuery({
          query: GET_ORDERS_QUERY
        })

        data.getOrders = result.data.editDeliveryDate.formers
        proxy.writeQuery({ query: GET_ORDERS_QUERY, data })
      }

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

  const getLeftListCallback = data => {
    setFormerIds(data)
  }

  const getRightListCallback = data => {
    setOrderIds(data)
  }

  return (
    <div style={{ textAlign: props.action === 'add' ? 'right' : '', marginBottom: 20 }}>
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
              getLeftListCallback={getLeftListCallback}
              getRightListCallback={getRightListCallback}
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
          <Button onClick={mutationCallback} color="primary">
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

const EDIT_DELIVERYDATE_MUTATION = gql`
  mutation editDeliveryDate(
    $deliveryDateId: ID!
    $date: String!
    $orderIds: String!
    $formerIds: String!
  ) {
    editDeliveryDate(
      deliveryDateId: $deliveryDateId
      deliveryDateInput: { date: $date, orderIds: $orderIds, formerIds: $formerIds }
    ) {
      id
      date
      orders {
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
      formers {
        id
        totalCost
        deliveryDate
      }
    }
  }
`

export default DeliveryDateDialog
