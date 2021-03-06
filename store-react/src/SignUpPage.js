import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { loginWithId } from './actions/loginAction'
import { connect } from 'react-redux'
import { signUp } from './actions/SignUpAction'
import axios from 'axios'
import MySnackBar from './Components/MySnackBar'

class SignUpPageRaw extends Component {
  constructor (props){
  super(props)
  this.state = {
    snackBarState:{
      open : false,
      variant:"info"
    }
  }
}
  closeSnackBar = ()=>{
    this.setState({
      snackBarState:{
        open:false,
        variant:"info"
      }
    })
  }
  openSnackBar = (newState) =>{
    this.setState({
      snackBarState:{
        open : true,
        message : newState.message,
        variant: newState.variant,
      }
    })
  }
  gotoLoginPage = () => {
    this.props.history.push('./LoginPage')
  }
  gotoHomePage = () => {
    this.props.history.push('./')
  }
  validator = (username, email, pswd, pswd_confirm) => {
    return pswd === pswd_confirm;
  }
  signUp = () => {
    //TODO: better way for getG value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const pswd = document.getElementById('pwd').value
    const pswd_confirm = document.getElementById('pwd-confirm').value
    if (this.validator(username, email, pswd, pswd_confirm)) {
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [(data) => JSON.stringify(data)],
        withCredentials: true,
        baseURL: 'http://localhost:8080/',
        method: 'post',
        url: '/UserAccount/SignUp',
        data: {
          username: username,
          password: pswd,
          email: email
        },
        responseType: 'json'
      }).then(response => {
        console.log(response)
        if (response.data.loginSuccess) {
          this.props.onSignUpSuccess(response.data.userData)
          this.gotoHomePage()
        } else {
          let errorInfo = response.data.errorInfo
          alert('failed.\n errorInfo : ' + errorInfo)
        }
      })
    } else {
      //TODO : clear form.
      this.openSnackBar({
        variant: "warning",
        message: "密码不一致"
      });
    }
  }

  render () {
    const state = this.state
    return (
      <div className="jumbotron jumbotron-fluid ">
        <div className="container flex-column ">
          <div className="col-6 mx-auto">
            <h2 id="main-title" className="mr-auto">欢迎注册</h2>
            <div className="form-group">
              <label htmlFor="username">User name</label>
              <input type="text" className="form-control" id="username"/>
            </div>
            <div className="form-group">
              <label htmlFor="Email">Email :</label>
              <input type="text" className="form-control" id="email"/>
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password :</label>
              <input type="password" className="form-control" id="pwd"/>
            </div>
            <div className="form-group">
              <label htmlFor="pwd-confirm">Password Confirmation:</label>
              <input type="password" className="form-control" id="pwd-confirm"/>
            </div>
            <button type="submit" className="btn btn-outline-dark mr-1" onClick={this.signUp}>注册</button>
            <button type="button" className="btn btn-dark" onClick={this.gotoLoginPage}>已有账号，我要登陆</button>
          </div>
        </div>
        <MySnackBar       open={state.snackBarState.open}
                          message ={state.snackBarState.message}
                          handleClose={this.closeSnackBar}
                          variant={state.snackBarState.variant}
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}
const mapDispatchToProps = dispatch => {
  return {
    onSignUpSuccess: userData => {
      dispatch(signUp(userData))
    }
  }
}
const SignUpPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPageRaw)

export default withRouter(SignUpPage)