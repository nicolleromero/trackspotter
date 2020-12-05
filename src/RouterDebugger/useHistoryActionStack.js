import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import StackTrace from 'stacktrace-js';


const INITIAL_TIME = getTimestamp(); // Time upon load

function getTimestamp() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  return today.toUTCString();
}

let currentNavigationSource = null;

function recordNavigationSource(source) {
  currentNavigationSource = source;

  setTimeout(() => {
    if (source === currentNavigationSource) {
      currentNavigationSource = null;
    }
  }, 0);
}

export function recordLinkClicked(link) {
  console.log('Link clicked:', this);
  // TODO: Convert from Link instance to component trace.
  const source = link;

  recordNavigationSource(source);
  console.log("NavigationSource", source);
}

export function useHistoryActionStack() {
  const history = useHistory();
  const [actionStack, setActionStack] = useState(() => [{
    action: 'INITIAL',
    location: history.location,
    stackTrace: null,
    source: null,
    timestamp: INITIAL_TIME,
  }]);

  useEffect(() => {
    return history.listen((location, action) => {
      StackTrace.get()
        .then((stackTrace) => {
          setActionStack((stack) => [
            ...stack,
            {
              action,
              location,
              stackTrace,
              source: currentNavigationSource,
              timestamp: getTimestamp(),
            },
          ]);
        })
        .catch((err) => console.error(err))
    })
  }, [history]);

  return actionStack;
}
