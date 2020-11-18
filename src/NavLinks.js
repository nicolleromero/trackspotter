import React from 'react';
import { Link } from 'react-router-dom';

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
    </React.Fragment>
  );
}
