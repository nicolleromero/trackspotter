const { Component, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;


function PlaylistRow(props) {
  let queries = props.query.replace(/" /g, ',').split(",");

  return (
    <tr align="center" scope="row" key={props.title}>
      <td><h5>{queries.map((query) => {
        if (query) {
          return (
            <Badge pill className="btn-dark badge">{query.replace(/"/g, ' ')}</Badge>
          )
        }
      })}</h5></td>
      <td>{props.title}</td>
      <td>
        {props.likes < 5 && (
          <p>{'★'.repeat(props.likes)}{'☆'.repeat(5 - props.likes)}</p>
        )}
        {props.likes > 4 && (
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
    </tr >
  )
}