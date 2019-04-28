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

export default class UserSumForm extends React.PureComponent {
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
      ],
      totalSummaryItems:[
        {columnName:'orderID',type:"countOrder"},
        {columnName:'orderID',type:"countBook"},
        {columnName:"orderSum",type:"sum"},
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
    setTimeout(()=> {
      const pickerSet = this.state.pickerSet;
      console.log(pickerSet);
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
          url: '/Order/UserAndTime',
          responseType: 'json'
        }).then(this.handleResponse)
      }
    },0 )
  }
  handleResponse = (response) => {
    console.log(response)
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