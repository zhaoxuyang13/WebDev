import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};
const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: "#ffc107",
  },
  info: {
    backgroundColor: "#343a40",
  },
  warning: {
    backgroundColor: "#dc3545",
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

function MySnackBar(props) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom',
                        horizontal: 'left' }}
        open={props.open}
        autoHideDuration={5000}
        onClose={props.handleClose}
        message={<span >{props.message}</span>}
      >
        <MySnackbarContentWrapper
          onClose={props.handleClose}
          variant={props.variant}
          message={props.message}
        />
      </Snackbar>
    </div>
  );
}

export default MySnackBar;