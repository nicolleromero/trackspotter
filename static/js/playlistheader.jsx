const { Component, useEffect, useRef, useState, useCallback, useMemo } = React;
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

function PlaylistHeader(props) {

  return (
    <React.Fragment>
      {/* <thead>
        <tr align="center">
          <th colSpan="4"><h3 className="title">
            {props.title} &nbsp;🎧
          </h3></th>
        </tr>
      </thead> */}
      <thead id="playlist-thead">
        <tr align="center">
          <th className="col-mobile-badge">SEARCH TERMS</th>
          <th>PLAYLIST TITLE</th>
          <th className="d-none d-sm-table-cell">☆'s</th>
          <th>PLAY</th>
        </tr>
      </thead>
    </React.Fragment>
  );
}