import React, { Component } from 'react'
import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
import axios from 'axios'

export default class BookCoverCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      files: []
    };
  }

  handleClose() {
    this.setState({
      open: false
    });
  }
  handleresponse = (response) =>{
    console.log("sent but haven't checked response");
  }
  handleSave(files) {
    //Saving files to state for further use and closing Modal.
    if(files.length === 0) return;
    this.setState({
      files: files,
      open: false
    });
    setTimeout(() =>{
      console.log(files[0])
      let formdata = new FormData()
      formdata.append("bookID",this.props.row.bookID)
      formdata.append("file",files[0]);
      axios({
        withCredentials:true,
        baseURL: 'http://localhost:8080/',
        method: 'post',
        data: formdata,
        url: '/BooksList/bookCover',
        responseType: 'json'
      }).then(this.handleResponse)
    })
  }

  handleOpen() {
    this.setState({
      open: true,
    });

  }

  render() {
    return (
      <td>
        <Button onClick={this.handleOpen.bind(this)}>
          上传图片
        </Button>
        <DropzoneDialog
          open={this.state.open}
          onSave={this.handleSave.bind(this)}
          acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
          showPreviews={true}
          maxFileSize={5000000}
          onClose={this.handleClose.bind(this)}
        />
      </td>
    );
  }
}