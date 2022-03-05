import React from 'react';

import { NavLink } from './NavLink';

export function NavLinks(props) {
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
            <NavLink
              to="/"
            >
              Home
              </NavLink>
          </li>
          {props.user && (
            <li className="inline link">
              <NavLink
                to="/user-playlists"
              >
                Saved Playlists
              </NavLink>
            </li>
          )}
          <li className="inline link">
            <NavLink
              to="/top-playlists"
            >
              Explore Playlists
              </NavLink>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
}
