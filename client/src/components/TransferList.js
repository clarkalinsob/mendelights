import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
  root: {
    margin: 0,
    width: '100%'
  },
  cardHeader: {
    padding: theme.spacing(1, 2)
  },
  list: {
    width: '45em',
    height: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto'
  },
  button: {
    margin: theme.spacing(0.5, 0)
  },
  floatLeft: {
    float: 'left',
    marginRight: 20
  },
  floatRight: {
    float: 'right'
  }
}))

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1)
}

function union(a, b) {
  return [...a, ...not(b, a)]
}

const TransferList = props => {
  const classes = useStyles()

  const filteredOrders = props.orders.filter(ord => !ord.deliveryDate)

  const [checked, setChecked] = useState([])
  const [left, setLeft] = useState(filteredOrders)
  const [right, setRight] = useState(props.savedData ? props.savedData.orders : [])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = items => intersection(checked, items).length

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const sendData = () => {
    props.parentCallback(right)
  }

  if (right.length > 0) sendData()

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value}-label`

          return (
            <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={
                  <div style={{ fontSize: 12 }}>
                    <div className={classes.floatLeft}>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <b>Order ID</b>
                            </td>
                            <td>{value.id}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Name</b>
                            </td>
                            <td>{value.name}</td>
                          </tr>
                          <tr>
                            <td>
                              <b>Email</b>
                            </td>
                            <td>{value.email}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
                          <td>
                            <b>Total</b>
                          </td>
                        </tr>
                        {value.foods.length > 0
                          ? value.foods.map((food, index) => (
                              <tr key={food.name}>
                                <td>{food.name}</td>
                                <td>{food.quantity}</td>
                                <td>P{food.price}</td>
                                <td>P{food.cost}</td>
                                {index < 1 && (
                                  <td style={{ fontSize: 16, fontWeight: 'bold' }}>
                                    P{value.totalCost}
                                  </td>
                                )}
                              </tr>
                            ))
                          : ''}
                      </tbody>
                    </table>
                  </div>
                }
              />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
    </Grid>
  )
}

export default TransferList
