import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import BooksPage from './BooksPage'

class AdminPageRaw extends Component{

  componentWillMount () {
    if(!this.props.isAdmin) {
      alert("your are not admin , returning to home page")
      this.gotoHomePage();
    }
  }

  gotoHomePage = ()=>{
    this.props.history.push('./');
  }
  render () {

    return(
      <div>
        <div className="mx-auto"> Admin Mode </div>
        <BooksPage/>
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


export default withRouter(AdminPage);