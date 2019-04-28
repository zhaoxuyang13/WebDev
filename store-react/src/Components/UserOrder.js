import React, { Component } from 'react'
import axios from 'axios'

import {
  DragDropProvider,
  Grid,
  SearchPanel,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableHeaderRow, TableRowDetail,
  TableSummaryRow,
  Toolbar,
  VirtualTable
} from '@devexpress/dx-react-grid-material-ui'
import {
  IntegratedFiltering,
  IntegratedSorting,
  IntegratedSummary, RowDetailState,
  SearchState,
  SortingState,
  SummaryState
} from '@devexpress/dx-react-grid'
import Paper from '@material-ui/core/Paper'


const Cell = (props) => {
  return <Table.Cell {...props} />
}

const getRowId = row => row.id
const orderTableColumns =[
    { name: 'bookID', title: 'bookID' },
    { name: "bookName", title: "书名"},
    { name: 'bookNum', title: '数量' },
    { name: 'price', title: '购买单价' },
]
const OrderTable = ({row})=>(
  <Paper>
    <Grid
      rows={row.orderItems}
      columns={orderTableColumns}
    >
      <Table />
      <TableHeaderRow />
    </Grid>
  </Paper>
)

class UserOrder extends Component {

  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { name: 'orderID', title: '订单号' },
        { name: 'orderTime', title: '下单时间' },
        { name : "orderSum", title: "总金额"}
      ],
      columnOrder: ['orderID','orderTime',"orderSum"],
      tableColumnExtensions: [
        { columnName: 'orderID', width: 100, align: 'right' },
        { columnName: 'orderTime', width: 250 },
        { columnName: 'orderSum', width: 100, align: 'right' },
      ],
      rows: [],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      defaultColumnWidth: [
        { columnName: 'orderID', width: 100 },
        { columnName: 'orderTime', width: 250 },
        { columnName: 'orderSum', width: 100, },
      ]
    }
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order })
    }
    this.changeSorting = sorting => this.setState({ sorting })
  }

  componentWillMount () {
    this.fetch()
  }
  fetch = () => {
    this.setState({
      loading: true
    })
    axios({
      params:{
        userID:this.props.userID
      },
      withCredentials:true,
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/Order/User',
      responseType: 'json'
    }).then(this.handleResponse)
  }
  handleResponse = (response) => {
    const orderWithKey = []
    for (let i = 0; i < response.data.length; i++) {
      let orderSum = 0;
      response.data[i].orderItems.forEach(item => orderSum += item.price * item.bookNum);
      let orderItemWithBookInfo = response.data[i].orderItems.map((item)=> {
          console.log(item)
          let book = this.props.bookList.find(book => book.bookID === item.bookID);
          if (book !== undefined) {
            let bookInfo = book.bookInfo;
            return Object.assign({}, item, {
              bookName: bookInfo.bookName,
              bookISBN: bookInfo.bookISBN,
              bookAuthor: bookInfo.bookAuthor,
            });
          }else return item;
        }
      );
      orderWithKey.push({
        id:i,
        orderID:response.data[i].order.orderID,
        orderTime:response.data[i].order.orderTime,
        orderItems:orderItemWithBookInfo,
        orderSum: orderSum
      })
    }
    this.setState({
      rows: orderWithKey
    })
  }

  render () {
    const { rows, columns, columnOrder, sorting,  defaultColumnWidth, tableColumnExtensions } = this.state
    return (
      <Paper className="mb-2">
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <SearchState defaultValue={''}/>
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <RowDetailState/>
          <IntegratedSorting/>
          <IntegratedFiltering/>

          <DragDropProvider/>
          <VirtualTable
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableRowDetail
            contentComponent={OrderTable}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidth}/>
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls/>
          <Toolbar/>
          <SearchPanel/>
        </Grid>
      </Paper>
    )
  }
}

export default UserOrder;