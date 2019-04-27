import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { loadCartFromBackend } from './actions/BooksAction'
import axios from 'axios'

require('./css/styles1.css')
require('./css/bootstrap.min.css')
require('./css/bootstrap.min.css.map')

class HomePageRaw extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    axios({
      withCredentials:true,
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/UserCart/',
      responseType: 'json'
    }).then(response => {
      if (response.data === null) return
      this.props.onLoadUserCart(response.data.items)
    })
  }
  gotoSignUpPage = () => {
    this.props.history.push('./SignUpPage')
  }
  gotoLoginPage = () => {
    this.props.history.push('./LoginPage')
  }

  render () {
    const SignBtns = <div>
      <button className="btn btn-dark text-center mt-3 mr-4" type="button" onClick={this.gotoSignUpPage}> Sign up for
        more
      </button>
      <button className="btn btn-dark text-center mt-3" type="button" onClick={this.gotoLoginPage}> Sign in now</button>
    </div>
    const HelloMsg = <p>Hi There , {this.props.userInfo.username} </p>
    const alternative = this.props.userInfo.isLogin ? HelloMsg : SignBtns
    return (
      <main className="home-content" role="main">
        <div className="jumbotron jumbotron-fluid">
          <div className="container welcome-msg">
            <h1 className="mt-4">Welcome</h1>
            <p className="mt-4"> Read, Find, and much more!</p>
            {alternative}
          </div>
          <div className="mx-auto mt-5 col-8 mb-5">
            <input type="search" className="form-control" placeholder="Find More..." autoComplete="off"/>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLoadUserCart: (cart) => {
      dispatch(loadCartFromBackend(cart))
    }
  }
}

const HomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePageRaw)

export default withRouter(HomePage)



