import React, { Component } from 'react'
import { Paper } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import coverImg from './img/covers/7.png'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { loadCartFromBackend, loadListToStore } from './actions/BooksAction'

import axios from 'axios'

axios.defaults.withCredentials = true

require('./css/styles1.css')
require('./css/bootstrap.min.css')
require('./css/bootstrap.min.css.map')

class BookCard extends Component {
  render () {
    const inCartSignal = this.props.numberInCart > 0 ? <div className="mb-2"> 购物车中 {this.props.numberInCart}本</div> :
      <div/>
    return (
      <div className="container ">
        <Paper className="d-flex bookCard" elevation={1}>
          <div className="bookCover col-2">
            <img src={this.props.coverUrl} alt="" style={{ width: '100%' }}/>
          </div>
          <div className="bookInfo col-6 p-0">
            <div className="bookName">
              {this.props.bookName}
            </div>
            <div>{this.props.authorName}</div>
            <Typography component="p" className="bookDesc">{this.props.bookDesc}</Typography>
          </div>
          <div className="bookOtherInfo flex-column ml-1">
            <div className="bookISBN">ISBN: {this.props.bookISBN}</div>
            <div className="bookStorage"> 库存: {this.props.bookStorage}</div>
          </div>
          <div className="bookOperation ml-auto mt-auto flex-column ">
            {inCartSignal}
            <div className="bookPrice text-right">￥{this.props.bookPrice}</div>
            <button className="btn btn-outline-dark" onClick={this.props.onClick}> 加入购物车</button>
          </div>
        </Paper>
      </div>
    )
  }
}

class TabList extends Component {
  render () {
    return (
      <div className="container mb-1">
        <Paper className="d-flex py-3" elevation={2}>
          <div className="col-3 ">书名
            <input className="form-control mr-sm-2" type="text" placeholder="" aria-label="Search" id="bookName"
                   onChange={() => {this.props.onChange(document.getElementById('bookName').value)}}/>
          </div>
          <div className="col-3 ">作者</div>
          <div className="col-3 ">ISBN</div>
          <div className="col-3 ">库存</div>
        </Paper>
      </div>
    )
  }
}

class BooksPageRaw extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bookNameFilter: ''
    }
  }

  componentDidMount () {
    axios({
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/BooksList/',
      responseType: 'json'
    }).then(response => {
      this.props.onLoadList(response.data)
    })
  }

  gotoLoginPage = () => {
    this.props.history.push('./LoginPage')

  }
  haveMoreBooks = (bookID) => {  // TODO:remove this feature to backend.
    let inCart = this.props.userCart.find(book => bookID === book.bookID)
    let inStore = this.props.books.find(book => bookID === book.bookID)
    let numberCart = inCart === undefined ? 0 : inCart.number
    let numberStore = inStore.bookStorage
    return numberCart >= numberStore
  }
  onClickAdd = (bookID) => {
    if (!this.props.isLogin) { // TODO: can admin add books to cart ??
      alert('please Login first! going to Login Page')
      this.gotoLoginPage()
    } else if (this.haveMoreBooks(bookID)) {   // if number in cart > number in storage
      alert('no more books in store! come back later.')
    } else {
      this.onAddToCart(bookID)
    }
  }
  handleChange = (value) => {
    this.setState({
      bookNameFilter: value
    })
  }
  onAddToCart = (bookID) => {
    axios({
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)],
      baseURL: 'http://localhost:8080/',
      method: 'post',
      data: {
        bookID: bookID,
        action: 'add',
        number: 1
      },
      url: '/UserCart/',
      responseType: 'json'
    }).then(response => {
      console.log(response)
      this.props.onCartChange(response.data.items)
    })
    this.forceUpdate() // TODO: how to do it without force ?
  }

  render () {
    const bookCards = this.props.books.map((book) => {
      const filter = this.state.bookNameFilter
      if (book.bookInfo.bookName.indexOf(filter) > -1) {
        const cartInfo = this.props.userCart.find(item => item.bookID === book.bookID)
        const numInCart = (cartInfo === undefined) ? 0 : cartInfo.number
        return (
          <BookCard key={book.bookID}
                    bookName={book.bookInfo.bookName}
                    coverUrl={coverImg}
                    bookISBN={book.bookInfo.bookISBN}
                    bookPrice={book.bookInfo.bookPrice}
                    authorName={book.bookInfo.bookAuthor}
                    bookDesc={book.bookInfo.bookDesc}
                    bookStorage={book.bookStorage}
                    onClick={() => {
                      this.onClickAdd(book.bookID)
                    }}
                    numberInCart={numInCart}
          />)
      }
    })
    return (
      <div className="mainColumn flex-column">
        <TabList onChange={this.handleChange}/>
        {bookCards}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userCart: state.userCart,
    isLogin: state.userInfo.isLogin,
    books: state.books
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLoadList: booksData => {
      dispatch(loadListToStore(booksData))
    },
    onCartChange: cart => {
      dispatch(loadCartFromBackend(cart))
    }
  }
}

const BooksPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksPageRaw)

export default withRouter(BooksPage)