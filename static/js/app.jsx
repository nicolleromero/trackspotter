const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;


let query = ''
let queries = []

function Login() {
  // Allows for assigning a seeded user during dev; remove for prod

  const [user_id, setUserId] = React.useState('');
  const [user, setUser] = React.useState({});
  const [name, setName] = React.useState('')

  function handleSetUser(event) {
    event.preventDefault();

    fetch(`/api/handle-login?query=${encodeURIComponent(user_id)}`)
      .then(response => response.json())
      .then((data) => {
        setUser(data);
        setUserId(data.user_id);
        setName(data.spotify_display_name);
        console.log(data, name, user)
      });
  }

  if (name) {
    return (
      <Container>
        <Row className="box align-content-left inline">
          <Col className="offset-1">
            <p>Logged in as: {name}</p>
          </Col>
        </Row>
      </Container>
    );

  } else {
    return (
      <Container>
        <Row className="box align-content-left inline">
          <Col>
            <Form onSubmit={handleSetUser}>
              <Form.Label>User_id:</Form.Label>
              <Form.Row>
                <FormControl
                  type="text"
                  value={user_id}
                  placeholder="Enter user_id"
                  onChange={(e) => setUserId(e.target.value)}
                  className="lg-1 inline"
                  id="log-in"
                />
                <Button
                  variant="outline-secondary inline"
                  type="submit"
                  className="inline"
                >
                  Log in
              </Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}


function AdvSearch(prop) {
  let [prepend, setPrepend] = React.useState('');
  let [title, setTitle] = React.useState('')
  let [param, setQuery] = React.useState('');
  let [items, setTracks] = React.useState([]);

  function handleSearch(event) {
    event.preventDefault();

    query = (query + ' ' + prepend + '' + param);
    queries.push(prepend + ' ' + param);

    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(items => {
        setTracks(items);
        setQuery('');
        setPrepend('');
        setTitle(''); // Come back to this => not sure why it's not working
      });

  }

  function handleReset() {
    setTracks([]);
    queries = [];
    query = '';
  };

  function millisToTime(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function handleDelete(target) {
    items = items.filter((t) => t.id !== target);
    setTracks(items);
  }

  return (
    <React.Fragment>
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
                  <option value="genre: ">genre</option>
                  <option value="year: ">year</option>
                  <option value="NOT">NOT</option>
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
            {/* Come back to this: Trying out autocomplete */}
            {/* <CountrySelect /> */}
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
               |  |
              <Button
                variant="outline-secondary inline"
                onClick={handleReset}
              >
                Clear
              </Button>
            </Col>
          </Form>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col className="align-content-left" md={{ span: 2, offset: 10 }}>
            <h5>
              {queries.map((query) => {
                if (query) {
                  return (
                    <Badge pill variant="dark">{query}</Badge>
                  )
                }
              })}
            </h5>
          </Col>
          {items.length > 0 && (
            <Col id="need-space" className="align-content-right">
              <Button variant="outline-dark offset-10">Save Playlist</Button>
              <br />
            </Col>
          )}
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
                let track_time = millisToTime(item.duration_ms);
                // let to_play = "https://open.spotify.com/embed/track/" + item.id // Handles the player

                return (
                  <tr align="center" scope="row" key={item.id}>
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
                      onClick={() => handleDelete(item.id)}
                    // onClick={(e) => console.log(e.target.value)}
                    // onMouseDown={(e) => e.preventDefault()}
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
  );
}


function TopPlaylists() {
  const [top_playlists, setTopPlaylists] = React.useState([]);


  React.useEffect(() => {

    fetch(`/api/top-playlists`)
      .then(response => response.json())
      .then((top_playlists) => {
        setTopPlaylists(top_playlists);
        console.log(response, top_playlists)
      })
  }, [])

  return (
    <Container >
      <Row className="align-content-center">
        <Table hover>
          <thead>
            <tr align="center">
              <th>RESULTS</th>
              <th>PLAYLIST TITLE</th>
              <th>LIKES</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            {Object.keys(top_playlists).map((title, i) => {
              let order = i + 1;

              return (
                <tr align="center" scope="row" key={title}>
                  <td>{order}</td>
                  <td>{title}</td>
                  <td>{top_playlists[title]}</td>
                  <td><button
                    className="btn btn-sm delete-button"
                  // onClick={() => handleOpenPlaylist()}
                  >
                    Play
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Row>
    </Container>
  )
}



function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/top-playlists">Browse Playlists</Link>
            </li>
            <li>
              <Link to="/user-playlists">User Playlists</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
            <Topbar bg="light" variant="light" />
            <Login />
            <AdvSearch />
          </Route>
          <Route path="/top-playlists">
            <Topbar bg="light" variant="light" />
            <Login />
            {/* <TopPlaylists /> */}
          </Route >
          <Route path="/user-playlists">
            <Topbar bg="light" variant="light" />
            <Login />
          </Route >
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));