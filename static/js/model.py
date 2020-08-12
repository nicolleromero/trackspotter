"""Models for trackspotter app."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

flask_app = Flask(__name__)
flask_app.secret_key = 'SECRET'


def connect_to_db(flask_app, db_uri='postgresql:///trackspotter', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


connect_to_db(flask_app, "trackspotter")


class User(db.Model):
    """A user"""

    __tablename__ = 'users'

    user_id = db.Column(db.Integer,
                        primary_key=True,
                        autoincrement=True,
                        )
    spotify_id = db.Column(db.String)
    spotify_display_name = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)

    def __repr__(self):
        return f'<User user_id={self.user_id} access_token={self.access_token} refresh_token={self.refresh_token}>'


class Search(db.Model):
    """A saved search query"""

    __tablename__ = 'searches'

    search_id = db.Column(db.Integer,
                          primary_key=True,
                          autoincrement=True,
                          )
    created_at = db.Column(db.DateTime,)
    query = db.Column(db.String)

    user = db.relationship('User', backref='searches')

    def __repr__(self):
        return f'<Search search_id={self.search_id} query={self.query}>'


class Track(db.Model):
    """A track"""

    __tablename__ = 'tracks'

    track_id = db.Column(db.Integer,
                         primary_key=True,
                         autoincrement=True,
                         )
    uid = db.Column(db.String,)
    title = db.Column(db.String)
    artist = db.Column(db.String)
    album = db.Column(db.String)
    release_date = db.Column(db.DateTime)
    genre = db.Column(db.String)
    popularity = db.Column(db.Integer)

    def __repr__(self):
        return f'<Track track_id={self.track_id} uid={self.uid} title={self.title} artist={self.artist} album={self.album}>'


class Playlist(db.Model):
    """A saved playlist"""

    __tablename__ = 'playlists'

    playlist_id = db.Column(db.Integer,
                            primary_key=True,
                            autoincrement=True,
                            )
    created_at = db.Column(db.DateTime)
    last_updated_at = db.Column(db.DateTime)
    playlist_title = db.Column(db.String)
    shares = db.Column(db.Integer)

    user = db.relationship('User', backref='playlists')

    def __repr__(self):
        return f'<Playlist playlist_id={self.playlist_id} created_at={self.created_at} updated_at={self.updated_at} playlist_title={self.playlist_title} shares={self.shares}>'


class PlaylistTrack(db.Model):
    """A playlist-track connection"""

    __tablename__ = 'playlist_tracks'

    playlist_track_id = db.Column(db.Integer,
                                  primary_key=True,
                                  autoincrement=True,
                                  )
    track_order = db.Column(db.Integer)

    track = db.relationship('Track', backref='playlist_tracks')
    playlist = db.relationship('Playlist', backref='playlists')

    def __repr__(self):
        return f'<Playlist-track playlist_track_id={self.playlist_track_id} track_order={self.track_order} track={self.track} playlist={self.playlist}>'


class PlaylistLike(db.Model):
    """A playlist like"""

    __tablename__ = 'playlist_likes'

    playlist_like_id = db.Column(db.Integer,
                                 primary_key=True,
                                 autoincrement=True,
                                 )
    created_at = db.Column(db.DateTime)

    user = db.relationship('User', backref='playlist_likes')
    playlist = db.relationship('Playlist', backref='playlist_likes')

    def __repr__(self):
        return f'<Playlist-track playlist_track_id={self.playlist_track_id} track_order={self.track_order} track={self.track} playlist={self.playlist}>'


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
