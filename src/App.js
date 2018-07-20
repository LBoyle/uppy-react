import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Uppy = require('@uppy/core');
const DragDrop = require('@uppy/drag-drop');
const ProgressBar = require('@uppy/progress-bar');
const Tus = require('@uppy/tus');

const uppyOne = new Uppy({ debug: true, autoProceed: false });

uppyOne.on('complete', (result) => {
  console.log(result);
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uppyPreviews: []
    };
    this.uploadFile = this.uploadFile.bind(this);
    this.addFileToState = this.addFileToState.bind(this);
  }
  componentDidMount() {
    const addFileToState = this.addFileToState;

    uppyOne
      .use(DragDrop, { target: '#UppyOne' })
      // .use(Tus, { endpoint: '//master.tus.io/files/' })
      .use(ProgressBar, { target: '#UppyOne-Progress', hideAfterFinish: false });

    uppyOne.on('file-added', (file) => {
      console.log('Added file', file);
      const reader = new FileReader();
      reader.onload = function (readerEvt) {
        var binaryString = readerEvt.target.result;
        addFileToState({ file: file, base64: binaryString });
      };
      reader.readAsDataURL(file.data);
    });

  }
  addFileToState({ file, base64 }) {
    this.setState({ uppyPreviews: [{ file: file, base64: base64 }, ...this.state.uppyPreviews] });
  }
  uploadFile() {
    console.log(this.state.uppyPreviews);
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
          <button onClick={this.uploadFile}>Upload</button>
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
