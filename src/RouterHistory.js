import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StackTrace from 'stacktrace-js';

const INITIAL_TIME = getTimestamp(); // Time upon load

function getTimestamp() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return today.toUTCString();
}

// function gpsTrace() {
//   var stackframe = new StackFrame({ fileName: 'http://localhost:3000/file.min.js', lineNumber: 1, columnNumber: 3284 });
//   var callback = function myCallback(foundFunctionName) { console.log(foundFunctionName); };

//   // Such meta. Wow
//   var errback = function myErrback(error) { console.log(StackTrace.fromError(error)); };

//   var gps = new StackTraceGPS();

//   // Pinpoint actual function name and source-mapped location
//   return gps.pinpoint(stackframe).then(callback, errback);
// }

// console.log("gps trace", gpsTrace());

let stackRoute = [];

var callback = function (stackframes) {
  stackRoute = stackframes;
  console.log("stackRoute", stackRoute)
  // var stringifiedStack = stackframes.map(function (sf) {
  //   return sf.toString();
  // }).join('\n');
};

var errback = function (err) { console.log("err meesage", err.message); };

// StackTrace.instrument(getTimestamp, callback, errback);

export function RouterHistory() {
  const history = useHistory();
  const [historyStack, setHistoryStack] = useState([history.location]);
  const [actionStack, setActionStack] = useState([{ action: 'PUSH', location: history.location, timestamp: getTimestamp(), stackFrame: stackRoute }]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  stackRoute = StackTrace.get().then(callback).catch(errback);

  useEffect(() => {

    return history.listen((location, action) => {
      console.log("on route change:", action, location);

      if (action === 'POP') {
        stackRoute = StackTrace.get()
          .then(callback)
          .catch(errback)
          .finally(
            setActionStack((stack) => [...stack, { action: 'POP', location: location, timestamp: getTimestamp(), stackFrame: stackRoute }]))
      }
      if (action === 'PUSH') {
        setHistoryStack((stack) => [...stack, { location: location, timestamp: getTimestamp() }]);
        setActionStack((stack) => [...stack, { action: 'PUSH', location: location, timestamp: getTimestamp(), stackFrame: stackRoute }])
      }
      if (action === 'REPLACE') {
        setActionStack((stack) => [...stack, { action: 'REPLACE', location: location, timestamp: getTimestamp(), stackFrame: stackRoute }])
      }
      // var gps = new StackTraceGPS();
    });
  }, [history, actionStack]);


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
            {historyStack.length > 0 && (
              <tbody>
                <tr>
                  <td>{historyStack[0].pathname}</td>
                  <td>INITIAL</td>
                  <td>{INITIAL_TIME}</td>
                </tr>
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
            )}
          </table>
        </div>
      </div>
      <div className="column">
        <div className="debugger tableFixHead" expand="lg" bg="dark" variant="dark">
          {selectedIndex > 0 && (
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
                {actionStack[selectedIndex].stackFrame.map((frame) => {
                  return (
                    <tr>
                      <td>{frame.columnNumber}</td>
                      <td>{frame.lineNumber}</td>
                      <td>{frame.functionName}</td>
                      <td>{frame.fileName}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div >
  )
}