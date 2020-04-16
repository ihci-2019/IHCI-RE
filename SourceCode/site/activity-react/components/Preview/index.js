import React, { Component, Fragment } from "react";
//import { Document, Page } from "react-pdf";
import FileViewer from 'react-file-viewer';
import "./style.scss";
export default class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1
    };
  }
  toClose() {
    console.log(this.props);
    //this.props.parent.closePreview(this)
  }
    onError(e) {
        console.log(e, 'error in file-viewer');
    }
  render() {
    //const { modalIsOpen } = this.state;
    console.log(this.props);
    let { type, url } = this.props;
    return (
      <Fragment>
        <div className="preview" onClick={this.props.onClose.bind(this)}>
          <div className="preview-container">
            {/* {type === "image" ? (
              <img className="image" src={url}></img>
            ) : (
              <div>
                <FileViewer
                  fileType={type}
                  filePath={url}
                  onError={this.onError}
                />
              </div>
            )} */}
            <FileViewer
                  fileType={type}
                  filePath={url}
                  onError={this.onError}
                />
          </div>
        </div>
      </Fragment>
    );
  }
}
