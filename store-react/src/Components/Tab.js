import { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import React from 'react'

class Tab extends Component {
  render () {
    return (
      <div className="mb-1">
        <Paper className="d-flex py-3" elevation={2}>
          <div className="mx-auto">{this.props.text}</div>
        </Paper>
      </div>
    )
  }
}
export default Tab;