import 'date-fns'
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

const DateTimePicker = props => {
  const [selectedDate, setSelectedDate] = useState(
    props.date !== null ? new Date(parseInt(props.date)) : Date.now()
  )

  const handleDateChange = date => {
    setSelectedDate(date)
  }

  props.parentCallback(selectedDate)

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="none"
          id="date-picker-inline"
          label="Select Date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )
}

export default DateTimePicker
