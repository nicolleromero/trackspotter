const { Component, PureComponent, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Spinner, Table } = ReactBootstrap;

const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Switch = ReactRouterDOM.Switch;
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
  const [prefix, setPrefix] = React.useState('');
  const [param, setParam] = React.useState('');
  const [wildcard, setWildcard] = React.useState('');
  const [numSongs, setNumSongs] = React.useState(20);
  const [offset, setOffset] = React.useState(0);
  const [tracks, setTracks] = React.useState([]);
  const [queries, setQueries] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const query = buildQuery(queries);
  const [playlistTitle, setPlaylistTitle] = React.useState('');
  const history = useHistory();

  React.useEffect(() => {
    if (query) {

      const search = {
        "query": query,
        "numSongs": numSongs,
        "offset": offset,
      }
      setLoading(true);

      fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify(search),
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(newTracks => {
          if (offset === 0) {
            setTracks(newTracks);
          } else {
            setTracks([...tracks, ...newTracks]);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setTracks([]);
    }
  }, [query, offset]);


  function handleSearch(event) {
    event.preventDefault();
    console.log("query1", query)
    console.log("wildcard1", wildcard)

    const newQueries = queries.slice();
    if (prefix === "year:") {
      newQueries.push(`${prefix}${param}`);
    } else if (wildcard === "starts with") {
      newQueries.push(`${prefix}${param}*`);
    } else if (wildcard === "ends with" && prefix !== '') {
      newQueries.push(`${prefix}*${param}`);
    } else if (wildcard === "contains" && prefix !== '') {
      newQueries.push(`${prefix}*${param}*`);
    } else if (wildcard === "contains" && prefix === '') {
      newQueries.push(`${prefix}${param}*`);
    } else {
      newQueries.push(`${prefix}"${param}"`);
    }
    setQueries(newQueries);
    setWildcard('');
    setParam('');
    setPrefix('');
    setOffset(0);
  }

  function handleNext() {
    setOffset(offset + Number(numSongs));
  }

  function handleDeleteParam(target) {
    const newQueries = queries.filter((t) => t !== target);
    setQueries(newQueries);
  }

  function handleDeleteTrack(target) {
    const newTracks = tracks.filter((t) => t.track_id !== target);
    setTracks(newTracks);
  }

  const handleSavePlaylist = (event) => {
    event.preventDefault();

    const targetPlaylist = {
      "playlist_title": playlistTitle,
      "playlist_tracks": tracks,
      "query": query,
    }
    fetch('/api/save-playlist', {
      method: 'POST',
      body: JSON.stringify(targetPlaylist),
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
    setWildcard('');
    setOffset(0);
    setTracks([]);
    setQueries([]);
    setPlaylistTitle('');
  }

  return (
    <React.Fragment>
      <Navbar id="cover-image">
        <Row className="d-flex float-right padding"
        >
        </Row>
        <Row className="d-flex justify-content-between hyper offset-2">
          <h1 className="h1">Expertly find <br />the tracks you <br />love </h1>
        </Row>
      </Navbar>
      <Container className="padding">
        <StructuredSearch
          handleSearch={handleSearch}
          setPrefix={setPrefix}
          setParam={setParam}
          setWildcard={setWildcard}
          handleReset={handleReset}
          onChangeNumSongs={setNumSongs}
          param={param}
          numSongs={numSongs}
          prefix={prefix}
          wildcard={wildcard}
        />
        <Row className="d-flex justify-content-between">
          {tracks.length > 0 && (
            <div xs="auto" className="align-content-left">
              <h5>
                {queries.map((element) => {
                  return (
                    <Badge
                      pill
                      className="btn-dark badge badge-lower"
                      href="#"
                      variant="dark"
                      key={element}
                      onClick={() => handleDeleteParam(element)}
                    >
                      × {element.replace(/"/g, '')}
                    </Badge>
                  )
                })}
              </h5>
            </div>
          )}
          {tracks.length > 0 && USER == null && (
            <div>
              <Row className="offset-2">
                <Col >
                  <img
                    className="loginprompt"
                    src="/static/img/login.png"
                    width="250"
                    height="auto"
                  >
                  </img>
                </Col>
              </Row>
            </div>
          )}
          {tracks.length > 0 && USER != null && (
            <Form
              inline
              className="float-right inline"
              onSubmit={handleSavePlaylist}
            >
              {tracks.length > 0 && USER != null && (
                <Form.Row inline className="float-right inline save top-space">
                  <FormControl
                    type="text"
                    value={playlistTitle}
                    placeholder="Playlist Title"
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    className="mr-sm-2 inline wider"
                  />
                  <Button
                    variant="outline-secondary"
                    type="submit"
                  >
                    Save Playlist</Button>
                  <br />
                </Form.Row>
              )}
            </Form>
          )}
        </Row>
      </Container>
      {!loading && tracks.length === 0 && USER == null && (
        <Container>
          <Row className="offset-2">
            <Col >
              <img
                className="tryitout"
                src="/static/img/tryitout.png"
                width="200"
                height="auto"
              >
              </img>
            </Col>
          </Row>
        </Container>
      )}
      {tracks.length > 0 && (
        <Container className="tracks">
          <Row className="align-content-center">
            <Table hover>
              <TracksHeader
                editable={true}
              />
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <tbody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {tracks.map((track, index) => (
                        <Draggable
                          key={track.uid}
                          draggableId={track.uid}
                          index={index}
                        >
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
                                editable={true}
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
          </Row>
        </Container>
      )}
      {
        loading && (
          <Container>
            <Row className="d-flex justify-content-center inline align-items-center">
              <Spinner animation="border" variant="secondary" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </Row>
          </Container >
        )
      }
      {
        tracks.length > 0 && (
          <Container>
            <Row className="float-right">
              <Col className="float-right">
                <Button
                  variant="outline-secondary inline more-space"
                  onClick={handleNext}
                >
                  More Tracks
              </Button>
              </Col>
            </Row>
          </Container>
        )
      }

    </React.Fragment >
  );
}


function TopPlaylists(props) {
  const [topPlaylists, setTopPlaylists] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  function handleNextPlaylist() {
    setOffset(offset + 20);
  }

  React.useEffect(() => {
    setLoading(true);

    fetch(`/api/top-playlists?offset=${offset}`)
      .then(response => response.json())
      .then((data) => {
        if (offset === 0) {
          setTopPlaylists(data);
        } else {
          setTopPlaylists([...topPlaylists, ...data]);
        }
      })
      .finally(() => setLoading(false));
  }, [offset]);

  return (
    <React.Fragment>
      <Navbar id="banner-image">
        <Row className="d-flex float-right padding"
        >
        </Row>
        <Row className="d-flex justify-content-between hyper offset-2">
          <h1 className="h1 banner">Popular <br />Playlists</h1>
        </Row>
      </Navbar>
      <Container>
        <Row className="align-content-center">
          <Table id="playlist_table" hover>
            <PlaylistHeader
              title="Popular Playlists"
            />
            <tbody>
              {topPlaylists.map((playlist) => {
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
      {loading && (
        <Container>
          <Row className="d-flex justify-content-center inline align-items-center">
            <Spinner animation="border" variant="secondary" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Row>
        </Container >
      )}
      <Container>
        <Row className="float-right">
          <Col className="float-right">
            <Button
              variant="outline-secondary inline more-space"
              onClick={handleNextPlaylist}
            >
              More Playlists
              </Button>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

function UserPlaylists(props) {
  let [userPlaylists, setUserPlaylists] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/playlists`)
      .then(response => response.json())
      .then((data) => {
        setUserPlaylists(data);
      })
  }, [])

  return (
    <React.Fragment>
      <Navbar id="banner-image">
        <Row className="d-flex float-right padding"
        >
        </Row>
        <Row className="d-flex justify-content-between hyper offset-2">
          <h1 className="h1 banner">Your <br />Playlists</h1>
        </Row>
      </Navbar>
      <Container>
        <Row className="align-content-center">
          <Table id="playlist_table" hover>
            <PlaylistHeader
              title="Your Playlists"
            />
            <tbody>
              {userPlaylists.map((playlist) => {
                return (
                  <PlaylistRow
                    playlist_id={playlist.playlist_id}
                    title={playlist.playlist_title}
                    likes={playlist.count}
                    key={playlist.playlist_id}
                    value={playlist.playlist_id}
                    query={playlist.query}
                    onClick={props.handleOpenPlaylist}
                  />
                )
              })}
            </tbody>
          </Table>
        </Row>
      </Container>
    </React.Fragment>
  )
}

function PlaylistTracks(props) {
  let { playlist_id } = props.match.params;
  let [tracks, setTracks] = React.useState([]);
  let [playlistTitle, setPlaylistTitle] = React.useState('');
  let [playlistLike, setPlaylistLike] = React.useState(false);
  let [playlistUser, setPlaylistUser] = React.useState('');
  let [playlistId, setPlaylistId] = React.useState('');
  let history = useHistory();
  const [message, setMessage] = React.useState('');
  const [snackbar, setSnackbar] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/playlists/${playlist_id}`)
      .then((response) => response.json())
      .then((playlist) => {
        setTracks(playlist.tracks);
        setPlaylistTitle(playlist.playlist_title)
        setPlaylistLike(playlist.playlist_like)
        setPlaylistUser(playlist.user_id)
      })
  }, [playlist_id]);

  function handlePlaylistLike() {
    setPlaylistLike(!playlistLike);

    const targetPlaylist = {
      "playlist_id": playlist_id,
    }
    fetch('/api/update-playlist-like', {
      method: 'POST',
      body: JSON.stringify(targetPlaylist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
      });
  }

  function handleDeleteTrack(target) {
    const newTracks = tracks.filter((t) => t.track_id !== target);
    setTracks(newTracks);
  }

  function openSnackbar(newMessage) {
    setMessage(newMessage);
    setSnackbar(true);
    setTimeout(() => {
      setSnackbar(false);
    }, 3000);
  }

  function handleDeletePlaylist() {
    const targetPlaylist = {
      "playlist_id": playlist_id,
    }
    fetch('/api/delete-playlist', {
      method: 'POST',
      body: JSON.stringify(targetPlaylist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
      });
  }

  const handleSaveEditedPlaylist = (event) => {
    event.preventDefault();

    const targetPlaylist = {
      "playlist_id": playlist_id,
      "playlist_title": playlistTitle,
      "playlist_tracks": tracks,
    }
    fetch('/api/update-playlist', {
      method: 'POST',
      body: JSON.stringify(targetPlaylist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setPlaylistId(data["playlist_id"])
      });
    openSnackbar("Playlist saved to Spotify.")
  }

  const handleCopyPlaylist = (event) => {
    event.preventDefault();

    const targetPlaylist = {
      "playlist_id": playlist_id,
      "playlist_title": playlistTitle,
      "playlist_tracks": tracks,
    }
    fetch('/api/copy-playlist', {
      method: 'POST',
      body: JSON.stringify(targetPlaylist),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        history.push(`/playlist/${data.playlist_id}`);
      });
  }

  const handleDragEnd = (result) => {
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

  let editable = (USER != null && playlistUser === USER.user_id);

  return (
    <Container>
      <TrackslistUI
        playlistTitle={playlistTitle}
        handleSaveEditedPlaylist={handleSaveEditedPlaylist}
        setPlaylistTitle={setPlaylistTitle}
        handleDeletePlaylist={handleDeletePlaylist}
        handleCopyPlaylist={handleCopyPlaylist}
        handlePlaylistLike={handlePlaylistLike}
        editable={editable}
        tracks={tracks}
        playlistLike={playlistLike}
      // playlistId={platlistId}
      />
      <Container>
        <Table id="playlist_table" hover>
          <TracksHeader
            editable={editable}
          />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tracks.map((track, index) => (
                    <Draggable
                      key={track.uid}
                      draggableId={track.uid}
                      index={index} isDragDisabled={(USER == null || playlistUser !== USER.user_id)}
                    >
                      {(provided, snapshot) => (
                        <tr ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          align="center"
                          scope="row">
                          <Track
                            track={track}
                            index={index}
                            playlistUser={playlistUser}
                            onDeleteTrack={handleDeleteTrack}
                            editable={editable}
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
          <Snackbar
            message={message}
            snackbar={snackbar}
          />
        </Table>
      </Container>
    </Container>
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