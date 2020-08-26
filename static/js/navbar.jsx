const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Form, FormControl, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Topbar(props) {
  const [user_id, setUserId] = React.useState('');

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
          <Button href="/logout" variant="outline-secondary inline" id="btn-login"
          >
            <img src="/static/img/spot_icon_gr.png" width="30" height="30"></img>&nbsp;
              Log Out
          </Button>
        )}
        {!props.user && (
          <Button
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
              Prod Log In
            </Button>
          </Form.Row>
        </Form>
      );
    }
  }
}
