const { Component, useEffect, useRef, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;

const { ReactStructuredQuerySearch } = ReactStructuredQuerySearch;
const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;


function StructuredSearch(props) {

  return (
    <Row className="d-flex justify-content-center inline">
      <Form onSubmit={props.handleSearch}>
        <Form.Row className="inline">
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Control as="select" custom onChange={(e) => props.setPrefix(e.target.value)}>
              <option value="">keyword</option>
              <option value="artist:">artist</option>
              <option value="album:">album</option>
              <option value="genre:">genre</option>
              <option value="year:">year</option>
              {/* <option value="NOT ">NOT</option> */}
            </Form.Control>
          </Form.Group>
          <FormControl
            type="text"
            value={props.param}
            placeholder="Enter a term"
            onChange={(e) => props.setParam(e.target.value)}
            className="mr-sm-2 inline"
          />
          <br />
        </Form.Row>
        <Form.Row>
          <Button
            variant="outline-secondary inline"
            type="submit"
          >
            Search
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
            variant="outline-secondary inline"
            onClick={props.handleReset}
          >
            Clear
              </Button>
        </Form.Row>
      </Form>
    </Row>
  );
}
