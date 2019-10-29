import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import FoodCard from '../components/FoodCard'
import FoodDialog from '../components/FoodDialog'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}))

function Foods() {
  const { loading, data, error } = useQuery(FETCH_FOODS_QUERY)

  const classes = useStyles()
  return (
    <>
      {loading ? (
        <h1>loading ... </h1>
      ) : (
        <div className={classes.root}>
          <FoodDialog action="add" />
          <Grid container spacing={5}>
            {data.getFoods.map(food => (
              <Grid key={food.id} item xs={12} sm={12}>
                <FoodCard food={food} />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
  )
}

const FETCH_FOODS_QUERY = gql`
  query getFoods {
    getFoods {
      id
      name
      price
    }
  }
`

export default Foods
