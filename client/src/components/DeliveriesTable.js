import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'

import DeliveryDateDialog from './DeliveryDateDialog'

const columns = [
  { id: 'id', label: 'Delivery ID', minWidth: 200 },
  { id: 'date', label: 'Delivery Date', minWidth: 200 },
  { id: 'orders', label: 'Total Orders', minWidth: 200 },
  { id: 'orders', label: 'Potential Sales', minWidth: 200 },
  { id: 'edit', label: 'Edit', minWidth: 100 }
]

function createData(deliveryDate) {
  return { deliveryDate }
}

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  tableWrapper: {
    maxHeight: 507,
    overflow: 'auto'
  },
  column: {
    flexBasis: '33.33%'
  }
})

const DeliveriesTable = () => {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const { loading, data } = useQuery(GET_DELIVERYDATES_QUERY)

  function handleChangePage(newPage) {
    setPage(newPage)
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  let rows = []

  if (!loading) {
    data.getDeliveryDates.forEach(deliveryDate => {
      rows.push(createData(deliveryDate))
    })
  }

  return (
    <>
      <DeliveryDateDialog action="add" />
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.label}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.deliveryDate.id}>
                    {columns.map((column, index) => {
                      const value = row.deliveryDate[column.id]
                      let total = 0
                      if (index === 3) {
                        value.forEach(val => {
                          total += val.totalCost
                        })
                      }

                      return (
                        <TableCell key={column.label} align={column.align}>
                          {index === 4 ? ( // edit button
                            <DeliveryDateDialog action="edit" deliveryDateObj={row.deliveryDate} />
                          ) : index === 3 ? ( // potential sales
                            `P${total}`
                          ) : index === 2 ? ( // total orders
                            value.length
                          ) : index === 1 ? ( // date
                            moment.unix(value / 1000).format('ll')
                          ) : (
                            value // id
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'previous page'
          }}
          nextIconButtonProps={{
            'aria-label': 'next page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

const GET_DELIVERYDATES_QUERY = gql`
  query getDeliveryDates {
    getDeliveryDates {
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
    }
  }
`

export default DeliveriesTable
