import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Uppy = require('@uppy/core');
const DragDrop = require('@uppy/drag-drop');
const ProgressBar = require('@uppy/progress-bar');
// const Tus = require('@uppy/tus');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uppyPreviews: []
    };

    this.uppyOne = new Uppy({ debug: true, autoProceed: false });
    this.reader = new FileReader();

    this.uploadFile = this.uploadFile.bind(this);
    this.addFileToState = this.addFileToState.bind(this);
  }

  componentDidMount() {
    this.uppyOne
      .use(DragDrop, { target: '#UppyOne' })
      // .use(Tus, { endpoint: '//master.tus.io/files/' })
      .use(ProgressBar, { target: '#UppyOne-Progress', hideAfterFinish: false });

    this.uppyOne.on('complete', (result) => {
      console.log(result);
    });

    this.uppyOne.on('file-added', (file) => {
      console.log('Added file', file);

      this.reader.onload = (readerEvt) =>
        this.addFileToState({ file, base64: readerEvt.target.result });
      // Define this onload every time to get file and base64 every time
      this.reader.readAsDataURL(file.data);
    });
    // couldn't figure a better solution on the spot
  }

  addFileToState({ file, base64 }) {
    this.setState({ uppyPreviews: [{ file, base64 }, ...this.state.uppyPreviews] });
  }

  uploadFile() {
    console.log(this.state.uppyPreviews);
    // this.uppyOne.upload();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Uppy</h1>
        </header>
        <div className="UppyContainer">
          <div id="UppyOne" />
          <div id="UppyOne-Progress" />
          <button onClick={this.uploadFile}>Log previews to console / Submit</button>
        </div>
        <div className="ImagePreviewContainer">
          {
            this.state.uppyPreviews.map(
              item => {
                return (
                  <object
                    key={item.file.id}
                    type={item.file.type}
                    width="200px"
                    height="auto"
                    data={item.base64}
                  >
                    {item.file.name}
                  </object>
                );
              }
            )
          }
        </div>
      </div>
    );
  }
}

export default App;

// type uppy_file_t = {
//   data: { /* File */
//     lastModified: float,
//     lastModifiedDate: Js.Date.t,
//     name: string,
//     size: float,
//     type: string,
//     webkitRelativePath: string,
//   },
//   extension: string,
//   id: string,
//   isRemote: bool,
//   meta: {
//     name: string,
//     type: string,
//   },
//   name: string,
//   preview: undefined,
//   progress: {
//     bytesTotal: float,
//     bytesUploaded: float,
//     percentage: int,
//     uploadComplete: bool,
//     uploadStarted: bool,
//   },
//   remote: string,
//   size: float,
//   source: string,
//   type: string,
// };

// type uppy_preview_t = {
//   file: uppy_file_t,
//   base64: string,
// };