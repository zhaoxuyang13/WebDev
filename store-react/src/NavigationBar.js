import React, { Component } from 'react'
import logoImg from './img/logo-img.png'
import { Link, withRouter } from 'react-router-dom'
import { logOut } from './actions/loginAction'
import { connect } from 'react-redux'
import axios from 'axios'

class NavigationBarRaw extends Component {

  gotoLoginPage = () => {
    this.props.history.push('/LoginPage')
  }
  gotoHomePage = () => {
    this.props.history.push('/')
  }
  search = (e) => {
    e.preventDefault()
    const searchKey = this.inputValue.value
    console.log(searchKey)
  }
  signOut = () => {
    axios({
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/UserAccount/Logout',
      responseType: 'json'
    }).then(response => {
      console.log(response)
    })
    this.props.onLogOut()
    this.gotoHomePage()
  }
  render () {
    const { isLogin, isAdmin } = this.props.userInfo
    const loginBtn = isLogin ?
      <button className="btn btn-outline-light" type="button" id="login-btn" onClick={this.signOut}> 登出</button> :
      <button className="btn btn-outline-light" type="button" id="login-btn"
              onClick={this.gotoLoginPage}>登陆/注册</button>
    const adminAccess = isAdmin ?
      <li className="nav-item">
        <Link className="nav-link" to="/AdminPage">管理员</Link>
      </li> : null
    const userAccess = isLogin && !isAdmin ?
      <li className="nav-item">
        <Link className="nav-link" to="/UserHomePage">我的</Link>
      </li> : null
    return (
      <header className="bg-nav navbar navbar-expand navbar-dark flex-column flex-sm-row  m-0 py-0">
        <a className="navbar-brand m-0 px-1 py-0" href="/" aria-label="StoreIcon">
          <img
            id="logo-img"
            src={logoImg}
            alt={''}
          />
        </a>
        <h2 id="store-name">BookStore</h2>
        <div className="navbar-nav-scroll ">
          <ul className="navbar-nav bd-navbar-nav flex-row">
            <li className="nav-item">
              <Link className="nav-link" to="/">主页</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/BooksPage">图书</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/">榜单</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/CartPage">购物车</Link>
            </li>
            {adminAccess}
            {userAccess}
          </ul>
        </div>
        <form className="form-inline ml-sm-auto d-none d-sm-flex" onSubmit={this.search}>
          <input className="form-control mr-sm-2" type="search" placeholder="书名/作者/出版社" aria-label="Search"
                 ref={input => this.inputValue = input}/>
          <button className="btn btn-outline-light" type="submit" onClick={this.search}>搜索</button>
        </form>
        {loginBtn}
      </header>
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
    onLogOut: () => {
      dispatch(logOut())
    }
  }
}
const NavigationBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationBarRaw)


export default withRouter(NavigationBar)