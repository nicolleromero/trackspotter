const { Provider, useSelector, useDispatch } = ReactRedux;

const initialState = {
  useer: '',
  queries: [],
  playlists: [],
};

// function reducer(state = initialState, action) {
//   // Check to see if the reducer cares about this action
//   if (action.type === GUESS_LETTER) {
//     const letter = action.payload;
//     const correct = state.word.includes(letter);

//     return {
//       ...state,
//       guessedLetters: [...state.guessedLetters, letter],
//       numWrong: state.numWrong + (correct ? 0 : 1),
//     };
//   } else if (action.type === RESET) {
//     return initialState;
//   }

//   // otherwise return the existing state unchanged
//   return state;
// }


function App() {
  return (
    <React.Fragment>
      <p>trackspotter Advanced Search</p>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));