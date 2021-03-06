import React from 'react';
import { Button, Col, Form, FormControl, Row } from 'react-bootstrap';

export function TracksList(props) {
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
              className="title-form truncate"
              readOnly={!props.editable}
            />
          </Col>
        </Form.Row>
        <Form.Row inline className="title">
          <Col xs="auto">
            {props.editable && (
              <Button
                variant="outline-secondary inline search mobile-btn"
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
                disabled={!global.USER}
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
