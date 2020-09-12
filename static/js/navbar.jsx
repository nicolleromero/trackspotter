const { Component } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Nav, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar id="topbar" expand="lg" expanded={expanded}>
      <Navbar.Text>
        <h3>trackspotter</h3>
      </Navbar.Text>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded((prevExpanded) => (prevExpanded = !prevExpanded))}
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Col className="mr-auto">
          <NavLinks
            user={props.user}
            onLogin={props.onLogin}
            onClick={() => setExpanded(false)}
          />
        </Col>
        <Navbar.Brand className="justify-content-end right-nav">
          {props.user && (
            <React.Fragment>
              {props.user.spotify_image_url && (
                <Navbar.Text>
                  <img src={props.user.spotify_image_url} className="avatar" />
                </Navbar.Text>
              )}
              <Button href="/logout" variant="outline-secondary inline" id="btn-login" className="btn-spotify space"
              >
                Log Out
              </Button>
            </React.Fragment>
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
        </Navbar.Brand>
      </Navbar.Collapse>
    </Navbar>
  );
}

function NavLinks(props) {
  // Allows for assigning a seeded user during dev; remove for prod
  const [userId, setUserId] = React.useState('');

  return (
    <React.Fragment>
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
      <nav className="navbar center-nav mr-auto" onClick={props.onClick}>
        <ul className="nav navbar-nav">
          <li className="inline link">
            <Link
              to="/"
            >
              Home
              </Link>
          </li>
          {props.user && (
            <li className="inline link">
              <Link
                to="/user-playlists"
              >
                Saved Playlists
              </Link>
            </li>
          )}
          <li className="inline link">
            <Link
              to="/top-playlists"
            >
              Explore Playlists
              </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment >
  );
}
