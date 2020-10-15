import React from 'react';

import { EditorState, RichUtils } from 'draft-js';
import Editor  from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';

import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';



import './App.css';

// Draft constants
const linkifyPlugin = createLinkifyPlugin({
  component: (props) => (
    // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
    <a {...props} onClick={() => alert('Clicked on Link!')} />
  )
});
const plugins = [linkifyPlugin]

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
  handleEditorFocus = () => {
    this.editor.focus();
  };

  render() {
    return (
      <div className="medium-container content-section">
        <header className="vertical-center">
          <h1>Draft.js Editor</h1>
        </header>
        <hr />
        <div className="editor-section">
          <h4 className="text-center">Editing</h4>
          <div className="editor-wrapper" onClick={this.handleEditorFocus}>
            <Editor
              editorState={this.state.editorState}
              onChange={this.handleOnEditorChange}
              handleKeyCommand={this.handelKeyCommand}
              plugins={plugins}
              ref={(ref) => { this.editor = ref; }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
