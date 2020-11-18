import React, { useState } from 'react';
import { Button, Col, Navbar } from 'react-bootstrap';

import { NavLinks } from './NavLinks';

export function Topbar(props) {
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
