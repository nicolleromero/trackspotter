const { Component, useEffect, useState, useCallback } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function millisToTime(milliseconds) {
  let minutes = Math.floor(milliseconds / 60000);
  let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function buildQuery(queries) {
  return queries.join(' ');
}

function AdvSearch() {
  let [prefix, setPrefix] = React.useState('');
  let [param, setParam] = React.useState('');
  let [tracks, setTracks] = React.useState([]);
  let [queries, setQueries] = React.useState([]);
  let query = buildQuery(queries);

  React.useEffect(() => {
    if (query) {
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(tracks => {
          setTracks(tracks);
        });
    } else {
      setTracks([]);
    }
  }, [query]);

  function handleSearch(event) {
    event.preventDefault();

    const newQueries = queries.slice();
    if (prefix === "year:") {
      newQueries.push(`${prefix}${param}`);
    } else {
      newQueries.push(`${prefix}"${param}"`);
    }


    setQueries(newQueries);
    console.log(`queries: ${newQueries}, query: ${buildQuery(newQueries)}`);

    setParam('');
    setPrefix('');
  }

  function handleDeleteParam(target) {
    console.log(`queries before delete: ${queries}, query: ${query}`)

    const newQueries = queries.filter((t) => t !== target);
    setQueries(newQueries);
    console.log(`queries after delete: ${newQueries}, query: ${buildQuery(newQueries)}`)
  }

  function handleDelete(target) {
    const newTracks = tracks.filter((t) => t.id !== target);
    setTracks(newTracks);
  }

  function handleReset() {
    setParam('');
    setPrefix('');
    setTracks([]);
    setQueries([]);
  }

  return (
    <React.Fragment>
      <Container>
        <Row className="box align-content-center inline">
          <Form onSubmit={handleSearch}>
            <Col className="align-content-center">
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control as="select" custom onChange={(e) => setPrefix(e.target.value)}>
                  <option value="">keyword</option>
                  <option value="artist:">artist</option>
                  <option value="album:">album</option>
                  <option value="genre:">genre</option>
                  <option value="year:">year</option>
                  {/* <option value="NOT ">NOT</option> */}
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
              {queries.map((element) => {
                return (
                  <Badge
                    pill
                    variant="dark">
                    <Button
                      variant="dark"
                      size="sm"
                      key={element}
                      onClick={() => handleDeleteParam(element)}
                    >
                      X {element.replace(/"/g, '')}
                    </Button></Badge>
                )
              })}
            </h5>
          </Col>
          {tracks.length > 0 && (
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

              {tracks.map((track, i) => {
                let order = i + 1;
                let track_time = millisToTime(track.duration_ms);
                let to_play = "https://open.spotify.com/embed/track/" + track.id // Handles the player
                console.log(track.id)

                return (
                  // <Track
                  //   order={order}
                  // />
                  <tr align="center" scope="row" key={track.id}>
                    <td></td>
                    <td>{order}</td>
                    <td>{track.name}</td>
                    <td>{track.album.artists[0].name}</td>
                    <td>{track.album.name}</td>
                    <td>{track_time}</td>
                    {/* <td><img src={track.album.images[2].url}></img></td> */}
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
                      onClick={() => handleDelete(track.id)}
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

function TopPlaylists(props) {
  const [top_playlists, setTopPlaylists] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/top-playlists`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setTopPlaylists(data);
      })


  }, [])
  console.log(top_playlists);

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
            {top_playlists.map((playlist) => {
              return (
                <PlaylistRow
                  playlist_id={playlist.playlist_id}
                  title={playlist.playlist_title}
                  likes={playlist.count}
                  value={playlist.playlist_id}
                  onClick={props.handleOpenPlaylist}
                />
              )
            })}
          </tbody>
        </Table>
      </Row>
    </Container >
  )
}

function UserPlaylists(props) {
  let [user_playlists, setUserPlaylists] = React.useState([]);


  React.useEffect(() => {

    fetch(`/api/playlists`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setUserPlaylists(data);
      })
  }, [])

  // TODO: Conditionally render title
  return (
    <Container >
      <Row className="align-content-center">
        <Table id="playlist_table" hover><br />
          <thead>
            <tr align="center">
              <th colSpan="4"><h3>
                {user_name}'s Playlists
              <small class="text-muted">&nbsp;🎧&nbsp;&nbsp; you're so amazing...</small>
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
            {user_playlists.map((playlist) => {
              return (
                <PlaylistRow
                  playlist_id={playlist.playlist_id}
                  title={playlist.playlist_title}
                  likes={playlist.count}
                  value={playlist.playlist_id}
                  onClick={props.handleOpenPlaylist}
                />
              )
            })}
          </tbody>
        </Table>
      </Row>
    </Container >
  )
}


function PlaylistRow(props) {
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
      <td>
        <h4>{'♪'.repeat(props.likes)}</h4>
      </td>
      <td>
        <Link to={`/playlist/${props.playlist_id}`}>
          <button
            className="btn btn-sm"
          >
            <img
              src="/static/img/transparent-play-button-icon-18.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </button>
        </Link>
      </td>
    </tr >
  )
}


function PlaylistTracks(props) {
  let { playlist_id } = props.match.params;
  let [tracks, setTracks] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/playlists/${playlist_id}`)
      .then((response) => response.json())
      .then((tracks) => {
        setTracks(tracks);
      })
  }, [playlist_id]);


  function handleDelete(target) {
    tracks = tracks.filter((t) => t.id !== target);
    setTracks(tracks);
  }

  return (
    <React.Fragment>
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
              {tracks.map((track, i) => (
                <Track
                  track={track}
                  index={i}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </Table>
        </Row>
      </Container>
    </React.Fragment >
  );
}


function App() {
  return (
    <Router>
      <Topbar />
      <div>
        <nav className="navbar navbar-expand-lg">
          <ul className="nav navbar-nav">
            <li className="inline">
              <Link to="/">Home</Link> |&nbsp;
            </li>
            <li className="inline">
              <Link to="/user-playlists"> User Playlists</Link>  |&nbsp;
            </li>
            <li className="inline">
              <Link to="/top-playlists"> Browse Playlists</Link>
            </li>
          </ul>
        </nav>


        <Switch>
          <Route exact path="/" component={AdvSearch} />
          <Route exact path="/user-playlists" component={UserPlaylists} />
          <Route exact path="/top-playlists" component={TopPlaylists} />
          <Route exact path="/playlist/:playlist_id" component={PlaylistTracks} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));