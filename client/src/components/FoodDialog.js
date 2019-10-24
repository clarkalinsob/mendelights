import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'

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

const FoodDialog = props => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [foodId, setFoodId] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const mutation = props.action === 'edit' ? EDIT_FOOD : CREATE_FOOD

  const [createFood, { error }] = useMutation(mutation, {
    variables: {
      name,
      price,
      foodId
    },
    update(proxy, result) {
      if (props.action === 'add') {
        const data = proxy.readQuery({
          query: GET_FOODS
        })

        data.getFoods = [result.data.createFood, ...data.getFoods]
        proxy.writeQuery({ query: GET_FOODS, data })
      }

      setName('')
      setPrice('')
      handleClose()
    }
  })

  function handleNameChange({ target: { value } }) {
    setName(value)
  }

  function handlePriceChange({ target: { value } }) {
    setPrice(value)
  }

  function handleClickOpen() {
    if (props.food && props.action === 'edit') {
      setFoodId(props.food.id)
      setName(props.food.name)
      setPrice(props.food.price)
    }
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  return (
    <div style={props.action === 'edit' ? { float: 'left' } : { float: 'right' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        className={props.action === 'edit' ? classes.editButton : ''}
      >
        {props.action === 'edit' ? (
          <>
            Edit
            <EditIcon className={classes.rightIcon} />
          </>
        ) : (
          <>
            Add New
            <AddIcon className={classes.rightIcon} />
          </>
        )}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {props.action === 'edit' ? 'Edit Food' : 'Add New Food'}
        </DialogTitle>
        <DialogContent>
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            onChange={handleNameChange}
            defaultValue={name}
            // defaultValue={props.action === 'edit' ? props.food.name : ''}
          />
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="name"
            label="Price"
            fullWidth
            onChange={handlePriceChange}
            defaultValue={price}
            // defaultValue={props.action === 'edit' ? props.food.price : ''}
          />
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
          <Button onClick={createFood} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const CREATE_FOOD = gql`
  mutation createFood($name: String!, $price: String!) {
    createFood(name: $name, price: $price) {
      id
      name
      price
    }
  }
`

const EDIT_FOOD = gql`
  mutation editFood($foodId: ID!, $name: String!, $price: String!) {
    editFood(foodId: $foodId, name: $name, price: $price) {
      id
      name
      price
    }
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

export default FoodDialog
