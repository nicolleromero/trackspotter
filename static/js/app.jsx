const { Component, useState, useCallback } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

let query = '';
let queries = [];

function AdvSearch() {
  let [prepend, setPrepend] = React.useState('');
  let [title, setTitle] = React.useState('')
  let [param, setParam] = React.useState('');
  let [items, setTracks] = React.useState([]);

  function handleSearch(event) {
    event.preventDefault();

    query = (query + ' ' + prepend + ' ' + param);
    queries.push(prepend + ' ' + param);


    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(items => {
        setTracks(items);
        setParam('');
        setPrepend('');
        setTitle(''); // Come back to this => not sure why it's not working
      });

  }

  function millisToTime(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function handleDeleteParam(target) {
    queries = queries.filter((t) => t !== target);
    console.log(`queries1: ${queries}`)
    query = '';
    for (let element of queries) {
      query = (query + ' ' + element);
      console.log(`query: ${query}`)
    }
    console.log(`queries2: ${queries}, query: ${query}`)
    setParam('');
    setPrepend('');

    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(items => {
        setTracks(items);
        setParam('');
        setPrepend('');
        setTitle(''); // Come back to this => not sure why it's not working
      })
  }

  function handleDelete(target) {
    items = items.filter((t) => t.id !== target);
    setTracks(items);
  }

  function handleReset() {
    setParam('');
    setPrepend('');
    setTitle('');
    setTracks([]);
    queries = [];
    query = '';
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
                onChange={(e) => setParam(e.target.value)}
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
              &nbsp;&nbsp;&nbsp;&nbsp;
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
        <Row className="align-content-left">
          <Col className="align-content-left">
            <h5>
              {queries.map((query) => {
                if (query) {
                  return (
                    <Badge
                      pill
                      variant="dark">
                      <Button
                        variant="dark"
                        size="sm"
                        key={query}
                        value={query}
                        onClick={(e) => handleDeleteParam(e.target.value)}
                      >
                        X {query}
                      </Button></Badge>
                  )
                }
              })}
            </h5>
          </Col>
          {items.length > 0 && (
            <Col id="need-space" className="align-content-right">
              <Button variant="outline-dark offset-9">Save Playlist</Button>
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
                <th>PLAY</th>
                <th>   </th>
              </tr>
            </thead>
            <tbody>

              {items.map((item, i) => {
                let order = i + 1;
                let track_time = millisToTime(item.duration_ms);
                let to_play = "https://open.spotify.com/embed/track/" + item.id // Handles the player

                return (
                  <tr align="center" scope="row" key={item.id}>
                    <td></td>
                    <td>{order}</td>
                    <td>{item.name}</td>
                    <td>{item.album.artists[0].name}</td>
                    <td>{item.album.name}</td>
                    <td>{track_time}</td>
                    {/* <td><img src={item.album.images[2].url}></img></td> */}
                    <td><iframe
                      src={to_play}
                      width="80"
                      height="80"
                      frameborder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                    >
                    </iframe></td>
                    <td><button
                      className="btn btn-sm delete-button"
                      onClick={() => handleDelete(item.id)}
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

function PlaylistItem(props) {
  let queries = [props.title.toLowerCase().replace('playlist', '')];

  return (
    <tr align="center" scope="row" key={props.title}>
      {/* <td>{order}</td> */}
      <td>{queries.map((query) => {
        if (query) {    // Will need to be updated with query results
          return (
            <h5><Badge pill variant="dark">genre: {query}</Badge></h5>
          )
        }
      })}</td>
      <td>{props.title}</td>
      <td>{props.likes}</td>
      <td><button
        className="btn btn-sm delete-button"
      // onClick={() => handleOpenPlaylist()}
      >
        <img
          src="/static/img/transparent-play-button-icon-18.jpg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      </button>
      </td>
    </tr>
  )
}

function TopPlaylists() {
  const [top_playlists, setTopPlaylists] = React.useState([]);


  React.useEffect(() => {

    fetch(`/api/top-playlists`)
      .then(response => response.json())
      .then((data) => {
        const top_playlists_list = []
        for (const key in data) {
          console.log(key, data[key])
          top_playlists_list.push(
            <PlaylistItem title={key} likes={data[key]} />
          )
        }
        setTopPlaylists(top_playlists_list);
      })
  }, [])


  return (
    <Container >
      <Row className="align-content-center">
        <Table id="playlist_table" hover>
          <thead>
            <tr align="center">
              <th colSpan="4"><h3>
                Popular Playlists
              <small class="text-muted">&nbsp;🎧&nbsp;&nbsp; by genre</small>
              </h3></th>
            </tr>
          </thead>
          <thead id="playlist-thead">
            <tr align="center">
              <th>SEARCH TERMS</th>
              <th>PLAYLIST TITLE</th>
              <th>RATING</th>
              <th>PLAY</th>
            </tr>
          </thead>
          <tbody>
            {top_playlists}
          </tbody>
        </Table>
      </Row>
    </Container >
  )
}

function UserPlaylists() {
  const [user_playlists, setUserPlaylists] = React.useState([]);

  return (
    <p>Placeholder</p>
  )
}


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul className="mr-auto">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/user-playlists">User Playlists</Link>
            </li>
            <li>
              <Link to="/top-playlists">Browse Playlists</Link>
            </li>
          </ul>
        </nav>
        <Topbar />

        <Switch>
          <Route exact path="/" component={AdvSearch} />
          <Route exact path="/user-playlists" component={UserPlaylists} />
          <Route exact path="/top-playlists" component={TopPlaylists} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));