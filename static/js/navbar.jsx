const { Component } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  return (
    <Navbar id="topbar">
      <Col className="justify-content-start mr-auto">
        <Navbar.Text>
          <h3>trackspotter</h3>
        </Navbar.Text>
      </Col>
      <Col xs lg="6" className="justify-content-center">
        <Login
          user={props.user}
          onLogin={props.onLogin} />
      </Col>
      <Col className="mr-auto">
        <Navbar.Collapse className="justify-content-end">
          {props.user && (
            <div>
              {props.user.spotify_image_url && (
                <Navbar.Text>
                  <img src={props.user.spotify_image_url} className="avatar" />
                </Navbar.Text>
              )}
              <Button href="/logout" variant="outline-secondary inline" id="btn-login" className="btn-spotify space"
              >
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
              Log In&nbsp;
              <img
                src="/static/img/spot_icon_gr.png"
                width="35"
                height="35">
              </img>
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
        <nav className="navbar center mr-auto">
          <ul className="nav navbar-nav">
            <li className="inline link">
              <Link to="/">Home</Link>
            </li>
            {props.user && (
              <li className="inline link">
                <Link to="/user-playlists"> Saved Playlists</Link>
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
