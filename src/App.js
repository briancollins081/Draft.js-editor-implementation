import React, { useRef, useState } from 'react';

import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';


import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
// for testing
import mentions from './EditorData/mentions';

import './App.css';
import './EditorStyles/editorStyles.css'
import './EditorStyles/linkStyles.css';
import './EditorStyles/mentionStyles.css';
// Draft constants
const linkifyPlugin = createLinkifyPlugin({
  theme: {
    link: "editor-link"
  }
});
const mentionsPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const { MentionSuggestions } = mentionsPlugin;

const App = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [suggestions, setSuggestions] = useState([]);

  const editor = useRef(null);

  //main editor functions
  const handleOnEditorChange = editorState => {
    setEditorState(editorState);
  }

  const handelKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleOnEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  const handleEditorFocus = () => {
    if (editor) {
      editor.current.focus();
    }
  };

  // editor plugins functions
  const handleMentionSearchChange = ({ value }) => {
    // console.log(value);
    setSuggestions(defaultSuggestionsFilter(value, mentions));

    fetch('./EditorData/mentions.json')
      .then((response) => {
        setTimeout(function () {
        }, 5000);
        return response.json();
      })
      .then((data) => {
        this.setState({
          suggestions: data,
        });
      });

  };

  const handleAddMention = () => {
    // get the mention object selected
  }


  const plugins = [linkifyPlugin, mentionsPlugin]
  // console.log({plugins});
  return (
    <div className="medium-container content-section">
      <header className="vertical-center">
        <h1>Draft.js Editor</h1>
      </header>
      <hr />
      <div className="editor-section">
        <h4 className="text-center">Editing</h4>
        <div className="editor-wrapper editor" onClick={handleEditorFocus}>
          <Editor
            editorState={editorState}
            onChange={handleOnEditorChange}
            handleKeyCommand={handelKeyCommand}
            plugins={plugins}
            ref={editor}
          />
          <MentionSuggestions
            onSearchChange={handleMentionSearchChange}
            suggestions={suggestions}
          // onAddMention={handleAddMention}
          />
        </div>
      </div>
    </div>
  );
}
export default App

/* // export default App;
import React, { useState, useRef } from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import mentions from "./EditorData/mentions"

// Draft-JS-Mentions plugin configuration
const mentionPlugin = createMentionPlugin()
const { MentionSuggestions } = mentionPlugin
const plugins = [mentionPlugin]

const App= () => {
    const [suggestions, setSuggestions] = useState(mentions)

    // Draft-JS editor configuration
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    )
    const editor = useRef(null)

    // Check editor text for mentions
    const onSearchChange = ({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions))
    }

    const onAddMention = () => {

    }

    // Focus on editor window
    const focusEditor = () => {
        editor.current.focus()
    }

    return (
            <div onClick={() => focusEditor()}>
                <Editor
                    ref={editor}
                    editorState={editorState}
                    plugins={plugins}
                    onChange={editorState => setEditorState(editorState)}
                    placeholder={'Type here...'}
                />
                <MentionSuggestions
                    onSearchChange={onSearchChange}
                    suggestions={suggestions}
                    onAddMention={onAddMention}
                />
            </div>
    )
}

export default App;
 */