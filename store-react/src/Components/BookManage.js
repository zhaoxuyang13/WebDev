import React, { Component } from 'react'
import axios from 'axios'

import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'

import {
  DragDropProvider,
  Grid,
  SearchPanel,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableEditColumn,
  TableEditRow,
  TableFixedColumns,
  TableHeaderRow,
  TableSummaryRow,
  Toolbar,
  VirtualTable
} from '@devexpress/dx-react-grid-material-ui'
import {
  EditingState,
  IntegratedFiltering,
  IntegratedSorting,
  IntegratedSummary,
  SearchState,
  SortingState,
  SummaryState
} from '@devexpress/dx-react-grid'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import BookCoverCell from './BookCoverCell'


const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
)

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon/>
  </IconButton>
)

const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute()
      }
    }}
    title="Delete row"
  >
    <DeleteIcon/>
  </IconButton>
)

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon/>
  </IconButton>
)

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon/>
  </IconButton>
)

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton
}

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id]
  return (
    <CommandButton
      onExecute={onExecute}
    />
  )
}

const Cell = (props) => {
  const {column} = props;
  if(column.name === 'bookCover'){
    return <BookCoverCell classname="my-auto p-0"{...props} />
  }
  return <Table.Cell {...props} />
}

const getRowId = row => row.id

class BookManage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { name: 'bookID', title: 'ID' },
        { name: 'bookName', title: '书名' },
        { name: 'bookAuthor', title: '作者' },
        { name: 'bookISBN', title: 'ISBN' },
        { name: 'bookStorage', title: '库存' },
        { name: 'bookPrice', title: '价格' },
        { name: 'bookDesc', title: '简介' },
        {name: 'bookCover', title: '封面'},
        { name: 'bookCoverUrl', title: '封面Url' }
      ],
      columnOrder: ['bookID', 'bookName', 'bookAuthor', 'bookISBN', 'bookStorage', 'bookPrice', 'bookDesc','bookCover', 'bookCoverUrl'],
      tableColumnExtensions: [
        { columnName: 'bookID', width: 50, align: 'right' },
      ],

      rows: [],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      pageSize: 0,
      pageSizes: [5, 10, 0],
      editingStateColumnExtensions: [
        { columnName: 'bookID', editingEnabled: false },
        { columnName: 'bookCover', editingEnabled: false }
      ],
      leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
      totalSummaryItems: [
        { columnName: 'bookStorage', type: 'sum' }
      ],
      defaultColumnWidth: [
        { columnName: 'bookID', width: 50 },
        { columnName: 'bookName', width: 150 },
        { columnName: 'bookAuthor', width: 100 },
        { columnName: 'bookISBN', width: 150 },
        { columnName: 'bookStorage', width: 80 },
        { columnName: 'bookPrice', width: 80 },
        { columnName: 'bookDesc', width: 200 },
        { columnName: 'bookCover', width: 100 },
        { columnName: 'bookCoverUrl', width: 100 }
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

  handleResponse = (response) => {
    const dataWithKey = []
    for (let i = 0; i < response.data.length; i++) {
      dataWithKey.push({
        id: i,
        bookID: response.data[i].bookID,
        bookStorage: response.data[i].bookStorage,
        bookName: response.data[i].bookInfo.bookName,
        bookISBN: response.data[i].bookInfo.bookISBN,
        bookAuthor: response.data[i].bookInfo.bookAuthor,
        bookDesc: response.data[i].bookInfo.bookDesc,
        bookCoverUrl: response.data[i].bookInfo.bookCoverUrl,
        bookPrice: response.data[i].bookInfo.bookPrice
      })
    }
    this.setState({
      rows: dataWithKey
    })
  }   //Code Reuse
  fetch = () => {
    this.setState({
      loading: true
    })
    axios({
      withCredentials:true,
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/BooksList/',
      responseType: 'json'
    }).then(this.handleResponse)
  }
  emitRequest = (operation, data) => {
    axios({
      withCredentials:true,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)],
      baseURL: 'http://localhost:8080/',
      method: 'post',
      data: {
        operation: operation,
        bookData: data
      },
      url: '/BooksList/',
      responseType: 'json'
    }).then(this.handleResponse)
  }
  commitChanges = ({ added, changed, deleted }) => {
    let { rows } = this.state
    if (added) {
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row
        }))
      ]
      this.emitRequest('add', added[0])
    }
    if (changed) {
      let ndx = -1
      rows = rows.map((row, index) => (changed[index] ? { ...row, ...changed[ndx = index] } : row))

      if (ndx !== -1)
        this.emitRequest('changed', rows[ndx])
      else console.log('no change')
    }
    if (deleted) {
      const deletedSet = new Set(deleted)
      const deleteRow = rows[deleted]
      rows = rows.filter((row, index) => !deletedSet.has(index))
      this.emitRequest('delete', deleteRow)
    }
    this.setState({ rows })
  }

  render () {
    const { rows, editingStateColumnExtensions, columns, columnOrder, leftFixedColumns, sorting, totalSummaryItems, defaultColumnWidth, tableColumnExtensions } = this.state
    return (
      <Paper className="mb-2">
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <SearchState defaultValue={''}/>
          <EditingState
            onCommitChanges={this.commitChanges}
            columnExtensions={editingStateColumnExtensions}
          />
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <SummaryState
            totalItems={totalSummaryItems}
          />

          <IntegratedSorting/>
          <IntegratedFiltering/>
          <IntegratedSummary/>

          <DragDropProvider/>
          <VirtualTable
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidth}/>
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls/>
          <TableSummaryRow/>
          <TableEditRow/>
          <TableEditColumn
            width={170}
            showAddCommand
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <TableFixedColumns
            leftColumns={leftFixedColumns}
          />
          <Toolbar/>
          <SearchPanel/>
        </Grid>
      </Paper>
    )
  }
}

export default BookManage