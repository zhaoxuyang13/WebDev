import React, { Component } from 'react'
import { Paper } from '@material-ui/core'
import Typography from '../BooksPage'

class BookCard extends Component {
  render () {
    const inCartSignal = this.props.numberInCart > 0 ? <div className="mb-2"> 已加入购物车 {this.props.numberInCart}本</div> :
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

export default BookCard