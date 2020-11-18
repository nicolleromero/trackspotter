import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

export function PlaylistRow(props) {
  let queries = props.query.replace(/" /g, ',').split(",");

  return (
    <tr align="center" scope="row" key={props.title}>
      <td className="col-mobile-badge"><h5>{queries.map((query) => {
        if (query) {
          return (
            <Badge pill className="btn-dark badge-playlist truncate" key={query}>{query.replace(/"/g, ' ')}</Badge>
          )
        }
      })}</h5></td>
      <td>{props.title}</td>
      <td className="d-none d-sm-table-cell">
        {props.likes < 1 && (
          // <p>{'★'.repeat(props.likes)}{'☆'.repeat(5 - props.likes)}</p>
          <p></p>
        )}
        {props.likes > 0 && props.likes < 6 && (
          <p>{'★'.repeat(props.likes)}</p>
        )}
        {props.likes > 6 && (
          <p>{'★'.repeat(5)}</p>
        )}
      </td>
      <td>
        <Link to={`/playlist/${props.playlist_id}`}>
          <button
            className="btn btn-sm"
          >
            <img
              src="/static/img/transparent-play-button-icon-18.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </button>
        </Link>
      </td>
    </tr>
  );
}
