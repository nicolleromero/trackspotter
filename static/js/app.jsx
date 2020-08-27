const { Component, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;

function millisToTime(milliseconds) {
  let minutes = Math.floor(milliseconds / 60000);
  let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function buildQuery(queries) {
  return queries.join(' ');
}

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function AdvSearch() {
  let [prefix, setPrefix] = React.useState('');
  let [param, setParam] = React.useState('');
  let [tracks, setTracks] = React.useState([]);
  let [queries, setQueries] = React.useState([]);
  let query = buildQuery(queries);
  let [playlist_title, setPlaylistTitle] = React.useState('');
  let history = useHistory();

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
    const newQueries = queries.filter((t) => t !== target);
    setQueries(newQueries);
  }


  function handleDelete(target) {
    const newTracks = tracks.filter((t) => t.id !== target);
    setTracks(newTracks);
  }


  const handleSavePlaylist = (event) => {
    event.preventDefault();

    const target_playlist = {
      "playlist_title": playlist_title,
      "playlist_tracks": tracks,
      "query": query,
    }
    fetch('/api/save-playlist', {
      method: 'POST',
      body: JSON.stringify(target_playlist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        history.push(`/playlist/${data.playlist_id}`);
      });

    handleReset();
  }

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newTracks = reorder(
      tracks,
      result.source.index,
      result.destination.index
    );

    setTracks(newTracks);
  };

  function handleReset() {
    setParam('');
    setPrefix('');
    setTracks([]);
    setQueries([]);
    setPlaylistTitle('');
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
        <Row inline>
          <Col xs="auto" className="align-content-left">
            <h5>
              {queries.map((element) => {
                return (
                  <Badge
                    pill
                    className="btn btn-dark"
                    href="#"
                    variant="dark"
                    key={element}
                    onClick={() => handleDeleteParam(element)}
                  >
                    X {element.replace(/"/g, '')}
                  </Badge>
                )
              })}
            </h5>
          </Col>
          {tracks.length > 0 && (
            <Form
              inline
              className="float-right offset-6"
              onSubmit={handleSavePlaylist}
            >
              <Form.Row inline className="float-right">
                <Col xs="auto" >
                  <FormControl
                    type="text"
                    value={playlist_title}
                    placeholder="Playlist Title"
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    className="mr-sm-2 inline"
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    // variant="outline-dark offset-9"
                    variant="outline-secondary"
                    type="submit"
                  >
                    Save Playlist</Button>
                  <br />
                </Col>
              </Form.Row>
            </Form>
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <tbody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tracks.map((track, index) => {
                      let order = index + 1;
                      let track_time = millisToTime(track.duration_ms);
                      let to_play = "https://open.spotify.com/embed/track/" + track.id // Handles the player
                      return (
                        <Draggable key={track.id} draggableId={track.id} index={index}>
                          {(provided, snapshot) => (
                            <tr ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              align="center"
                              scope="row">
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
                                frameBorder="0"
                                allowtransparency="true"
                                allow="encrypted-media"
                              >
                              </iframe></td>
                              <td>
                                <button
                                  className="btn btn-sm delete-button"
                                  onClick={() => handleDelete(track.id)}
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>

        </Row>
      </Container>
    </React.Fragment>
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

  return (
    <React.Fragment>
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
                    query={playlist.query}
                    onClick={props.handleOpenPlaylist}
                  />
                )
              })}
            </tbody>
          </Table>
        </Row>
      </Container >
    </React.Fragment>
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

  return (
    <Container >
      <Row className="align-content-center">
        <Table id="playlist_table" hover><br />
          <thead>
            <tr align="center">
              <th colSpan="4"><h3>
                {props.user.spotify_display_name}'s Playlists
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
                  query={playlist.query}
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
  let queries = [props.query];

  return (
    <tr align="center" scope="row" key={props.title}>
      <td>{queries.map((query) => {
        if (query) {
          return (
            <h5><Badge pill variant="dark">{query}</Badge></h5>
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
  let [playlistTitle, setPlaylistTitle] = React.useState('');
  let [playlistLike, setPlaylistLike] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/playlists/${playlist_id}`)
      .then((response) => response.json())
      .then((playlist) => {
        setTracks(playlist.tracks);
        setPlaylistTitle(playlist.playlist_title)
        setPlaylistLike(playlist.playlist_like)
        console.log('playlist like', playlist.playlist_like)
      })
  }, []);

  function handlePlaylistLike() {
    setPlaylistLike(!playlistLike);

    const target_playlist = {
      "playlist_id": playlist_id,
    }
    fetch('/api/update-playlist-like', {
      method: 'POST',
      body: JSON.stringify(target_playlist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('playlist like response', data);
        // TODO: maybe do something here?
      });
  }
  // TODO create route to update playlist like for playlist


  function handleDeleteTrack(target) {
    const newTracks = tracks.filter((t) => t.track_id !== target);
    setTracks(newTracks);
  }

  function handleDeletePlaylist() {
    const target_playlist = {
      "playlist_id": playlist_id,
    }
    fetch('/api/delete-playlist', {
      method: 'POST',
      body: JSON.stringify(target_playlist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('deleted-playlist response', data);
        // TODO: maybe do something here?
      });
  }

  const handleSaveEditedPlaylist = (event) => {
    event.preventDefault();

    const target_playlist = {
      "playlist_id": playlist_id,
      "playlist_title": playlistTitle,
      "playlist_tracks": tracks,
    }
    fetch('/api/update-playlist', {
      method: 'POST',
      body: JSON.stringify(target_playlist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('update-playlist response', data);
        // TODO: maybe do something here?
      });
  }

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newTracks = reorder(
      tracks,
      result.source.index,
      result.destination.index
    );

    setTracks(newTracks);
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col className="float-left offset-1 inline">
            <h3>
              {playlistTitle}
            </h3>
          </Col>
        </Row>
        <Form
          inline
          className="float-right offset-6"
          onClick={handleSaveEditedPlaylist}
        >

          <Form.Row inline className="float-right">
            <Col xs="auto" >
              <FormControl
                type="text"
                value={playlistTitle}
                placeholder="Playlist Title"
                onChange={(e) => setPlaylistTitle(e.target.value)}
                className="mr-sm-2 inline"
              />
            </Col>
            <Col xs="auto" >
              <Button
                variant="dark inline"
                onClick={handleDeletePlaylist}
              > Delete Playlist
                </Button>{' '}
              <Button
                variant="outline-secondary inline"
                type="submit"
              > Save Playlist
              </Button>
              {!playlistLike && (
                <span inline className="float-right"><button
                  className="btn btn-sm inline"
                  onClick={handlePlaylistLike}
                >
                  <h4>♡</h4>
                </button></span>
              )}
              {playlistLike && (
                <span inline className="float-right"><button
                  className="btn btn-sm inline"
                  onClick={handlePlaylistLike}
                >
                  <h3>♥︎</h3>
                </button></span>
              )}
            </Col>
          </Form.Row>
        </Form>
      </Container>
      <Container>
        <Table id="playlist_table" hover><br />
          <thead id="playlist-thead">
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
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tracks.map((track, index) => (
                    <Draggable key={track.uid} draggableId={track.uid} index={index}>
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          align="center"
                          scope="row">
                          <Track
                            track={track}
                            index={index}
                            onDeleteTrack={handleDeleteTrack}
                          />
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </Container>
    </React.Fragment>
  );
}


function App(props) {
  const [user, setUser] = React.useState(USER);

  function handleLogin(user) {
    setUser(user)
  }

  return (
    <Router>
      <Topbar
        user={user}
        onLogin={handleLogin} />
      <div>
        <nav className="navbar navbar-expand-lg">
          <ul className="nav navbar-nav">
            <li className="inline">
              <Link to="/">Home</Link> |&nbsp;
            </li>
            {user && (
              <li className="inline">
                <Link to="/user-playlists"> User Playlists</Link>  |&nbsp;
              </li>
            )}
            <li className="inline">
              <Link to="/top-playlists"> Browse Playlists</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={AdvSearch} />
          <Route exact path="/user-playlists" render={(props) => <UserPlaylists {...props} user={user} />} />
          <Route exact path="/top-playlists" component={TopPlaylists} />
          <Route exact path="/playlist/:playlist_id" component={PlaylistTracks} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));