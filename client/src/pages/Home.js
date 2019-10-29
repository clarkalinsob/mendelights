import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'

import CustomerFoodCard from '../components/CustomerFoodCard'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    marginBottom: '2em'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1)
  }
}))

const Home = () => {
  const classes = useStyles()

  const { loading, data, error } = useQuery(FETCH_FOODS_QUERY)

  const addToCartCallback = data => {
    console.log('added to cart: ', data)
  }

  if (!loading) console.log(data)
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            MENDELIGHTS
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container>
        {loading ? (
          <h1>loading ... </h1>
        ) : (
          <div className={classes.root}>
            <Grid container spacing={3}>
              {data.getFoods.map((food, index) => (
                <>
                  <Grid key={food.id} item xs={8} sm={8}>
                    <CustomerFoodCard food={food} addToCartCallback={addToCartCallback} />
                  </Grid>
                  {index === 0 ? ( // Display Order Summary
                    <Grid item xs={4} sm={4}>
                      <Paper className={classes.paper}>xs=4</Paper>
                    </Grid>
                  ) : (
                    ''
                  )}
                </>
              ))}
            </Grid>
          </div>
        )}
      </Container>
    </div>
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

export default Home
