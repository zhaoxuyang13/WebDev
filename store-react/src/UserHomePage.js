import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Tab from "./Components/Tab";
import UserOrder from './Components/UserOrder';
import { Paper } from '@material-ui/core'
import axios from 'axios'
import UserSumForm from './Components/UserSumForm'
class UserHomePageRaw extends Component{
  constructor (props) {
    super(props)

  }
  componentWillMount () {
    if(!this.props.userInfo.isLogin) {
      alert("please Login first! going to Login Page...");
      this.props.history.replace("./LoginPage");
    }
  }
  render(){
    const helloMsg="User: "+this.props.userInfo.username;
    return(

      <div className="wideColumn flex-column container">
        <Tab text={helloMsg}/>
        <UserOrder userID = {this.props.userInfo.userID}
                   bookList = {this.props.books}
        />
        <Tab text="统计"/>
        <UserSumForm bookList = {this.props.books}/>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
    books:state.books,
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}

const UserHomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserHomePageRaw)

export default withRouter(UserHomePage)