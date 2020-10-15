import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './App.css';

class App extends React.Component {
  state = {
    editorState: EditorState.createEmpty()
  }
  handleOnEditorChange = editorState => {
    this.setState({
      editorState
    });
  }

  handelKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleOnEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
      <div className="medium-container content-section">
        <header className="vertical-center">
          <h1>Draft.js Editor</h1>
        </header>
        <hr />
        <div className="editor-section">
          <h4 className="text-center">Editing</h4>
          <div className="editor-wrapper">
            <Editor
              editorState={this.state.editorState}
              onChange={this.handleOnEditorChange}
              handleKeyCommand={this.handelKeyCommand} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
