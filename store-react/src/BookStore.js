import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {storeApp, initialState} from './reducers/reducer.js'
import NavigationBar from './NavigationBar.js'

class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <p>&copy; Zhao Xuyang 2019</p>
      </footer>
    )
  }
}

let store = createStore(storeApp,initialState)

class BookStore extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    console.log(store.getState().books);
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