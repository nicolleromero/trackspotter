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


function TrackslistUI(props) {

  return (

    <Row className="d-flex justify-content-between" id="tracks-header">
      <div className="float-left title">
        <h3>
          {props.playlistTitle}
        </h3>
      </div>
      <Form
        inline
        onClick={props.handleSaveEditedPlaylist}>
        <Form.Row inline className="float-right">
          <Col xs="auto" >
            {props.editable && (
              <FormControl
                type="text"
                value={props.playlistTitle}
                placeholder="Playlist Title"
                onChange={(e) => props.setPlaylistTitle(e.target.value)}
                className="inline"
                id="title-form"
              />
            )}
          </Col>
          <Col xs="auto" >
            {props.editable && (
              <Button
                variant="dark inline"
                onClick={props.handleDeletePlaylist}
              > Delete Playlist
              </Button>
            )}
            {' '}
            {props.editable && (
              <Button
                variant="outline-secondary inline"
                type="submit"
              > Save Playlist to Spotify
              </Button>
            )}
            {!props.editable && (
              <Button
                variant="outline-secondary inline"
                onClick={props.handleCopyPlaylist}
              > Copy Playlist
              </Button>
            )}
            {!props.playlistLike && (
              <span inline className="float-right"><button
                className="btn btn-sm inline"
                onClick={props.handlePlaylistLike}
              >
                <h4>☆</h4>
              </button></span>
            )}
            {props.playlistLike && (
              <span inline className="float-right"><button
                className="btn btn-sm inline"
                onClick={props.handlePlaylistLike}
              >
                <h4>★</h4>
              </button></span>
            )}
          </Col>
        </Form.Row>
      </Form>
    </Row>
  );
}