const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const initialState = {
  user: '',
  saved_searches: [],
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

  const items = TEST_DATA2.tracks.items;

  function millisToTime(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  return (
    <React.Fragment>
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">trackspotter
          <img src="/static/img/spot_icon_bw.png" width="30" height="30" className="d-inline-block align-top"
            alt="Spotify logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Some User</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <Row className="box">
          <Col></Col>
          <Col><Form inline>
            <FormControl type="text" placeholder="Enter a search term" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form></Col>
          <Col></Col>
        </Row>
      </Container>

      <Container>
        <Row>
          <Table hover>
            <thead>
              <tr>
                <th>TRACK</th>
                <th>TITLE</th>
                <th>ARTIST</th>
                <th>ALBUM</th>
                <th>PLAYTIME</th>
                <th>PREVIEW</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                let order = i + 1;
                let track_time = millisToTime(item.duration_ms);
                let to_play = "https://open.spotify.com/embed/track/" + item.id

                return (
                  <tr>
                    <td>{order}</td>
                    <td>{item.name}</td>
                    <td>{item.album.artists[0].name}</td>
                    <td>{item.album.name}</td>
                    <td>{track_time}</td>
                    <td>
                      <iframe
                        src={to_play}
                        width="300"
                        height="80"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media"
                      >
                      </iframe>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </Table>
        </Row>
      </Container>

      <Container>
        <Row>
          <Button variant="outline-dark offset-10">Save Playlist</Button>
        </Row>
      </Container>
    </React.Fragment>
  );
}

// ReactDOM.render(<App />, document.getElementById('#root'));
ReactDOM.render(<App />, document.querySelector('#root'));