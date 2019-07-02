import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  DragDropProvider,
  Grid, SearchPanel,
  Table, TableColumnReordering, TableColumnResizing,
  TableHeaderRow, TableRowDetail, TableSummaryRow, Toolbar, VirtualTable
} from '@devexpress/dx-react-grid-material-ui'
import DateAndTimePickers from "./DateTimePicker"
import axios from 'axios'
import {
  IntegratedFiltering,
  IntegratedSorting, IntegratedSummary,
  RowDetailState,
  SearchState,
  SortingState, SummaryState
} from '@devexpress/dx-react-grid'



const summaryCalculator = (type, rows, getValue) => {
  if(type === "countOrder"){
    return rows.length;
  }
  if(type ==="countBook"){
    let counter = 0;
    rows.map(row=>{
      row.orderItems.map(item =>{
        counter += item.bookNum;
      })
    })
    return counter;
  }

  return IntegratedSummary.defaultCalculator(type, rows, getValue);
};

const messages = {
  countOrder:"订单数",
  countBook:"书本数",
};
const orderTableColumns =[
  { name: 'orderTime', title: '订单时间' },
  { name: "bookNum", title: "书本数"},
  { name: 'totalPrice', title: '总价' },
]
const OrderTable = ({row})=>(
  <Paper>
    <Grid
      rows={row.orders}
      columns={orderTableColumns}
    >
      <Table />
      <TableHeaderRow />
    </Grid>
  </Paper>
)



export default class AdminSumForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pickerSet:{
        start:false,
        end:false,
        startTime:null,
        endTime :null,
      },
      columns: [
        { name: 'userID', title: 'ID' },
        { name: 'userName', title: '用户名' },
        { name: "totalOrders",title: '总订单数'},
        { name: "totalBooks",title: '总书本数'},
        { name : "total", title: "总额"}
      ],
      columnOrder: ['userID','userName','totalOrders',"totalBooks",'total'],
      tableColumnExtensions: [
        { columnName: 'total',align: 'right' },
      ],
      rows: [],
      sorting: [],
      rowChanges: {},
      defaultColumnWidth: [
        { columnName: 'userID', width: 100 },
        { columnName: 'userName', width: 250 },
        { columnName: 'totalOrders', width: 100, },
        { columnName: 'totalBooks', width: 100, },
        { columnName: 'total', width: 200, },
      ],
      totalSummaryItems:[
        {columnName:"totalOrders",type:"sum"},
        {columnName:"totalBooks",type:"sum"},
        {columnName:"total",type:"sum"},
      ],

    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order })
    }
    this.changeSorting = sorting => this.setState({ sorting })
  }

  onStartPick = (time)=>{
    this.setState((prevState,props)=>({
        pickerSet:{
          start:true,
          startTime:time,
          end: prevState.pickerSet.end,
          endTime:prevState.pickerSet.start,
        }
      })
    )
    this.checkAndSend();
  }
  onEndPick = (time)=>{
    this.setState((prevState,props)=>({
        pickerSet:{
          start:prevState.pickerSet.start,
          startTime:prevState.pickerSet.startTime,
          end: true,
          endTime:time,
        }
      })
    )
    this.checkAndSend();
  }
  checkAndSend = () =>{
    axios({
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)],
      withCredentials: true,
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/UserList/',
      responseType: 'json'
    }).then(response => {
      console.log(response)
      this.setState({
        userList: response.data
      });
    });
    setTimeout(()=> {
      const pickerSet = this.state.pickerSet;
      let startTime = new Date(pickerSet.startTime)
      let endTime = new Date(pickerSet.endTime);
      if (pickerSet.start && pickerSet.end){
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          transformRequest: [(data) => JSON.stringify(data)],
          data: {
            startTime:Date.parse(startTime)/1000,
            endTime:Date.parse(endTime)/1000
          },
          withCredentials: true,
          baseURL: 'http://localhost:8080/',
          method: 'post',
          url: '/Order/Time',
          responseType: 'json'
        }).then(this.handleResponse)
      }
    },0 )
  }
  handleResponse = (response) => {
    console.log(response)
    const userListWithSaleData = [];
    console.log(this.state.userList);
    this.state.userList.forEach(userItem =>{
      userListWithSaleData.push({
        userID: userItem.userID,
        userName: userItem.username,
        totalOrders:0,
        total:0,
        totalBooks:0,
        orders: [],
      });
    })
    console.log(userListWithSaleData);
    response.data.forEach(dataItem => {
      const userOrder = {
        orderTime: dataItem.order.orderTime,
        bookNum:0,
        totalPrice: 0,
      };
      dataItem.orderItems.forEach(orderItem=>{
         userOrder.bookNum += orderItem.bookNum;
         userOrder.totalPrice += orderItem.bookNum * orderItem.bookID * this.props.bookList.find(book => book.bookID === orderItem.bookID).bookInfo.bookPrice;
        });
      userListWithSaleData.find(user => user.userID === dataItem.order.userID).orders.push(userOrder);
    })
    console.log(userListWithSaleData);
    userListWithSaleData.forEach(userItem => {
      userItem.totalOrders = userItem.orders.length;
      userItem.orders.forEach(item => {
        userItem.total += item.totalPrice
        userItem.totalBooks += item.bookNum;
      })
    });
    this.setState({
      rows: userListWithSaleData,
    })
  }
  render() {
    const { rows, columns ,columnOrder, sorting,  defaultColumnWidth, tableColumnExtensions,totalSummaryItems} = this.state;

    return (
      <Paper>
        <Paper className="d-inline-flex container py-4 ">
          <div className="col-6"><DateAndTimePickers  label="开始时间" onChange={this.onStartPick}/></div>
          <div className="col-6"><DateAndTimePickers  label="结束时间" onChange={this.onEndPick}/></div>
        </Paper>
        <Grid
          rows={rows}
          columns={columns}
        >
          <SearchState defaultValue={''}/>
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <SummaryState
            totalItems={totalSummaryItems}
          />
          <RowDetailState/>
          <IntegratedSorting/>
          <IntegratedFiltering/>
          <IntegratedSummary
            calculator={summaryCalculator}
          />
          <DragDropProvider/>
          <VirtualTable
            columnExtensions={tableColumnExtensions}
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
          <TableSummaryRow
            messages={messages}
          />
          <Toolbar/>
          <SearchPanel/>
        </Grid>
      </Paper>
    );
  }
}