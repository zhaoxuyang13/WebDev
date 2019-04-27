import React, { Component } from 'react'
import axios from 'axios'

import {
  ColumnChooser,
  DragDropProvider,
  Grid,
  SearchPanel,
  Table,
  TableColumnReordering,
  TableColumnResizing,
  TableColumnVisibility,
  TableEditColumn,
  TableEditRow,
  TableFixedColumns,
  TableHeaderRow,
  TableSummaryRow,
  Toolbar
} from '@devexpress/dx-react-grid-material-ui'
import {
  DataTypeProvider,
  EditingState,
  IntegratedFiltering,
  IntegratedSorting,
  IntegratedSummary,
  SearchState,
  SortingState,
  SummaryState
} from '@devexpress/dx-react-grid'
import Paper from '@material-ui/core/Paper'
import Select from '@material-ui/core/Select'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'

const UserAuthFormatter = ({ value }) => <Chip label={value}/>

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

const getRowId = row => row.id

const UserAuthEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input/>}
    value={value}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }}
  >
    <MenuItem value="admin">
      admin
    </MenuItem>
    <MenuItem value="user">
      user
    </MenuItem>
    <MenuItem value="banned">
      banned
    </MenuItem>
  </Select>
)
const UserAuthProvider = props => (
  <DataTypeProvider
    formatterComponent={UserAuthFormatter}
    editorComponent={UserAuthEditor}
    {...props}
  />
)

const formatlessSummaryTypes = ['Admin', 'User', 'Banned']
const messages = {
  Admin: 'Admins',
  User: 'Users',
  Banned: 'Banned Users'
}
const summaryCalc = (type, rows, getValue) => {
  if (type === 'Admin') {
    return rows.filter(row => getValue(row) === 'admin').length
  }
  if (type === 'User') {
    return rows.filter(row => getValue(row) === 'user').length
  }
  if (type === 'Banned') {
    return rows.filter(row => getValue(row) === 'banned').length
  }
  return IntegratedSummary.defaultCalculator(type, rows, getValue)
}

class UserManage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { name: 'userID', title: 'ID' },
        { name: 'username', title: '用户名' },
        { name: 'email', title: '邮箱' },
        { name: 'userAuth', title: '用户权限' },
        { name: 'password', title: '密码' }
      ],
      tableColumnExtensions: [
        { columnName: 'userID', width: 80, align: 'right' },
        { columnName: 'username', width: 150 },
        { columnName: 'userAuth', width: 100 },
        { columnName: 'email', width: 200 },
        { columnName: 'password', width: 200 }
      ],
      defaultColumnWidth: [
        { columnName: 'userID', width: 80 },
        { columnName: 'username', width: 150 },
        { columnName: 'userAuth', width: 100 },
        { columnName: 'email', width: 200 },
        { columnName: 'password', width: 200 }
      ],
      editingStateColumnExtensions: [
        { columnName: 'userID', editingEnabled: false }
      ],
      columnOrder: ['userID', 'username', 'email', 'userAuth', 'password'],
      userAuthColumns: ['userAuth'],
      rows: [],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      leftFixedColumns: [TableEditColumn.COLUMN_TYPE],
      totalSummaryItems: [
        { columnName: 'userAuth', type: 'Admin' },
        { columnName: 'userAuth', type: 'User' },
        { columnName: 'userAuth', type: 'Banned' }
      ],
      hiddenColumnNames: ['password']
    }
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order })
    }
    this.changeSorting = sorting => this.setState({ sorting })
    this.hiddenColumnNamesChange = (hiddenColumnNames) => {
      this.setState({ hiddenColumnNames })
    }
  }

  componentWillMount () {
    this.fetch()
  }

  handleResponse = (response) => {
    console.log(response)
    const dataWithKey = []
    for (let i = 0; i < response.data.length; i++) {
      dataWithKey.push({
        id: i,
        userID: response.data[i].userID,
        username: response.data[i].username,
        email: response.data[i].email,
        userAuth: response.data[i].userAuth,
        password: response.data[i].password
      })
    }
    this.setState({
      rows: dataWithKey
    })
  }
  fetch = () => {
    this.setState({
      loading: true
    })
    axios({
      baseURL: 'http://localhost:8080/',
      method: 'get',
      url: '/UserList/',
      responseType: 'json'
    }).then(this.handleResponse)
  }
  emitRequest = (operation, data) => {
    axios({
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => JSON.stringify(data)],
      baseURL: 'http://localhost:8080/',
      method: 'post',
      data: {
        operation: operation,
        userData: data
      },
      url: '/UserList/',
      responseType: 'json'
    }).then(this.handleResponse)
  }
  commitChanges = ({ added, changed, deleted }) => {
    let { rows } = this.state
    if (added) {
      console.log(added)
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
      console.log(changed[ndx])
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
    const { rows, editingStateColumnExtensions, columns, columnOrder, defaultColumnWidth, leftFixedColumns, sorting, totalSummaryItems, tableColumnExtensions, userAuthColumns, hiddenColumnNames } = this.state
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
          <IntegratedSummary
            calculator={summaryCalc}
          />
          <UserAuthProvider
            for={userAuthColumns}
          />
          <DragDropProvider/>
          <Table
            columnExtensions={tableColumnExtensions}
          />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidth}/>
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow showSortingControls/>
          <TableColumnVisibility
            hiddenColumnNames={hiddenColumnNames}
            onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
          />
          <TableEditRow/>
          <TableEditColumn
            width={170}
            showAddCommand
            showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />
          <TableSummaryRow
            formatlessSummaryTypes={formatlessSummaryTypes}
            messages={messages}
          />
          <TableFixedColumns
            leftColumns={leftFixedColumns}
          />
          <Toolbar/>
          <ColumnChooser/>
          <SearchPanel/>
        </Grid>
      </Paper>
    )
  }
}

export default UserManage