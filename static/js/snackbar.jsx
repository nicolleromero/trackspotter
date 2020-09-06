const { Component, PureComponent, useEffect, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, Row, Spinner, Table } = ReactBootstrap;

function Snackbar(props) {
  // const [message, setMessage] = React.useState('');
  // const [snackbar, setSnackbar] = React.useState(false);

  // function openSnackBar(newMessage = 'Playlist saved to Spotify') {
  //   setMessage(newMessage);
  //   setSnackbar(true);
  //   setTimeout(() => {
  //     setSnackbar(false);
  //   }, 3000);
  // }

  return (
    <div className={props.snackbar ? ["snackbar", "show"].join(" ") : "snackbar"}>
      {props.message}
    </div>
  )
}
