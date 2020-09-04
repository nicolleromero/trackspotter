const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  return (
    <Navbar id="topbar">
      <Navbar.Toggle />
      <Login
        user={props.user}
        onLogin={props.onLogin} />
      <Navbar.Collapse className="justify-content-end">
        {props.user && (
          <div>
            <Navbar.Text className="signed-in">
              Signed in as: {props.user.spotify_display_name}
            </Navbar.Text>
            <Button href="/logout" variant="outline-secondary inline" id="btn-login" className="btn-spotify space"
            >
              <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
              Log Out
          </Button>

          </div>
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
              width="32"
              height="32">
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
        <nav className="navbar navbar-expand-lg">
          <ul className="nav navbar-nav">
            <li className="inline">
              <Link to="/"><i class="fa fa-home"></i></Link> |&nbsp;
            </li>
            {props.user && (
              <li className="inline">
                <Link to="/user-playlists"> User Playlists</Link>  |&nbsp;
              </li>
            )}
            <li className="inline">
              <Link to="/top-playlists"> Explore Playlists</Link>
            </li>
          </ul>
        </nav>
      </React.Fragment>
    );

  } else {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg">
          <ul className="nav navbar-nav">
            <li className="inline">
              <Link to="/">Home</Link> |&nbsp;
            </li>
            <li className="inline">
              <Link to="/top-playlists"> Explore Playlists</Link>
            </li>
          </ul>
        </nav>
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
      </React.Fragment>
    );
  }
}
