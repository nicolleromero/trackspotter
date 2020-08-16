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

const Topbar = (props) => {
  const [user, setUser] = React.useState('')

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
      <Navbar.Collapse className="justify-content-end">
        <Button variant="outline-secondary inline" id="btn-login"
        // onClick={handleLogin()}
        >
          <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>
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