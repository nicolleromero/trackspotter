import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StackTrace from 'stacktrace-js';

const INITIAL_TIME = getTimestamp(); // Time upon load

function getTimestamp() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return today.toUTCString();
}

function useHistoryActionStack() {
  const history = useHistory();
  const [actionStack, setActionStack] = useState(() => [{
    action: 'INITIAL',
    location: history.location,
    timestamp: INITIAL_TIME,
  }]);

  useEffect(() => {
    return history.listen((location, action) => {
      StackTrace.get()
        .then((stackTrace) => {
          setActionStack((stack) => [...stack, { action, location, timestamp: getTimestamp(), stackTrace }])
        })
        .catch((err) => console.error(err))
    })
  }, [history]);

  return actionStack;
}

export function RouterHistory() {
  const history = useHistory();
  const actionStack = useHistoryActionStack();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userUrl, setUserUrl] = useState('');

  function handleSubmitURL(event) {
    event.preventDefault();

    if (userUrl === history.location.pathname) { // Make action a dropdown
      history.replace(userUrl);
    } else {
      history.push(userUrl);
    }

    console.log("history", history);
    setUserUrl('');
  }

  console.log("actionStack", actionStack);
  console.log("selectedIndex", selectedIndex);


  // The history object has the following properties and methods:

  // length - (number) The number of entries in the history stack
  // action - (string) The current action (PUSH, REPLACE, or POP)
  // location - (object) The current location. May have the following properties:
  // pathname - (string) The path of the URL
  // search - (string) The URL query string
  // hash - (string) The URL hash fragment
  // state - (object) location-specific state that was provided to e.g. push(path, state) when this location was pushed onto the stack. Only available in browser and memory history.
  // push(path, [state]) - (function) Pushes a new entry onto the history stack
  // replace(path, [state]) - (function) Replaces the current entry on the history stack
  // go(n) - (function) Moves the pointer in the history stack by n entries
  // goBack() - (function) Equivalent to go(-1)
  // goForward() - (function) Equivalent to go(1)
  // block(prompt) - (function) Prevents navigation

  return (
    <div className="row debugger border fixed-bottom">
      <div className="column">
        <div className="debugger tableFixHead" expand="lg" bg="dark" variant="dark">
          <table className="debugger-table gray-border">
            <thead className="sticky">
              <tr>
                <th>Pathname</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {actionStack.map((item, index) => {
                return (
                  <tr>
                    <td>
                      <button
                        value={index}
                        className="debugger-btn"
                        onClick={() => setSelectedIndex(index)}
                      >
                        {item.location.pathname}
                      </button>
                    </td>
                    <td>{item.action}</td>
                    <td>{item.timestamp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="column">
        <div className="debugger tableFixHead" expand="lg" bg="dark" variant="dark">
          <div>
            <form
              onSubmit={handleSubmitURL}
            >
              <input
                type="text"
                value={userUrl}
                placeholder="Enter URL"
                onChange={(e) => setUserUrl(e.target.value.trim())}
              />
              <button
                type="submit"
                disabled={!userUrl}
              >
                Go
                    </button>
            </form>
          </div>
          {selectedIndex >= 0 && (
            <table className="debugger-table stack gray-border">
              <thead className="sticky">
                <tr className="stack">
                  <th>Column Number</th>
                  <th>Line Number</th>
                  <th>Function Name</th>
                  <th>File Name</th>
                </tr>
              </thead>
              <tbody>
                {actionStack[selectedIndex].stackTrace.map((frame) => {
                  return (
                    <tr>
                      <td>{frame.columnNumber}</td>
                      <td>{frame.lineNumber}</td>
                      <td>{frame.functionName}</td>
                      <td>{frame.fileName}</td>
                    </tr>
                  )
                })
                }
                <tr></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div >
  )
}