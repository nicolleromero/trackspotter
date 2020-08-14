const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;
const Board, { moveCard } = "@lourenci/react-kanban";

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;


let query = ''


function App() {
  let [items, setTracks] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);

  function handleDelete(itemId) {
    items = items.filter((c) => c.id !== itemId);
  };

  const AdvSearch = (props) => {
    const [prepend, setPrepend] = React.useState('');
    const [title, setTitle] = React.useState('')
    const [param, setQuery] = React.useState('');

    function handleSearch(event) {
      event.preventDefault();

      query = query + ' ' + prepend + ' ' + param


      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(items => setTracks(items));
    }




    return (
      <Container>
        <Row className="box align-content-center inline">
          <Form onSubmit={handleSearch}>
            <Col className="align-content-center">
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Label
                  onChange={(e) => setTitle(e.target.value)}
                >
                  {title}
                </Form.Label>
                <Form.Control as="select" custom onChange={(e) => setPrepend(e.target.value)}>
                  <option value="">keyword</option>
                  <option value="artist: ">artist</option>
                  <option value="album: ">album</option>
                  <option value="year: ">year</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col className="align-content-center">
              <Form.Label>Search Term:</Form.Label>
              <FormControl
                type="text"
                value={param}
                placeholder="Enter a term"
                onChange={(e) => setQuery(e.target.value)}
                className="mr-sm-2 inline"
              />
            </Col>
            {/* <Col>
              <Form.Label>Popularity</Form.Label>
              <Form.Control type="range" id="slider" />
            </Col> */}
            <Col className="align-content-center">
              <br />
              <Button
                variant="outline-secondary inline"
                type="submit"
              >
                Search
              </Button>
               ||
              <Button
                variant="outline-secondary inline"
              >
                Clear
              </Button>
            </Col>
          </Form>
        </Row>
      </Container>
    );
  }

  function millisToTime(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }


  //   fetch(`/api/playlists`)
  //     .then(response => response.json())
  //     .then(playlists => setPlaylists(playlists));
  // }


  return (
    // <Router>
    <React.Fragment>
      <Topbar bg="light" variant="light" />
      <AdvSearch />

      <Container>
        <Row>
          <Col md={4}></Col>
          <Col className="align-content-right" md={{ span: 4, offset: 4 }}>
            <h5>
              {/* {queries.map((query) => {
                return ( */}
              <Badge pill variant="dark">{query}</Badge>
              {/* )
              })} */}
            </h5>
          </Col>
        </Row>
      </Container>

      <Container className="tracks">
        <Row className="align-content-center">
          <Table hover>
            <thead>
              <tr align="center">
                <th>   </th>
                <th>TRACK</th>
                <th>TITLE</th>
                <th>ARTIST</th>
                <th>ALBUM</th>
                <th>PLAYTIME</th>
                <th>PREVIEW</th>
                <th>   </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                let order = i + 1;
                let song = 'song' + String(i + 1)
                let track_time = millisToTime(item.duration_ms);
                // let to_play = "https://open.spotify.com/embed/track/" + item.id

                return (
                  <tr align="center" id={item.uid}>
                    <td></td>
                    <td>{order}</td>
                    <td>{item.name}</td>
                    <td>{item.album.artists[0].name}</td>
                    <td>{item.album.name}</td>
                    <td>{track_time}</td>
                    <td><img src={item.album.images[2].url}></img></td>
                    {/* <td><iframe
                      src={to_play}
                      width="80"
                      height="80"
                      frameborder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                    > */}
                    {/* </iframe> */}
                    <td><button
                      className="btn btn-sm delete-button"
                      onClick={() => handleDelete(items.id)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      X
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Row>
      </Container>
    </React.Fragment >

    // <Container>
    //   <Row>
    //     <Button variant="outline-dark offset-10">Save Playlist</Button>
    //   </Row>
    // </Container>
    // //

    // <Switch>
    //   <Route path="/">
    //     <AdvSearch />
    //   </Route>
    //   <Route path="/playlists">
    //     <Playlists />
    //   </Route>
    // </Switch>
    // // </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));