import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const INITIAL_TIME = getTimestamp(); // Time upon load

function getTimestamp() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return today.toUTCString();
}

export function RouterHistory() {
  const history = useHistory();
  const [historyStack, setHistoryStack] = useState([history.location]);
  const [actionStack, setActionStack] = useState([]);

  useEffect(() => {
    return history.listen((location, action) => {
      console.log("on route change:", action, location);

      if (action === 'POP') {
        setHistoryStack((stack) => stack.slice(0, -1));
        setActionStack((stack) => [...stack, { action: 'POP', location: location, timestamp: getTimestamp() }])
      }
      if (action === 'PUSH') {
        setHistoryStack((stack) => [...stack, { location: location, timestamp: getTimestamp() }]);
        setActionStack((stack) => [...stack, { action: 'PUSH', location: location, timestamp: getTimestamp() }])
      }
      if (action === 'REPLACE') {
        setActionStack((stack) => [...stack, { action: 'REPLACE', location: location, timestamp: getTimestamp() }])
      }
    });
  }, [history]);

  console.log("historyStack", historyStack);
  console.log("actionStack", actionStack);


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
            {historyStack.length > 0 && (
              <tbody>
                <tr>
                  <td>{historyStack[0].pathname}</td>
                  <td>INITIAL</td>
                  <td>{INITIAL_TIME}</td>
                </tr>
                {actionStack.map((item) => {
                  return (
                    <tr>
                      <td><button className="debugger-btn">{item.location.pathname}</button></td>
                      <td>{item.action}</td>
                      <td>{item.timestamp}</td>
                    </tr>
                  )
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <div className="column">
        <h4>Placeholder for Stack</h4>
      </div>
    </div>
  )
}