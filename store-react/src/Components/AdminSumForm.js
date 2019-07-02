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
        { name: 'bookID', title: 'ID' },
        { name: 'bookName', title: '书名' },
        { name : "bookPrice", title: "单价"},
        { name : "sales", title: "销量"},
        { name : "total", title: "总额"}
      ],
      columnOrder: ['bookID','bookName',"bookPrice","sales","total"],
      tableColumnExtensions: [
        { columnName: 'total',align: 'right' },
      ],
      rows: [],
      sorting: [],
      rowChanges: {},
      defaultColumnWidth: [
        { columnName: 'bookID', width: 100 },
        { columnName: 'bookName', width: 250 },
        { columnName: 'bookPrice', width: 100, },
        { columnName: 'sales', width: 200, },
        { columnName: 'total', width: 200, },
      ],
      totalSummaryItems:[
        {columnName:"total",type:"sum"},
        {columnName:"sales",type:"sum"},
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
          url: '/Order/Time',
          responseType: 'json'
        }).then(this.handleResponse)
      }
    },0 )
  }
  handleResponse = (response) => {
    console.log(response)
    const bookListWithSaleData = [];
    this.props.bookList.forEach(item =>{
      const listItem = {
        id:item.bookID,
        bookID: item.bookID,
        bookName: item.bookInfo.bookName,
        bookPrice: item.bookInfo.bookPrice,
        sales: 0,
        total: 0,
      }
      bookListWithSaleData.push(listItem);
    })
    console.log(bookListWithSaleData);
    for (let i = 0; i < response.data.length; i++) {
      response.data[i].orderItems.forEach(item => {
        bookListWithSaleData.find(listItem => listItem.bookID === item.bookID).sales += item.bookNum;
      })
    }
    console.log(bookListWithSaleData)
    bookListWithSaleData.forEach(item => {
      item.total = item.sales*item.bookPrice;
    })
    this.setState({
      rows: bookListWithSaleData
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