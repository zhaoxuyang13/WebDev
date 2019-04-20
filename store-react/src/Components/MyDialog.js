import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class MyAlertDialog extends React.Component {
  constructor (props){
    super(props)
    this.state = {
      open: false,
    };
  }
  handleClose = () => {
    this.setState({ open: false });
  };
  componentWillReceiveProps (nextProps, nextContext) {
    console.log("do")
    const {open} = nextProps
    if(open === true){
      this.setState({open:true})
    }
  }
  render() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Acknowledge
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default MyAlertDialog;