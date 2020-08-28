const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
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
        onLogin={props.onLogin} />
      <Navbar.Collapse className="justify-content-end">
        {props.user && (
          <Button href="/logout" variant="outline-secondary inline" id="btn-login" className="btn-spotify"
          >
            <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
              Log Out
          </Button>
        )}
        {!props.user && (
          <Button
            className="btn-spotify"
            href="/login"
            variant="outline-secondary inline"
            id="btn-login"
          >
            <img
              src="/static/img/spot_icon_gr.png"
              width="30"
              height="30">
            </img>&nbsp;
            Log in to Spotify
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

function Login(props) {
  // Allows for assigning a seeded user during dev; remove for prod
  const [userId, setUserId] = React.useState('');

  if (props.user) {
    return (
      <React.Fragment>
        <Navbar.Text>
          Signed in as: <a href="#login">{props.user.spotify_display_name}</a>
        </Navbar.Text>
      </React.Fragment>
    );

  } else {
    return (
      <Form.Row>
        <FormControl
          type="text"
          value={userId}
          placeholder="Enter user_id"
          onChange={(e) => setUserId(e.target.value)}
          className="lg-1 inline"
          id="log-in"
        />&nbsp;&nbsp;
        <Button
          variant="outline-secondary"
          href={`/devlogin/${userId}`}
        >
          Dev Log In
          </Button>
      </Form.Row>
    );
  }
}
