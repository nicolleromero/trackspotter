const { Component, useEffect, useRef, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, OverlayTrigger, Row, Table, Tooltip } = ReactBootstrap;

const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;

const PREFIXES = {
  '': 'keyword',
  'artist:': 'artist',
  'album:': 'album',
  'genre:': 'genre',
  'year:': 'year',
};

const OPERATORS = {
  'equals': 'equals',
  'contains': 'contains',
  'starts with': 'starts with',
  'ends with': 'ends with',
};

function StructuredSearch(props) {

  return (
    <Row className="d-flex justify-content-center inline align-items-center start">
      <Form onSubmit={props.handleSearch}>
        <Form.Row className="inline">
          <Col xs="auto" className="inline search-top">
            <Form.Group id="fixeds" controlId="exampleForm.SelectCustom">
              <Form.Control
                as="select"
                custom
                id="fixed"
                value={props.prefix}
                onChange={(e) => props.setPrefix(e.target.value)}
              >
                {Object.keys(PREFIXES).map((key) => {
                  return (
                    <option className="dropdowns" key={key} value={key}>{PREFIXES[key]}</option>
                  )
                }
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs="auto" className="inline search-top">
            <Form.Group controlId="exampleForm.SelectCustom2">
              <Form.Control
                as="select"
                custom
                className="dropdowns"
                value={props.wildcard}
                onChange={(e) => props.setWildcard(e.target.value)}
              >
                {Object.keys(OPERATORS).map((key) => {
                  return (
                    <option key={key} value={key}>{OPERATORS[key]}</option>
                  )
                }
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          {props.prefix !== "genre:" && props.prefix !== "year:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <FormControl
                type="text"
                value={props.param}
                placeholder="Enter a term"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline"
              /></Col>
          )}
          {props.prefix === "year:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <FormControl
                type="text"
                value={props.param}
                placeholder="Enter a year or span"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline"
              /></Col>
          )}
          {props.prefix === "genre:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <Autosuggest
                type="text"
                value={props.param}
                setParam={props.setParam}
                placeholder="Select a genre"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline form-control control"
              />
            </Col>
          )}
          {/* <Col xs="auto" className="inline search-top">
            <NumSongs
              numSongs={props.numSongs}
              onChange={props.onChangeNumSongs}
            />
          </Col> */}
          <Col xs="auto" className="inline search-top">
            <Button
              variant="outline-secondary inline"
              type="submit"
            >
              <i className="fa fa-search-plus"></i> Search
              </Button>
              &nbsp;
              <Button
              variant="outline-secondary inline"
              onClick={props.handleReset}
            >
              Clear
              </Button>
          </Col>
        </Form.Row>
      </Form>
    </Row >
  );
}
