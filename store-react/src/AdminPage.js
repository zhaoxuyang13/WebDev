import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Tab from './Components/Tab'
import BookManage from './Components/BookManage'
import UserManage from './Components/UserManage'

class AdminPageRaw extends Component {

  componentWillMount () {
      if(!this.props.isAdmin) {
        alert("your are not admin , returning to home page")
        this.props.history.replace("./")
      }
    }

  render () {
    return (
      <div className="wideColumn flex-column container">
        <Tab text="图书管理"/>
        <BookManage/>
        <Tab text="用户管理"/>
        <UserManage/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAdmin: state.userInfo.isAdmin
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
const AdminPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPageRaw)

export default withRouter(AdminPage)