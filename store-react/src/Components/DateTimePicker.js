import React, { Fragment, useState } from "react";
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'

function DateTimePicker(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Fragment>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <div className="picker">
        <DatePicker
          keyboard
          clearable
          label={props.label}
          format="MM/dd/yyyy"
          placeholder="10/10/2018"
          mask={value =>
            value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : []
          }
          value={selectedDate}
          onChange={(value) => {
            handleDateChange(value)
            props.onChange(value);
          }}
          disableOpenOnEnter
          animateYearScrolling={false}
        />
      </div>
      </MuiPickersUtilsProvider>
    </Fragment>
  );
}

export default DateTimePicker;