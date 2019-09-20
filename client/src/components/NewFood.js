import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const NewFood = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleNameChange = ({ target: { value } }) => {
    setName(value);
  };

  const handlePriceChange = ({ target: { value } }) => {
    setPrice(value);
  };

  const [createFood, { error }] = useMutation(CREATE_FOOD, {
    variables: {
      name,
      price
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: GET_FOODS
      });

      data.getFoods = [result.data.createFood, ...data.getFoods];
      proxy.writeQuery({ query: GET_FOODS, data });
      setName('');
      setPrice('');
      handleClose();
    }
  });

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div style={{ float: 'right', marginBottom: 10 }}>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add New
        <AddIcon className={classes.rightIcon} />
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Food</DialogTitle>
        <DialogContent>
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            className={classes.textField}
            autoFocus
            margin="dense"
            id="name"
            label="Price"
            fullWidth
            onChange={handlePriceChange}
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
  );
};

const CREATE_FOOD = gql`
  mutation createFood($name: String!, $price: String!) {
    createFood(name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

const GET_FOODS = gql`
  {
    getFoods {
      id
      name
      price
    }
  }
`;

export default NewFood;
