import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { initialState, storeApp } from './reducers/reducer.js'
import NavigationBar from './NavigationBar.js'
import axios from 'axios'
import { loginWithUserInfo } from './actions/loginAction'
import createMuiTheme from '@material-ui/core/es/styles/createMuiTheme'

class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <p>&copy; Zhao Xuyang 2019</p>
      </footer>
    )
  }
}

let store = createStore(storeApp, initialState)

class BookStore extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () { /*fetch session Data if Exist*/ //TODO: how to load user data when directly browse other pages ?
    axios({
      withCredentials:true,
      baseURL:"http://localhost:8080/",
      method: "get",
      url: "/UserAccount/",
      responseType:"json",
    }).then(response => {
      if(response.data.loginSuccess){
        store.dispatch(loginWithUserInfo(response.data.userData))
        console.log("load user Data")
      }else{
        console.log(response.data.errorInfo)
      }
    })
  }

  render () {
    return (
      <Provider store={store}>
        <div className={'BookStorePage'}>
          <NavigationBar loginSuccess={store.getState().isLogin}/>
          {this.props.children}
          <Footer/>
        </div>
      </Provider>
    )
  }
}

export default BookStore