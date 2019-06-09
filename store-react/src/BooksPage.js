import React, { Component } from 'react'
import { Paper, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import coverImg from './img/covers/7.png'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { loadListToStore, loadCartFromBackend } from './actions/BooksAction'
import axios from 'axios'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button';
import MySnackBar from './Components/MySnackBar'
axios.defaults.withCredentials = true;

require('./css/styles1.css')
require('./css/bootstrap.min.css')
require('./css/bootstrap.min.css.map')
/*BookDetailPage*/
const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

/*BookCard*/
class BookCard extends Component {
  state = {
    open: false,
  }

  handleClick = () =>{
    this.setState({
      open:true,
    })
  }
  handleClose = () =>{
    this.setState({
      open:false
    })
  }
  render () {
    const inCartSignal = this.props.numberInCart > 0 ?  <div className="mb-2"> 购物车中 {this.props.numberInCart}本</div>  : <div/>;
    return (
      <div className="container ">
        <Paper className="d-flex bookCard" elevation={1} >
          <div className="bookCover col-2">
            <img src={this.props.coverUrl} alt="" style={{ width: '100%' }}/>
          </div>
          <div className="bookInfo col-6 p-0" onClick={this.handleClick}>
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
            <button className="btn btn-outline-dark" onClick={ this.props.onClick}> 加入购物车</button>
          </div>
        </Paper>
        <Dialog
          open={this.state.open}
          aria-labelledby="customized-dialog-title"
          onClose={this.handleClose}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={this.handleClose}>
            {this.props.bookName}
          </DialogTitle>
        <DialogContent>
          <div className="bookCover">
            <img src={this.props.coverUrl} alt="" style={{ width: '30%' }}/>
          </div>
          <Typography gutterBottom>
            作者 : {this.props.authorName}
          </Typography>
          <Typography gutterBottom>
            ISBN : {this.props.bookISBN}
          </Typography>
          <Typography gutterBottom>
            简介 : {this.props.bookDesc}
          </Typography>
          <Typography gutterBottom>
            书评: a good book
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={this.props.onClick} color="primary">
            加入购物车
          </Button>
        </DialogActions>
        </Dialog>
      </div>
    )
  }
}
/* End Of BookTab*/
class TabList extends Component {
  render () {
    return (
      <div className ="container mb-1" >
        <Paper className="d-flex py-3" elevation={2} >
          <div className="col-3 ">书名
            <input className="form-control mr-sm-2" type="text" placeholder="" aria-label="Search" id = "bookName" onChange={ () => {this.props.onChange(document.getElementById("bookName").value)}}/>
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
  constructor (props){
    super(props)
    this.state = {
      bookNameFilter: "",
      snackBarState:{
        open : false,
        variant:"info"
      }
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
  componentDidMount (){
    axios({
      baseURL:"http://localhost:8080/",
      method: "get",
      url: "/BooksList/",
      responseType:"json",
    }).then(response => {
          this.props.onLoadList(response.data);
      })
  }
  gotoLoginPage = () =>{
    this.props.history.push('./LoginPage')

  }
  haveMoreBooks = (bookID) =>{  // TODO:remove this feature to backend.
    let inCart = this.props.userCart.find(book=> bookID === book.bookID);
    let inStore = this.props.books.find(book=>bookID === book.bookID);
    let numberCart = inCart === undefined ? 0 : inCart.number;
    let numberStore = inStore.bookStorage;
    return numberCart >= numberStore;
  }
  onClickAdd =(bookID)=>{
    if(!this.props.isLogin) { // TODO: can admin add books to cart ??
      this.openSnackBar({
        variant: "warning",
        message: "please Login first! going to Login Page"
      })
      this.gotoLoginPage();
    }else if(this.haveMoreBooks(bookID)){   // if number in cart > number in storage
      this.openSnackBar({
        variant: "warning",
        message: "no more books in store! come back later."
      })
    } else {
      this.onAddToCart(bookID);
    }
  }
  handleChange = (value) =>{
    this.setState({
      bookNameFilter:value
    })
  }
  onAddToCart =(bookID)=>{
    axios({
      headers:{
        'Content-Type':'application/json'
      },
      transformRequest:[(data) => JSON.stringify(data)],
      baseURL:"http://localhost:8080/",
      method: "post",
      data: {
        bookID:bookID,
        action:"add",
        number:1
      },
      url: "/UserCart/",
      responseType:"json"
    }).then(response=>{
      console.log(response)
      this.props.onCartChange(response.data.items);
    })
    this.forceUpdate(); // TODO: how to do it without force ?
  }

  render () {
      const state = this.state
      const bookCards = this.props.books.map((book)=>{
      const filter = this.state.bookNameFilter;
      if(book.bookInfo.bookName.indexOf(filter) > -1) {
        const cartInfo = this.props.userCart.find(item =>  item.bookID === book.bookID);
        const numInCart = (cartInfo === undefined) ?  0 : cartInfo.number;
        const coverUrl = book.bookInfo.bookCoverUrl === "" ?  "http://localhost:8080/BooksList/bookCover?bookID="+book.bookID : book.bookInfo.bookCoverUrl;
        return (
          <div key={book.bookID}>
          <BookCard bookName={book.bookInfo.bookName}
                    coverUrl={coverUrl}
                    bookISBN={book.bookInfo.bookISBN}
                    bookPrice={book.bookInfo.bookPrice}
                    authorName={book.bookInfo.bookAuthor}
                    bookDesc={book.bookInfo.bookDesc}
                    bookStorage={book.bookStorage}
                    onClick={() => {
                      this.onClickAdd(book.bookID)
                    }}
                    numberInCart = {numInCart}
          />
          <MySnackBar       open={state.snackBarState.open}
                            message ={state.snackBarState.message}
                            handleClose={this.closeSnackBar}
                            variant={state.snackBarState.variant}
          />
          </div>
          )
      }
    })
    return (
      <div className="mainColumn flex-column">
        <TabList onChange ={this.handleChange}/>
        {bookCards}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    userCart : state.userCart,
    isLogin: state.userInfo.isLogin,
    books: state.books
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onLoadList: booksData=>{
      dispatch(loadListToStore(booksData))
    },
    onCartChange: cart=>{
      dispatch(loadCartFromBackend(cart))
    }
  }
}

const BooksPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksPageRaw)


export default withRouter(BooksPage)