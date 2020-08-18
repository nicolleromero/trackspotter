const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;

function SpotifyLogin(callback) {
  var CLIENT_ID = '626611d169544e0983c9fe2344cd84fc';
  var REDIRECT_URI = 'http://localhost:5000/callback';

  function getLoginURL(scopes) {
    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
      '&scope=' + encodeURIComponent(scopes.join(' ')) +
      '&response_type=token';
  }

  var url = getLoginURL([
    'user-read-email'
  ]);

  var width = 450,
    height = 730,
    left = (screen.width / 2) - (width / 2),
    top = (screen.height / 2) - (height / 2);

  window.addEventListener("message", function (event) {
    var hash = JSON.parse(event.data);
    if (hash.type == 'access_token') {
      callback(hash.access_token);
    }
  }, false);

  var w = window.open(url,
    'Spotify',
    'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
  );

}

function getUserData(accessToken) {
  return $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });
}

let user_name = '';

const Topbar = (props) => {

  return (
    <Navbar bg="light" variant="light">
      <Navbar.Brand href="#home">trackspotter
    <img src="/static/img/spot_icon_bw.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="Spotify logo"
          onClick={() => SpotifyLogin()} />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Login />
      <Navbar.Collapse className="justify-content-end">
        <Button variant="outline-secondary inline" id="btn-login"
        // onClick={handleLogin()}
        >
          <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
        Log in to Spotify
    </Button>
        {props.user && (
          <Navbar.Text>
            Signed in as: <a href="#login">Some User</a>
          </Navbar.Text>
        )}
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