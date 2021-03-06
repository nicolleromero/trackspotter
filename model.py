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
    # TODO should be unique, update crud to create or update
    spotify_id = db.Column(db.String)
    spotify_display_name = db.Column(db.String)
    spotify_image_url = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    access_token = db.Column(db.String)
    refresh_token = db.Column(db.String)

    searches = db.relationship('Search')
    playlists = db.relationship('Playlist')

    def __repr__(self):
        return f'<User user_id={self.user_id} spotify_id={self.spotify_id} spotify_display_name={self.spotify_display_name}>'

    def as_dict(self):
        return {
            'user_id': self.user_id,
            'spotify_id': self.spotify_id,
            'spotify_display_name': self.spotify_display_name,
            'spotify_image_url': self.spotify_image_url,
            'created_at': self.created_at,
            'access_token': self.access_token,
            'refresh_token': self.refresh_token,
        }


class Search(db.Model):
    """A saved search query"""

    __tablename__ = 'searches'

    search_id = db.Column(db.Integer,
                          primary_key=True,
                          autoincrement=True,
                          )
    created_at = db.Column(db.DateTime)
    query = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User')

    def __repr__(self):
        return f'<Search search_id={self.search_id} query={self.query}>'

    def as_dict(self):
        return {
            'search_id': self.search_id,
            'created_at': self.created_at,
            'query': self.query,
            'user_id': self.user_id,
        }


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
    release_date = db.Column(db.String)
    playtime = db.Column(db.Integer)
    preview = db.Column(db.String)
    genre = db.Column(db.String)
    popularity = db.Column(db.Integer)
    album_art = db.Column(db.String)

    playlist_tracks = db.relationship('PlaylistTrack')

    def __repr__(self):
        return f'({self.track_id}, "{self.uid}", "{self.title}", "{self.artist}", "{self.album}", "{self.release_date}", {self.playtime}, "{self.preview}", "{self.genre}", {self.popularity}, "{self.album_art}")'

    def as_dict(self):
        return {
            'track_id': self.track_id,
            'uid': self.uid,
            'title': self.title,
            'artist': self.artist,
            'album': self.album,
            'release_date': self.release_date,
            'playtime': self.playtime,
            'preview': self.preview,
            'genre': self.genre,
            'popularity': self.popularity,
            'album_art': self.album_art,
        }


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
    spotify_playlist_id = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    search_id = db.Column(db.Integer, db.ForeignKey('searches.search_id'))

    user = db.relationship('User')

    search = db.relationship('Search')

    def __repr__(self):
        return f'<Playlist playlist_id={self.playlist_id} created_at={self.created_at} last_updated_at={self.last_updated_at} playlist_title={self.playlist_title} spotify_playlist_id={self.spotify_playlist_id}>'

    def as_dict(self):
        return {
            'playlist_id': self.playlist_id,
            'playlist_title': self.playlist_title,
            'user_id': self.user_id,
            'search_id': self.search_id,
            'spotify_playlist_id': self.spotify_playlist_id
        }


class PlaylistTrack(db.Model):
    """A playlist-track connection"""

    __tablename__ = 'playlist_tracks'

    playlist_track_id = db.Column(db.Integer,
                                  primary_key=True,
                                  autoincrement=True,
                                  )
    track_order = db.Column(db.Integer)
    track_id = db.Column(db.Integer, db.ForeignKey('tracks.track_id'))
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.playlist_id'))

    tracks = db.relationship('Track')
    playlists = db.relationship('Playlist')

    def __repr__(self):
        return f'<Playlist-track playlist_track_id={self.playlist_track_id} track_order={self.track_order} track={self.track} playlist={self.playlist}>'

    def as_dict(self):
        return {
            'playlist_track_id': self.playlist_track_id,
            'track_order': self.track_order,
            'track_id': self.track_id,
            'playlist_id': self.playlist_id,
        }


class PlaylistLike(db.Model):
    """A playlist like"""

    __tablename__ = 'playlist_likes'

    playlist_like_id = db.Column(db.Integer,
                                 primary_key=True,
                                 autoincrement=True,
                                 )
    created_at = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.playlist_id'))

    user = db.relationship('User')
    playlist = db.relationship('Playlist')

    def __repr__(self):
        return f'<Playlist_like playlist_like_id={self.playlist_like_id} playlist={self.playlist}>'


if __name__ == '__main__':
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
