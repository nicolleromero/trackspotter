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

  // function handleCopyURLtoClipboard() {
  //   let shareURL = "http://localhost:5000/playlist/" + props.PlaylistId
  //   return shareURL
  // }

  return (
    <Row id="tracks-header">
      <Form
        inline
        className="flex-grow-1 justify-content-between"
        onSubmit={props.handleSaveEditedPlaylist}>
        <Form.Row inline className="title">
          <Col xs="auto">
            <FormControl
              type="text"
              value={props.playlistTitle}
              placeholder="Playlist Title"
              onChange={(e) => props.setPlaylistTitle(e.target.value)}
              id="title-form"
              readOnly={!props.editable}
            />
          </Col>
        </Form.Row>
        <Form.Row inline className="title">
          <Col xs="auto">
            {props.editable && (
              <Button
                variant="dark inline search"
                onClick={props.handleDeletePlaylist}
              > Delete Playlist
              </Button>
            )}
            {' '}
            {props.editable && (
              <Button
                variant="outline-secondary inline search"
                type="submit"
              > Save to
                <img
                  src="/static/img/spot_icon_gr.png"
                  width="32"
                  height="32">
                </img>
              </Button>
            )}
            {!props.editable && (
              <Button
                variant="outline-secondary inline search"
                onClick={props.handleCopyPlaylist}
                disabled={!USER}
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