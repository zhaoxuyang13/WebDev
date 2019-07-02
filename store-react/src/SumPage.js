import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Tab from './Components/Tab'
import AdminSumForm from './Components/AdminSumForm'
import UserManage from './Components/UserManage'
import UserOrder from './UserHomePage'
import AdminUserForm from './Components/AdminUserForm'

class SumPageRaw extends Component {

  componentWillMount () {
    if(!this.props.isAdmin) {
      alert("your are not admin , returning to home page")
      this.props.history.replace("./")
    }
  }

  render () {
    return (
      <div className="wideColumn flex-column container">
        <Tab text="销售统计"/>
        <AdminSumForm  bookList = {this.props.books}/>
        <Tab text="用户统计"/>
        <AdminUserForm bookList = {this.props.books}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAdmin: state.userInfo.isAdmin,
    books:state.books,
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
const SumPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SumPageRaw)

export default withRouter(SumPage)