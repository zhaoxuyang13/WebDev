import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { loginWithUserInfo} from './actions/loginAction'
import MyAlertDialog from './Components/MyDialog';
import axios from 'axios'
class LoginPageRaw extends Component {
  constructor (props){
    super(props);
    this.state ={
      openAlertDialog : false
    }
  }
  gotoSignUpPage = () => {
    this.props.history.push('./SignUpPage')
  }
  gotoHomePage = () => {
    this.props.history.push('./')
  }
  gotoAdminPage = () =>{
    this.props.history.push('./AdminPage')//TODO:add Admin page and change this line
  }
  Login = () => {
    let pswd = document.getElementById('pwd').value
    let username = document.getElementById('username').value

    axios({
      headers:{
        'Content-Type':'application/json'
      },
      transformRequest:[(data) => JSON.stringify(data)],
      withCredentials:true,
      baseURL:"http://localhost:8080/",
      method: "post",
      url: "/UserAccount/",
      data:{
        username:username,
        password: pswd,
      },
      responseType:"json",
    }).then(response => {
      console.log(response)
      if(response.data.loginSuccess){
        this.props.onLoginSuccess(response.data.userData)
        this.gotoHomePage();
      }else{
        let errorInfo = response.data.errorInfo;
        alert("failed.\n errorInfo : " + errorInfo);
      }
    })
  }

  render () {
    console.log(this.props);
    return (
      <div className="jumbotron jumbotron-fluid ">
        <div className="container flex-column ">
          <div className="col-6 mx-auto">
            <h2 id="main-title" className="mr-auto">欢迎登录</h2>
            <div className="form-group">
              <label htmlFor="username">User name / Email :</label>
              <input type="text" className="form-control" id="username"/>
            </div>
            <div className="form-group">
              <label htmlFor="pwd">Password :</label>
              <input type="password" className="form-control" id="pwd"/>
            </div>
            <button type="submit" className="btn btn-dark mr-1" onClick={this.Login}>登录</button>
            <button type="button" className="btn btn-outline-dark" onClick={this.gotoSignUpPage}>没有账号，点此注册</button>
          </div>
        </div>
        <MyAlertDialog content="1234" title= "5678" open = {this.state.openAlertDialog}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo:state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLoginSuccess: userInfo =>{
      dispatch(loginWithUserInfo(userInfo))
    }
  }
}
const LoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPageRaw)

export default withRouter(LoginPage)