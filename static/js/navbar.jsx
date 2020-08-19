const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;

let user_name = '';
let user_data = '';

function Topbar() {
  const [user_id, setUserId] = React.useState('');
  const [user, setUser] = React.useState({});
  const [name, setName] = React.useState('')
  const [access_token, setAccessToken] = React.useState('')

  const CLIENT_ID = '626611d169544e0983c9fe2344cd84fc';
  const REDIRECT_URI = 'http://localhost:5000/callback';
  const SCOPES = ["user-read-private", "playlist-modify-public", "playlist-modify-private", "streaming"];

  function handleSpotLogin() {

    function getLoginURL(scopes) {
      return 'https://accounts.spotify.com/authorize' + '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(scopes.join(' '));
      // '&response_type=token';
    }

    const url = getLoginURL(SCOPES);

    // fetch('/api/spotify-login?url')
    //   .then(response => response.json())
    //   .then(data => {
    //     setUser(data);
    //     console.log(data); // this doesn't work right now
    //   });

    // const width = 450,
    //   height = 730,
    //   left = (screen.width / 2) - (width / 2),
    //   top = (screen.height / 2) - (height / 2);

    // window.addEventListener("message", (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type == 'access_token') {
    //     // callback(hash.access_token);
    //     setAccessToken(data.access_token);
    //     w.close(); // how do I close the window so user info doesn't appear there?
    //   }
    // }, false);

    // const w = window.open(
    //   url,
    //   'Spotify',
    //   'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    // );

    // fetch('/callback')
    //   .then(response => response.json())
    //   .then(data => {
    //     setAccessToken(data);
    //     console.log(data)
    //   });
  }


  function handleSpotLogout() {
    setUser('');
    setAccessToken('');

  }

  if (user_data) {
    return (
      <Button variant="outline-secondary inline" id="btn-login"
        onClick={handleSpotLogout}
      >
        <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
          Log Out
      </Button>
    );

  } else {
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand href="#home">trackspotter
      <img src="/static/img/spot_icon_bw.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Spotify logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Login />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-secondary inline" id="btn-login"
            onClick={handleSpotLogin}
          >
            <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
          Log in to Spotify
      </Button>
        </Navbar.Collapse>
      </Navbar>
    );

  }

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

    user_name = name;

    if (name) {
      return (
        <Navbar.Text>
          Signed in as: <a href="#login">{name}</a>
        </Navbar.Text>
      );

    } else {
      return (

        <Form inline onSubmit={handleSetUser}>
          <Form.Row>
            <FormControl
              type="text"
              value={user_id}
              placeholder="Enter user_id"
              onChange={(e) => setUserId(e.target.value)}
              className="lg-1 inline"
              id="log-in"
            />&nbsp;&nbsp;
          <Button
              variant="outline-secondary"
              type="submit"
            >
              Log in
              </Button>
          </Form.Row>
        </Form>

      );
    }
  }
}