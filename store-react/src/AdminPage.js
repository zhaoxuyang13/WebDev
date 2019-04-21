import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import MUIDataTable from 'mui-datatables'
import {
  SearchState,
  EditingState,
  IntegratedFiltering
}from '@devexpress/dx-react-grid'
import {
  Grid, Table, TableHeaderRow,
  Toolbar,SearchPanel,TableEditColumn,TableEditRow
} from '@devexpress/dx-react-grid-material-ui'

class Tab extends Component {
  render () {
    return (
      <div className ="mb-1" >
        <Paper className="d-flex py-3" elevation={2} >
          <div className="mx-auto">管理员</div>
        </Paper>
      </div>
    )
  }
}


class BookManage extends Component {

  constructor (props) {
    super(props)
    this.state={
      columns : [
        {
          name: "bookID",
          title: "ID",
        }, {
          name: "bookName",
          title: "书名",

        }, {
          name: "bookAuthor",
          title: "作者",

        }, {
          name: "bookISBN",
          title: "ISBN",

        }, {
          name: "bookStorage",
          title: "库存",
        }, {
          name: "bookPrice",
          title: "价格",
        }, {
          name: "bookDesc",
          title: "简介",

        },{
          name: "bookCoverUrl",
          title: "封面Url",
        },
      ],
      rows:[],
      editingStateColumnExtensions: [
        { columnName: 'bookID', editingEnabled: false },
      ],
    }
  }
  componentWillMount () {
    this.fetch();
  }
  fetch = ()=>{
    this.setState({
      loading: true
    });
    axios({
      baseURL:"http://localhost:8080/",
      method: "get",
      url: "/BooksList/",
      responseType:"json"
    }).then(response=>{
      console.log(response);
      const dataWithKey = [];
      for(let i = 0; i < response.data.length; i ++){
        dataWithKey.push({
          key: i,
          bookID : response.data[i].bookID,
          bookStorage: response.data[i].bookStorage,
          bookName: response.data[i].bookInfo.bookName,
          bookISBN: response.data[i].bookInfo.bookISBN,
          bookDesc: response.data[i].bookInfo.bookDesc,
          bookCoverUrl: response.data[i].bookInfo.bookCoverUrl,
          bookAuthor: response.data[i].bookInfo.bookAuthor,
          bookPrice : response.data[i].bookInfo.bookPrice,
        });
      }
      this.setState({
        rows: dataWithKey
      });
    })
  }
  emitRequest = (operation,data)=>{
    axios({
      headers:{
        'Content-Type':'application/json'
      },
      transformRequest:[(data) => JSON.stringify(data)],
      baseURL:"http://localhost:8080/",
      method: "post",
      data: {
        operation:operation,
        bookData:data
      },
      url: "/BooksList/",
      responseType:"json"
    }).then(response=>{
      console.log(response)
    })
  }
  commitChanges = ({ added, changed, deleted })=>{
    let { rows } = this.state;
    if (added) {
      console.log(added)
      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      rows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
      this.emitRequest("add",added[0]);
    }
    if (changed) {
      let ndx = -1;
      rows = rows.map((row,index) => (changed[index] ? { ...row, ...changed[ ndx = index] } : row));
      console.log(changed[ndx]);
      if(ndx !== -1)
        this.emitRequest("changed",rows[ndx]);
      else console.log("no change")
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      const deleteRow = rows[deleted];
      rows = rows.filter((row,index) => !deletedSet.has(index))
      this.emitRequest("delete",deleteRow);
    }
    this.setState({ rows });
  }
  render () {
    const {rows,editingStateColumnExtensions,columns} = this.state;
    return (
      <Paper className="mb-2">
        <Grid
          rows={rows}
          columns={columns}
        >
          <SearchState defaultValue={""}/>
          <EditingState
            onCommitChanges={this.commitChanges}
            columnExtensions={editingStateColumnExtensions}
            />
          <IntegratedFiltering/>
          <Table/>
          <TableHeaderRow/>
          <TableEditRow/>
          <TableEditColumn
            showAddCommand
            showEditCommand
            showDeleteCommand
          />
          <Toolbar/>
          <SearchPanel/>
        </Grid>
      </Paper>
    )
  }
}

class UserManage extends Component{
  render () {
    return (
      <MUIDataTable
        title={"用户管理"}

      />
    )
  }
}

class AdminPageRaw extends Component{

  /*
  componentWillMount () {
    if(!this.props.isAdmin) {
      alert("your are not admin , returning to home page")
      this.gotoHomePage();
    }
  }*/ //TODO: remove this

  gotoHomePage = ()=>{
    this.props.history.push('./');
  }
  render () {
    return(
      <div className="wideColumn flex-column container">
        <Tab/>
        <BookManage />
        <UserManage/>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    isAdmin: state.userInfo.isAdmin
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
const AdminPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPageRaw)


export default withRouter(AdminPage);