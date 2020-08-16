"""CRUD operations."""

from model import db, User, Search, Playlist, PlaylistTrack, PlaylistLike, Track, connect_to_db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc


def create_user(spotify_id, spotify_display_name, created_at, access_token, refresh_token):
    """Create and return a new user."""

    user = User(spotify_id=spotify_id,
                spotify_display_name=spotify_display_name,
                created_at=created_at,
                access_token=access_token,
                refresh_token=refresh_token)

    db.session.add(user)
    db.session.commit()

    return user


def get_users():
    """Return all users."""

    return User.query.all()


def get_user_by_id(user_id):
    """Return details for a specific user"""

    user = User.query.get(user_id)

    return {'user_id': user.user_id, 'spotify_id': user.spotify_id, 'spotify_display_name': user.spotify_display_name}


def create_search(user_id, created_at, query):
    """Create a new search"""

    search = Search(user_id=user_id,
                    created_at=created_at,
                    query=query)

    db.session.add(search)
    db.session.commit()

    return search


def get_searches():
    """Return all searches."""

    return Search.query.all()


def get_search_by_id(search_id):
    """Return details for a specific movie"""

    return Search.query.get(search_id)


def create_track(uid, title, artist, album, release_date, playtime, genre, preview, popularity, album_art):
    """Create a new track"""

    track = Track(uid=uid, title=title, artist=artist, album=album,
                  release_date=release_date, playtime=playtime, genre=genre, preview=preview, popularity=popularity, album_art=album_art)

    db.session.add(track)
    db.session.commit()

    return track


def create_playlist(user_id, search_id, created_at, last_updated_at, playlist_title):
    """Create a new rating"""

    playlist = Playlist(user_id=user_id, search_id=search_id, created_at=created_at,
                        last_updated_at=last_updated_at, playlist_title=playlist_title)

    db.session.add(playlist)
    db.session.commit()

    return playlist


def get_playlists():
    """Return all playlists."""

    return Playlist.query.all()


def create_playlist_track(track_id, playlist_id, track_order):
    """Create a new playlist_track """

    playlist_track = PlaylistTrack(
        track_id=track_id, playlist_id=playlist_id, track_order=track_order)

    db.session.add(playlist_track)
    db.session.commit()

    return playlist_track


def get_playlist_by_playlist_title(playlist_title):
    """Return details for a specific playlist"""

    return Playlist.query.get(playlist_title)


def get_playlist_by_user_id(target_id):
    """Return a user's playlista"""

    return db.session.query(Playlist).filter(Playlist.user_id == target_id).all()


def playlist_ordered_by_likes():
    """Return a list of the top 20 playlists ordered by most likes """

    # SELECT playlist_id, COUNT(*) AS total_num FROM playlist_likes GROUP BY playlist_id ORDER BY total_num DESC;

    return db.session.query(Playlist, db.func.count(PlaylistLike.playlist_id).label(
        'total')).join(PlaylistLike).group_by(Playlist).order_by(desc('total')).limit(20).all()


def create_playlist_like(user_id, playlist_id, created_at):
    """Create a new playlist like """

    playlist_like = PlaylistLike(
        user_id=user_id, playlist_id=playlist_id, created_at=created_at)

    db.session.add(playlist_like)
    db.session.commit()

    return playlist_like


def playlist_likes_by_playlist_title():

    q = db.session.query(Playlist, PlaylistLike).join(PlaylistLike).all()

    return q.group_by(Playlist.playlist_id).count(PlaylistLike.playlist_id).all()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
