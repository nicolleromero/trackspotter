const { Autocomplete, Component, useEffect, useRef, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, OverlayTrigger, Row, Table, Tooltip } = ReactBootstrap;

// const { ReactStructuredQuerySearch } = ReactStructuredQuerySearch;
const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
// const { ReactAutocomplete } = ReactAutocomplete;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;

function NumSongs(props) {

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="button-tooltip-2">Number of songs</Tooltip>}
    >
      {({ ref, ...triggerHandler }) => (
        <FormControl
          {...triggerHandler}
          ref={ref}
          type="number"
          min="10"
          max="50"
          step="5"
          value={props.numSongs}
          placeholder="20"
          onChange={(e) => props.onChange(e.target.value)}
          className="mr-sm-2 inline"
        />
      )}
    </OverlayTrigger>
  );
}