const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  return (
    <Navbar id="topbar">
      <Col className="justify-content-start">
        <Navbar.Text>
          <h3>trackspotter</h3>
        </Navbar.Text>
      </Col>
      <Col className="justify-content-center">
        <Login
          user={props.user}
          onLogin={props.onLogin} />
      </Col>
      <Col>
        <Navbar.Collapse className="justify-content-end">
          {props.user && (
            <div>
              <Navbar.Text>
                <img src={props.user.spotify_image_url} className="avatar" />
              </Navbar.Text>
              <Button href="/logout" variant="outline-secondary inline" id="btn-login" className="btn-spotify space"
              >
                {/* <img src="/static/img/spot_icon_gr.png" width="35" height="35"></img>&nbsp; */}
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
                width="35"
                height="35">
              </img>&nbsp;
            Log in to Spotify
            </Button>
          )}
        </Navbar.Collapse>
      </Col>
    </Navbar>
  );
}

function Login(props) {
  // Allows for assigning a seeded user during dev; remove for prod
  const [userId, setUserId] = React.useState('');

  if (props.user) {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg center">
          <ul className="nav navbar-nav">
            <li className="inline link">
              <Link to="/">Home</Link>
            </li>
            {props.user && (
              <li className="inline link">
                <Link to="/user-playlists"> Your Playlists</Link>
              </li>
            )}
            <li className="inline link">
              <Link to="/top-playlists"> Explore Playlists</Link>
            </li>
          </ul>
        </nav>
      </React.Fragment >
    );

  } else {
    return (
      <React.Fragment>
        <Form.Row className="justify-content-center">
          {/* <div className="d-flex float-left log-in">
            <FormControl
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="inline"
              id="log-in"
            />
            <Button
              variant="outline-secondary"
              href={`/devlogin/${userId}`}
              className="inline btn-spotify log-in"
            >
              Dev
          </Button>
          </div> */}
          <nav className="navbar navbar-expand-lg center">
            <ul className="nav navbar-nav">
              <li className="inline link">
                <Link to="/">Home</Link>
              </li>
              <li className="inline link">
                <Link to="/top-playlists"> Explore Playlists</Link>
              </li>
            </ul>
          </nav>
        </Form.Row>
      </React.Fragment>
    );
  }
}
