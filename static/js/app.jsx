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

// let query = '';
// let queries = [];

function AdvSearch() {
  let [prepend, setPrepend] = React.useState('');
  let [title, setTitle] = React.useState('')
  let [param, setParam] = React.useState('');
  let [items, setTracks] = React.useState([]);
  let [query, setQuery] = React.useState('');
  let [queries, setQueries] = React.useState([]);

  function handleSearch(event) {
    event.preventDefault();
    console.log(`queries: ${queries}, query: ${query}`);

    if (queries.length === 0) {
      if (prepend) {
        query = (prepend + ' ' + param);
      } else {
        query = param;
      }
      setQueries = (queries.push(query));
    } else {
      if (prepend) {
        query = (query + ' ' + prepend + ' ' + param);
        setQueries = (queries.push(prepend + ' ' + param));

      } else {
        query = (query + ' ' + param);
        setQueries = (queries.push(param));
      }
    }
    setQuery(query);
    console.log(`queries: ${queries}, query: ${query}`);

    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(items => {
        setTracks(items);
        setParam('');
        setPrepend('');
        setTitle(''); // Come back to this => not sure why it's not working
      });
  }

  function handleDeleteParam(target) {
    queries = queries.filter((t) => t !== target);
    setQueries(queries);
    query = '';
    setQuery(query);
    console.log(`queries after handoff: ${queries}, query: ${query}`)

    for (let i = 0; i < queries.length; i++) {
      if (i = 0) {
        query = queries[i];
        setQuery(query)
      } else {
        query = query + ' ' + queries[i];
        setQuery(query)
      }
    }

    setParam('');
    setPrepend('');
    console.log(`queries after delete: ${queries}, query: ${query}`)


    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(items => {
        setTracks(items);
        // setTitle(''); // Come back to this => not sure why it's not working
      })
  }

  function handleDelete(target) {
    items = items.filter((t) => t.id !== target);
    setTracks(items);
  }

  function millisToTime(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function handleReset() {
    setParam('');
    setPrepend('');
    setTitle('');
    setTracks([]);
    queries = [];
    setQueries(queries);
    setQuery(''); // how do I get the badges to rerender (now that list is empty)
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
                  <option value="artist:">artist</option>
                  <option value="album:">album</option>
                  <option value="genre:">genre</option>
                  <option value="year:">year</option>
                  <option value="NOT ">NOT</option>
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
              {queries.map((element) => {
                if (element) {
                  return (
                    <Badge
                      pill
                      variant="dark">
                      <Button
                        variant="dark"
                        size="sm"
                        key={element}
                        value={element}
                        onClick={(e) => handleDeleteParam(e.target.value)}
                      >
                        X {element}
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

function TopPlaylists(props) {
  const [top_playlists, setTopPlaylists] = React.useState([]);

  function handleIncrementRating(target) {
    top_playlists.map((key) => {
      console.log(key, target)
      if (key === target) {
        top_playlists[key] += 1;
      }
      console.log(top_playlists[key])
      setTopPlaylists(top_playlists);
    });
  }

  React.useEffect(() => {

    fetch(`/api/top-playlists`)
      .then(response => response.json())
      .then((data) => {
        const top_playlists_list = []
        for (const key in data) {
          console.log(key, data[key])
          top_playlists_list.push(
            <PlaylistItem
              title={key}
              likes={data[key]}
              value={key}
              onClick={handleIncrementRating}
              onClick={props.handleOpenPlaylist}
            />
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

function UserPlaylists(props) {
  const [user_playlists, setUserPlaylists] = React.useState([]);

  React.useEffect(() => {

    fetch(`/api/playlists`)
      .then(response => response.json())
      .then((data) => {
        const user_playlists_list = []
        for (const key in data) {
          console.log(key, data[key])
          user_playlists_list.push(
            <PlaylistItem
              title={key}
              likes={data[key]}
              value={key}
              onClick={props.handleIncrementRating}
              onClick={props.handleIncrementRating}
            />
          )
        }
        setUserPlaylists(user_playlists_list);
      })
  }, [])


  return (
    <Container >
      <Row className="align-content-center">
        <Table id="playlist_table" hover>
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
            {user_playlists}
          </tbody>
        </Table>
      </Row>
    </Container >
  )
}

let playlist_tracks = [[1, "3aQz0z86zrKjd1mcZlonxE", "Infinity 2008 - Klaas Vocal Edit", "Guru Josh Project", "Infinity 2008", "2008-05-07", 192294, "https://p.scdn.co/mp3-preview/9da076eb20507c0624c80954ee8d7788599f79df?cid=774b29d4f13844c495f206cafdad9c86", "Acid House", 73, "https://i.scdn.co/image/ab67616d0000485179bdd5b6d6fea02adcb017e9"], [2, "3ylER3O8efY7RdeZHZuexW", "I'll Take You There - Director's Cut Classic Signature Radio Version", "Frankie Knuckles", "I'll Take You There", "2019-08-23", 255259, "https://p.scdn.co/mp3-preview/415ae0917d23257434397607c062dea2e3cd3fc5?cid=774b29d4f13844c495f206cafdad9c86", "Acid House", 56, "https://i.scdn.co/image/ab67616d000048514aa9087b9d7afd60798496f9"], [3, "3YXIVMQLRRq2K7kxC7UYx6", "Move Your Body", "Marshall Jefferson", "Move Your Body", "2019-10-18", 196109, "https://p.scdn.co/mp3-preview/a0c079e12f2a6dbb5fe06460a6eb49350f4be8a6?cid=774b29d4f13844c495f206cafdad9c86", "Acid House", 64, "https://i.scdn.co/image/ab67616d000048514bbb5b8545f94dfec79544ae"], [4, "6ZTdvFWrzZc7CUEaVV0NmO", "Infinity - Klaas Vocal Mix", "Guru Josh Project", "Ultra Weekend 5 (Jason Nevins Presents)", "2009-06-30", 226480, "https://p.scdn.co/mp3-preview/77fd4f4c2d17058c6e71c2a858771c68678aad87?cid=774b29d4f13844c495f206cafdad9c86", "Acid House", 43, "https://i.scdn.co/image/ab67616d00004851c7ee6f97091e13165bb80a4f"]];

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
      <td>
        <h4>{'♪'.repeat(props.likes)}</h4>
        <button
          className="btn btn-sm"
          onClick={props.handleIncrementRating}
        >
        </button>
      </td>
      <td><button
        className="btn btn-sm"
        onClick={props.handleOpenPlaylist}
      >
        <img
          src="/static/img/transparent-play-button-icon-18.jpg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      </button>
      </td>
    </tr >
  )
}


const PlaylistTracks = ({ match }) => {
  const {
    params: { paylist_id },
  } = match;
  let [items, setTracks] = React.useState([]);

  function handleOpenPlaylist() {

    React.useEffect(() => {
      fetch(`/api/playlists/${playlist_id}`, {})
        .then((response) => response.json())
        .then((items) => {
          setTracks(items);
        })
    }, [playlist_id]);
  }

  function handleDelete(target) {
    items = items.filter((t) => t.id !== target);
    setTracks(items);
  }

  function millisToTime(milliseconds) {
    var minutes = Math.floor(milliseconds / 60000);
    var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
                    >
                    </iframe></td> */}
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
            <li className="inline">
              {/* <Link to={`/user-playlist/${playlist_id}`}>{playlist_title}</Link> */}
            </li>
          </ul>
        </nav>


        <Switch>
          <Route exact path="/" component={AdvSearch} />
          <Route exact path="/user-playlists" component={UserPlaylists} />
          <Route exact path="/top-playlists" component={TopPlaylists} />
          <Route path="/user-playlists/:playlist_id" component={PlaylistTracks} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));