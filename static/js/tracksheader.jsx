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

function TracksHeader(props) {

  return (
    <thead id="playlist-thead">
      <tr align="center">
        <th>   </th>
        <th>TRACK</th>
        <th>TITLE</th>
        <th>ARTIST</th>
        <th>ALBUM</th>
        <th>PLAYTIME</th>
        <th>PLAY</th><th>
          {props.editable && (
            <span><i className="fa fa-trash-o"></i></span>
          )}</th>
      </tr>
    </thead>
  );
}