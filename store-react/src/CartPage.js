import React, { Component } from 'react'
import { loadCartFromBackend } from './actions/BooksAction'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Paper } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import coverImg from './img/covers/7.png'
import axios from 'axios'
import MySnackBar from './Components/MySnackBar'

axios.defaults.withCredentials = true

class Tab extends Component {
  render () {
    return (
      <div className="container mb-1">
        <Paper className="d-flex py-3" elevation={2}>
          <div className="mx-auto">购物车</div>
        </Paper>
      </div>
    )
  }
}

class EmptyCartMsg extends Component {
  render () {
    return (
      <div className="container mb-1">
        <Paper className="d-flex py-3" elevation={2}>
          <div className="mx-auto">购物车空空如也，去逛逛吧</div>
        </Paper>
      </div>
    )
  }
}

class OrderTab extends Component {
  render () {
    return (
      <div className="container mb-1">
        <Paper className="d-flex py-3" elevation={2}>
          <div className="ml-auto mr-2 my-auto"> 总计 {this.props.totalNum} 本, ￥{this.props.totalPrice}元</div>
          <button className="btn btn-dark  mr-4" onClick={this.props.onOrder}> 下单</button>
        </Paper>
      </div>
    )
  }
}

class CartCard extends Component {
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
            <div className="bookPrice text-right">￥{this.props.bookPrice}</div>
            {inCartSignal}
            <button className="btn btn-outline-dark mr-2" onClick={this.props.onDelete}> -</button>
            <button className="btn btn-outline-dark ml-auto" onClick={this.props.onAdd}> +</button>
          </div>
        </Paper>
      </div>
    )
  }
}

class CartPageRaw extends Component {
  state = {
    bookNameFilter: "",
    snackBarState:{
      open : false,
      variant:"info"
    }
  }
closeSnackBar = ()=>{
  this.setState({
    snackBarState:{
      open:false,
      variant:"info"
    }
  })
}
openSnackBar = (newState) =>{
  this.setState({
    snackBarState:{
      open : true,
      message : newState.message,
      variant: newState.variant,
    }
  })
}


  componentWillMount () {
    if (!this.props.userInfo.isLogin) {
      this.openSnackBar({
        variant: "warning",
        message: "please Login first! going to Login Page"
      })
      this.props.history.push('./LoginPage')
    }
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
  onRemoveFromCart = (bookID) => {
    axios({
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)],
      baseURL: 'http://localhost:8080/',
      method: 'post',
      data: {
        bookID: bookID,
        action: 'remove',
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
  makeOrder = () => {
    window.confirm("确定要下单吗？");
    axios({
      headers: {
        'Content-Type': 'application/json'
      },
      baseURL: 'http://localhost:8080/',
      method: 'put',
      url: '/UserCart/',
      responseType: 'json'
    }).then(response => {
      console.log(response)
      this.props.onCartChange(response.data.items)
    })
  }

  render () {
    let totalNum = 0, totalPrice = 0
    let inCartBooks = null
    if (this.props.userCart.length !== 0) {
      inCartBooks = this.props.userCart.map(book => {
        const bookInfo = this.props.books.find(bookData => {
          return bookData.bookID === book.bookID && book.number > 0
        })
        if (bookInfo !== undefined) {
          totalNum += book.number
          totalPrice += book.number * bookInfo.bookInfo.bookPrice
          const coverUrl = bookInfo.bookInfo.bookCoverUrl === "" ?  "http://localhost:8080/BooksList/bookCover?bookID="+ bookInfo.bookID : bookInfo.bookInfo.bookCoverUrl;
          return (
            <CartCard key={book.bookID}
                      bookName={bookInfo.bookInfo.bookName}
                      coverUrl={coverUrl}
                      bookISBN={bookInfo.bookInfo.bookISBN}
                      bookPrice={bookInfo.bookInfo.bookPrice}
                      authorName={bookInfo.bookInfo.bookAuthor}
                      bookDesc={bookInfo.bookInfo.bookDesc}
                      bookStorage={bookInfo.bookStorage}
                      onAdd={() => {
                        this.onAddToCart(book.bookID)
                      }}
                      onDelete={() => {
                        this.onRemoveFromCart(book.bookID)
                      }}
                      numberInCart={book.number}
            />
          )
        }
      })
    }
    const notEmptyCart = <div>
      {inCartBooks}
      <OrderTab totalNum={totalNum}
                totalPrice={totalPrice}
                onOrder={this.makeOrder}
      />
    </div>
    const bookCartDisplay = inCartBooks === null ? <EmptyCartMsg/> : notEmptyCart
    const state = this.state
    return (
      <div className="mainColumn flex-column">
        <Tab/>
        {bookCartDisplay}
        <MySnackBar       open={state.snackBarState.open}
                          message ={state.snackBarState.message}
                          handleClose={this.closeSnackBar}
                          variant={state.snackBarState.variant}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userCart: state.userCart,
    userInfo: state.userInfo,
    books: state.books
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onCartChange: cart => {
      dispatch(loadCartFromBackend(cart))
    }
  }
}

const CartPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(CartPageRaw)

export default withRouter(CartPage)