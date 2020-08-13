"""CRUD operations."""

from model import db, User, Search, Playlist, PlaylistTrack, PlaylistLike, Track, connect_to_db


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

    return User.query.get(user_id)


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


def create_track(uid, title, artist, album, release_date, playtime, genre, popularity, album_art):
    """Create a new track"""

    track = Track(uid=uid, title=title, artist=artist, album=album,
                  release_date=release_date, playtime=playtime, genre=genre, popularity=popularity, album_art=album_art)

    db.session.add(track)
    db.session.commit()

    return track


def create_playlist(user_id, search_id, created_at, last_updated, playlist_title, shares):
    """Create a new rating"""

    playlist = Playlist(user_id=user_id, search_id=search_id, created_at=created_at,
                        last_updated=last_updated, playlist_title=playlist_title, shares=shares)

    db.session.add(playlist)
    db.session.commit()

    return playlist


def create_playlist_track(track, playlist, track_order):
    """Create a new playlist_track """

    playlist_track = PlaylistTrack(
        track_id=track_id, playlist_id=playlist_id, track_order=track_order)

    db.session.add(playlist_track)
    db.session.commit()

    return playlist_track


def get_playlist_by_playlist_title(playlist_title):
    """Return details for a specific playlist"""

    return Playlist.query.get(playlist_title)


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
