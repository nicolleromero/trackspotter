const { Autocomplete, Component, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
// const { ReactStructuredQuerySearch } = ReactStructuredQuerySearch;
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
  let [prefix, setPrefix] = React.useState('');
  let [param, setParam] = React.useState('');
  let [wildcard, setWildcard] = React.useState('');
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
    } else if (wildcard === "starts with") {
      newQueries.push(`${prefix}${param}*`);
    } else if (wildcard === "ends with" && prefix !== '') {
      newQueries.push(`${prefix}*${param}`);
    } else if (wildcard === "contains" && prefix !== '') {
      newQueries.push(`${prefix}*${param}*`);
    } else {
      newQueries.push(`${prefix}"${param}"`);
    }


    setQueries(newQueries);
    setWildcard('');
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
    setTracks([]);
    setQueries([]);
    setPlaylistTitle('');
  }

  return (
    <React.Fragment>
      <Container>
        <Row className="d-flex justify-content-left hyper">
          <h1>trackspotter </h1>
        </Row>
      </Container>
      <StructuredSearch
        handleSearch={handleSearch}
        setPrefix={setPrefix}
        setParam={setParam}
        setWildcard={setWildcard}
        handleReset={handleReset}
        param={param}
        prefix={prefix}
        wildcard={wildcard}
      />
      <Container>
        <Row className="d-flex justify-content-between">
          <div xs="auto" className="align-content-left">
            <h5>
              {queries.map((element) => {
                return (
                  <Badge
                    pill
                    className="btn-dark badge"
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
          </div>
          {tracks.length > 0 && USER != null && (
            <Form
              inline
              className="float-right"
              onSubmit={handleSavePlaylist}
            >
              {tracks.length > 0 && USER != null && (
                <Form.Row inline className="float-right inline save">
                  <FormControl
                    type="text"
                    value={playlist_title}
                    placeholder="Playlist Title"
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                    className="mr-sm-2 inline"
                    id="title-form"
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
    </React.Fragment >
  );
}



function TopPlaylists(props) {
  const [top_playlists, setTopPlaylists] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/top-playlists`)
      .then(response => response.json())
      .then((data) => {
        setTopPlaylists(data);
      })
  }, [])

  return (
    <React.Fragment>
      <Container >
        <Row className="align-content-center">
          <Table id="playlist_table" hover>
            <PlaylistHeader
              title="Popular Playlists"
            />
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
        setUserPlaylists(data);
      })
  }, [])

  return (
    <Container>
      <Row className="align-content-center">
        <Table id="playlist_table" hover>
          <PlaylistHeader
            title="Your Playlists"
          />
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
    </Container>
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
      });
  }

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
        setPlaylistId(data["playlist_id"])
      });
  }

  const handleCopyPlaylist = (event) => {
    event.preventDefault();

    const target_playlist = {
      "playlist_id": playlist_id,
      "playlist_title": playlistTitle,
      "playlist_tracks": tracks,
    }
    fetch('/api/copy-playlist', {
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
        playlistLike={playlistLike}
      // playlistId={platlistId}
      />
      <Container>
        <Table id="playlist_table" hover><br />
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