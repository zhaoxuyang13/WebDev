import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import BookStore from './BookStore.js'
import HomePage from './HomePage'
import BooksPage from './BooksPage'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'
import AdminPage from './AdminPage'
import CartPage from './CartPage'

class MainRouter extends Component {
  render () {
    return (
      <div className={'MainRouter'}>
        <Router>
          <BookStore>
            <Route path="/" exact component={HomePage}/>
            <Route path="/CartPage" exact component={CartPage}/>
            <Route path="/BooksPage" exact component={BooksPage}/>
            <Route path="/LoginPage" exact component={LoginPage}/>
            <Route path="/SignUpPage" exact component={SignUpPage}/>
            <Route path="/AdminPage" exact component={AdminPage}/>
          </BookStore>
        </Router>
      </div>
    )
  }
}

export default MainRouter