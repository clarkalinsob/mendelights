import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Button from '@material-ui/core/Button'

const PaymentStatusButton = ({ orderId, paid }) => {
  const [payThis] = useMutation(TOGGLE_PAYMENT_MUTATION, {
    variables: {
      orderId
    }
  })

  return (
    <Button onClick={payThis} variant="contained" color={paid ? 'primary' : 'default'}>
      {paid ? 'Paid' : 'Unpaid'}
    </Button>
  )
}

const TOGGLE_PAYMENT_MUTATION = gql`
  mutation togglePaymentStatus($orderId: ID!) {
    togglePaymentStatus(orderId: $orderId) {
      id
      paid
    }
  }
`

export default PaymentStatusButton
