const { Component, PureComponent, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Spinner, Table } = ReactBootstrap;

function Snackbar(props) {

  return (
    <div className={props.snackbar ? ["snackbar", "show"].join(" ") : "snackbar"}>
      {props.message}
    </div>
  )
}
