import React, { useRef, useState } from 'react';
import Axios from 'axios';

import { EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createHashtagPlugin from 'draft-js-hashtag-plugin';

import 'draft-js/dist/Draft.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-hashtag-plugin/lib/plugin.css';
// for testing
import mentions from './EditorData/mentions';

import './App.css';
import './EditorStyles/editorStyles.css'
import './EditorStyles/linkStyles.css';
import './EditorStyles/mentionStyles.css';
import './EditorStyles/hashtagStyles.css';
// Draft constants
const linkifyPlugin = createLinkifyPlugin({
  theme: {
    link: "editor-link"
  }
});

const positionSuggestions = ({ state, props }) => {
  let transform;
  let transition;

  if (state.isActive && props.suggestions.length > 0) {
    transform = 'scaleY(1)';
    transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
  } else if (state.isActive) {
    transform = 'scaleY(0)';
    transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
  }

  return {
    transform,
    transition,
  };
};
const Entry = (props) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line no-unused-vars
    isFocused, // eslint-disable-line no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.avatar}
            className={theme.mentionSuggestionsEntryAvatar}
            role="presentation"
            alt=""
          />
        </div>

        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div className={theme.mentionSuggestionsEntryText}>
            {mention.name}
          </div>

          <div className={theme.mentionSuggestionsEntryTitle}>
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
};
const mentionsPlugin = createMentionPlugin({
  entityMutability: 'IMMUTABLE',
  theme: {
    mention: 'mention',
    mentionSuggestions: 'mentionSuggestions',
    mentionSuggestionsEntryContainer: 'mentionSuggestionsEntryContainer',
    mentionSuggestionsEntryContainerLeft: 'mentionSuggestionsEntryContainerLeft',
    mentionSuggestionsEntryContainerRight: 'mentionSuggestionsEntryContainerRight',
    mentionSuggestionsEntry: 'mentionSuggestionsEntry',
    mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
    mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
    mentionSuggestionsEntryTitle: 'mentionSuggestionsEntryTitle',
    mentionSuggestionsEntryAvatar: 'mentionSuggestionsEntryAvatar'
  },
  positionSuggestions,
  mentionPrefix: '@',
  supportWhitespace: true
});
const { MentionSuggestions } = mentionsPlugin;

const hashtagPlugin = createHashtagPlugin({
  theme: {
    hashtag: 'hashtag'
  }
});


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

    // fetch('./EditorData/mentions.json')
    //   .then((response) => {

    //     return response.json();
    //   })
    //   .then((data) => {
    //     this.setState({
    //       suggestions: data,
    //     });
    //   });
    Axios.get('http://127.0.0.1:4010/api/user/mentions', {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InByb2ZpbGVwaWN0dXJlIjoiaHR0cHM6Ly90d2FhLnMzLmZyLXBhci5zY3cuY2xvdWQvcHJvZmlsZXBpY3R1cmVzL3Byb2ZpbGVfV0o3MFVoTHk3eFQwRi5qcGciLCJpZCI6MzQ4LCJ1c2VybmFtZSI6IkV2ZXJsaW5lIEIiLCJ0d2FhdXNlcm5hbWUiOiJFdmVybGluZS5CIiwibW9iaWxlIjoiKzI1NDc5MTA2MTk0NCIsImVtYWlsIjoiYW5kZXJlYkBhZGFsYWJzYWZyaWNhLmNvbSIsImJpcnRoZGF5IjoiMjAyMC0wOC0yOSIsInN0YXR1cyI6MiwicmVnc3RhdHVzIjoxLCJyZWd0eXBlIjoxLCJkZWZhdWx0X2NhdGVnb3J5IjoxLCJ0d2FhSXRzIjozLCJwYXNzd29yZF9yZXNldF90b2tlbiI6Im51bGwiLCJwYXNzd29yZCI6IiQyYSQwOCRhaUN4aVp4dDQ1SU9tZ3h0SW1icC4ueUZPMDRJZTU5bEpLWHN0amRBVWVWbGY0aXlmRGt5RyIsImNyZWF0ZWRBdCI6IjIwMjAtMDgtMjhUMTc6Mjc6MTUuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDktMjhUMDg6NDE6MjIuMDAwWiIsIlJvbGVzIjpbeyJpZCI6NCwidHlwZSI6IkNPVU5TRUxPUiIsInVzZXJfcm9sZXMiOnsidXNlcklkIjozNDgsInJvbGVJZCI6NH19XX0sImlhdCI6MTYwMjc5MTkwNCwiZXhwIjoxNjEwNTY3OTA0fQ.5duYEYI1e9tw5OizCfW7qJ0jNUwHNR-D574SQao-V8s'
      }
    }).then(res => {
      if (res.data.success === true) {
        // setSuggestions(res.data.data)
        setSuggestions(defaultSuggestionsFilter(value, res.data.data));
      }
    }).catch(function (err) {
      // setSuggestions(mentions);
      // setSuggestions(defaultSuggestionsFilter(value, mentions));
    })

  };


  const handleAddMention = (m) => {
    // get the mention object selected
    // Send notification here
    console.log({ m });
  }



  const plugins = [linkifyPlugin, mentionsPlugin, hashtagPlugin]
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
            onAddMention={handleAddMention}
            entryComponent={Entry}
          />
        </div>
      </div>
    </div>
  );
}
export default App;