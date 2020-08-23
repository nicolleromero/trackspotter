const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  const [user_id, setUserId] = React.useState('');
  const [name, setName] = React.useState('')
  const [access_token, setAccessToken] = React.useState('')

  const CLIENT_ID = '626611d169544e0983c9fe2344cd84fc';
  const REDIRECT_URI = 'http://localhost:5000/callback';
  const SCOPES = ["playlist-modify-public", "playlist-modify-private"];

  function handleSpotLogin() {

    // function getLoginURL(scopes) {
    //   return 'https://accounts.spotify.com/authorize' + '?response_type=code' +
    //     '&client_id=' + CLIENT_ID +
    //     '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    //     '&scope=' + encodeURIComponent(scopes.join(' '));
    //   // '&response_type=token';
    // }

    const url = getLoginURL(SCOPES);

    fetch('/api/spotify-login?url')
      .then(response => response.json())
      .then(data => {
        setUser(data);
        console.log(data);
      });

    fetch('/callback')
      .then(response => response.json())
      .then(data => {
        setAccessToken(data);
        console.log(data)
      });

    //   // const width = 450,
    //   //   height = 730,
    //   //   left = (screen.width / 2) - (width / 2),
    //   //   top = (screen.height / 2) - (height / 2);

    //   // window.addEventListener("message", (event) => {
    //   //   const data = JSON.parse(event.data);
    //   //   if (data.type == 'access_token') {
    //   //     // callback(hash.access_token);
    //   //     setAccessToken(data.access_token);
    //   //     w.close(); // how do I close the window so user info doesn't appear there?
    //   //   }
    //   // }, false);

    //   // const w = window.open(
    //   //   url,
    //   //   'Spotify',
    //   //   'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    //   // );


    function handleSpotLogout() {
      props.setUser('');
      setAccessToken('');

    }
  }

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
      <Login
        user={props.user}
        onLogin={props.onLogin}
        onLogout={props.onLogout} />
      <Navbar.Collapse className="justify-content-end">
        {props.user && (
          <Button variant="outline-secondary inline" id="btn-login"
          // onClick={handleSpotLogout}
          >
            <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
              Log Out
          </Button>
        )}
        {!props.user && (
          <Button variant="outline-secondary inline" id="btn-login"
            onClick={handleSpotLogin}
          >
            <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
            Log in to Spotify
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );



  function Login(props) {
    // Allows for assigning a seeded user during dev; remove for prod

    function handleSetUser(event) {
      event.preventDefault();

      fetch(`/api/handle-login?query=${encodeURIComponent(user_id)}`)
        .then(response => response.json())
        .then((user) => {
          console.log(user.name, user.user_id, Boolean(user))
          props.onLogin(user)
        });

    }


    if (props.user) {
      return (
        <React.Fragment>
          <Navbar.Text>
            Signed in as: <a href="#login">{props.user.spotify_display_name}</a>
          </Navbar.Text>
          <Col>
            <Button
              variant="outline-secondary"
              type="submit"
              onClick={props.onLogout}
            >
              Log Out
            </Button>
          </Col>
        </React.Fragment>
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
              Log In
            </Button>
          </Form.Row>
        </Form>
      );
    }
  }
}
