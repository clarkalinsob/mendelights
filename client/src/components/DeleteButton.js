import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
}))

const DeleteButton = props => {
  const classes = useStyles()
  const { food } = props
  const [open, setOpen] = useState(false)

  const [deleteFood] = useMutation(DELETE_FOOD, {
    variables: {
      name: food.name
    },
    update(proxy) {
      const data = proxy.readQuery({
        query: GET_FOODS
      })
      data.getFoods = data.getFoods.filter(f => f.name !== food.name)
      proxy.writeQuery({ query: GET_FOODS, data })
      handleClose()
    }
  })

  function handleOpen() {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <>
      <Button variant="contained" color="secondary" className={classes.button} onClick={handleOpen}>
        Delete
        <DeleteIcon className={classes.rightIcon} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete this food?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete {food.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteFood} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const DELETE_FOOD = gql`
  mutation deleteFood($name: String!) {
    deleteFood(name: $name)
  }
`

const GET_FOODS = gql`
  {
    getFoods {
      id
      name
      price
    }
  }
`

export default DeleteButton
