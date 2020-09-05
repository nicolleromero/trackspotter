"""CRUD operations."""

from model import db, User, Search, Playlist, PlaylistTrack, PlaylistLike, Track, connect_to_db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import asc, desc
import json
from datetime import datetime


def create_user(spotify_id, spotify_display_name, spotify_image_url, created_at, access_token, refresh_token):
    """Create and return a new user."""

    user = User(spotify_id=spotify_id,
                spotify_display_name=spotify_display_name,
                spotify_image_url=spotify_image_url,
                created_at=created_at,
                access_token=access_token,
                refresh_token=refresh_token)

    db.session.add(user)
    db.session.commit()

    return user


def get_all_users():
    """Return all users."""

    return User.query.all()


def get_user_by_id(user_id):
    """Return details for a specific user as a dict"""

    user = User.query.get(user_id)

    return {'user_id': user.user_id, 'spotify_id': user.spotify_id, 'spotify_display_name': user.spotify_display_name, 'spotify_image_url': user.spotify_image_url}


def get_user(user_id):
    """Return details for a specific user"""

    user = User.query.get(user_id)

    return user


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


def create_track_return_as_dict(uid, title, artist, album, release_date, playtime, genre, preview, popularity, album_art):
    """Create a new track"""

    track = Track(uid=uid, title=title, artist=artist, album=album,
                  release_date=release_date, playtime=playtime, genre=genre, preview=preview, popularity=popularity, album_art=album_art)

    db.session.add(track)
    db.session.commit()

    return track.as_dict()


def get_track_by_track_id(track_id):
    """Return track object with that track_id """

    return Track.query.get(track_id)


def get_track_by_track_uid(uid):
    """Return track obejct with that track_uid """

    return Track.query.filter(Track.uid == uid).first()


def create_playlist(user_id, search_id, created_at, last_updated_at, playlist_title, spotify_playlist_id=None):
    """Create a new playlist"""

    playlist = Playlist(user_id=user_id, search_id=search_id, created_at=created_at,
                        last_updated_at=last_updated_at, playlist_title=playlist_title, spotify_playlist_id=spotify_playlist_id)

    db.session.add(playlist)
    db.session.commit()

    return playlist


def create_playlist_return_as_dict(user_id, search_id, created_at, last_updated_at, playlist_title, spotify_playlist_id=None):
    """Create a new playlist and return as dict"""

    playlist = Playlist(user_id=user_id, search_id=search_id, created_at=created_at,
                        last_updated_at=last_updated_at, playlist_title=playlist_title, spotify_playlist_id=spotify_playlist_id)

    db.session.add(playlist)
    db.session.commit()

    return playlist.as_dict()


def get_playlists():
    """Return all playlists."""

    return Playlist.query.all()


def get_playlist_tracks():

    playlist_tracks = PlaylistTrack.query.all()

    for playlist_track in playlist_tracks:
        print(playlist_track.as_dict())

    return playlist_tracks


def get_playlist_by_id(playlist_id):
    """Return playlist object by playlist_id """

    return Playlist.query.get(playlist_id)


def create_playlist_track(track_id, playlist_id, track_order):
    """Create a new playlist_track """

    playlist_track = PlaylistTrack(
        track_id=track_id, playlist_id=playlist_id, track_order=track_order)

    db.session.add(playlist_track)
    db.session.commit()

    return playlist_track


def get_playlist_by_user_id(target_id):
    """Return a user's playlists"""

    results = db.session.query(Playlist, db.func.count(PlaylistLike.playlist_id).label(
        'total')).join(Playlist.search).outerjoin(PlaylistLike).group_by(Playlist).filter(Playlist.user_id == target_id).order_by(desc('total')).all()

    user_playlists = []

    for playlist, count in results:
        dictionary = playlist.as_dict()
        dictionary['count'] = count
        dictionary['query'] = playlist.search.query

        user_playlists.append(dictionary)

    return user_playlists


def playlist_ordered_by_likes():
    """Return a list of the top 20 playlists ordered by most likes """

    results = db.session.query(Playlist, db.func.count(PlaylistLike.playlist_id).label(
        'total')).join(Playlist.search).outerjoin(PlaylistLike).group_by(Playlist).order_by(desc('total')).limit(20).all()

    playlists_by_likes = []

    for playlist, count in results:
        dictionary = playlist.as_dict()
        dictionary['count'] = count
        dictionary['query'] = playlist.search.query

        playlists_by_likes.append(dictionary)

    return playlists_by_likes


def create_playlist_like(user_id, playlist_id):
    """Create a new playlist like """

    created_at = datetime.now()

    playlist_like = PlaylistLike(
        user_id=user_id, playlist_id=playlist_id, created_at=created_at)

    db.session.add(playlist_like)
    db.session.commit()

    return playlist_like


def update_playlist_like(user_id, playlist_id):

    playlist_like = db.session.query(PlaylistLike).filter(
        PlaylistLike.user_id == user_id, PlaylistLike.playlist_id == playlist_id).first()

    if playlist_like is None:
        create_playlist_like(user_id, playlist_id)
        result = "playlist like created"

    else:
        db.session.query(PlaylistLike).filter(
            PlaylistLike.user_id == user_id, PlaylistLike.playlist_id == playlist_id).delete()
        result = "deleted"

    db.session.commit()

    return result


def playlist_likes_by_playlist_title():

    q = db.session.query(Playlist, PlaylistLike).join(PlaylistLike)

    return q.group_by(Playlist.playlist_id).count(PlaylistLike.playlist_id).all()


def get_playlist_like_by_user(user_id, playlist_id):

    return db.session.query(PlaylistLike).filter(
        PlaylistLike.user_id == user_id, PlaylistLike.playlist_id == playlist_id).first()


def get_playlist_query():

    return db.session.query(Playlist.playlist_title, Search.query).join(Search).all()


def delete_track_from_playlist(playlist_id, track_id):

    playlist_track = db.session.query(PlaylistTrack).filter(
        PlaylistTrack.track_id == track_id, PlaylistTrack.playlist_id == playlist_id).delete()

    db.session.commit()

    return ("deleted")


def tracks_in_playlist_ordered(target_playlist_id):
    """Return a list of the tracks in a playlist in order """

    tracks = db.session.query(Track).join(PlaylistTrack).filter(
        PlaylistTrack.track_id == Track.track_id, PlaylistTrack.playlist_id == target_playlist_id).order_by(asc(PlaylistTrack.track_order)).all()

    return [track.as_dict() for track in tracks]


def create_tracks_and_playlist_tracks_for_playlist(tracks_in_playlist, playlist_id):
    """On clicking Save Playlist  """

    tracks = tracks_in_playlist
    created_tracks = []

    for track in tracks:
        # track.id from client == track.uid in db
        uid = track['id']
        db_track = get_track_by_track_uid(uid)
        print("***************", db_track is not None)

        # not db.session.query(db.session.query(Track).filter_by(uid=uid).exists()).scalar():
        if db_track is None:

            uid, title, artist, album, release_date, playtime, preview, popularity, album_art = (
                track['id'],
                track['name'],
                track['artists'][0]['name'],
                track['album']['name'],
                track['album']['release_date'],
                track['duration_ms'],
                track['preview_url'],
                track['popularity'],
                track['album']['images'][2]["url"])

            db_track = create_track(uid=uid,
                                    title=title,
                                    artist=artist,
                                    album=album,
                                    release_date=release_date,
                                    playtime=playtime,
                                    preview=preview,
                                    popularity=popularity,
                                    album_art=album_art,
                                    genre=None)

        created_tracks.append(db_track)
        print("***************dbtrack", db_track)

    for track_order, track in enumerate(created_tracks, start=1):

        create_playlist_track(
            track_id=track.track_id, playlist_id=playlist_id, track_order=track_order)

    return created_tracks


def update_edited_playlist(playlist_id, playlist_title, playlist_tracks, spotify_playlist_id=None):

    playlist = get_playlist_by_id(playlist_id)

    # update playlist title and updated_at
    playlist.playlist_title = playlist_title
    playlist.last_updated_at = datetime.now()
    playlist.spotify_playlist_id = spotify_playlist_id

    # delete all existing playlist_track associations
    db.session.query(PlaylistTrack).filter(
        PlaylistTrack.playlist_id == playlist_id).delete()

    # remake the playlist_track associations
    for track_order, track in enumerate(playlist_tracks, start=1):
        create_playlist_track(
            track_id=track['track_id'], playlist_id=playlist_id, track_order=track_order)

    db.session.commit()

    return playlist


def copy_playlist(user_id, original_playlist_id, playlist_tracks, spotify_playlist_id=None):

    original_playlist = get_playlist_by_id(original_playlist_id)

    created_at = datetime.now()
    last_updated_at = datetime.now()
    playlist_title = "Copy of " + original_playlist.playlist_title

    new_playlist = create_playlist(
        user_id, original_playlist.search_id, created_at, last_updated_at, playlist_title, spotify_playlist_id=None)

    # make new playlist_track associations
    for track_order, track in enumerate(playlist_tracks, start=1):
        create_playlist_track(
            track_id=track['track_id'], playlist_id=new_playlist.playlist_id, track_order=track_order)

    db.session.commit()

    return new_playlist


def delete_playlist(playlist_id):
    """Create a zombie playlist"""

    playlist = get_playlist_by_id(playlist_id)

    playlist.user_id = None

    db.session.commit()

    return None


def get_user_or_add_user(spotify_id, display_name, display_image, token=None):
    """Fetch an existing user or create a user"""

    user = User.query.filter(User.spotify_id == spotify_id).first()

    if user is None:

        spotify_id = spotify_id
        spotify_display_name = display_name
        spotify_image_url = display_image
        created_at = datetime.now()
        access_token = None
        refresh_token = token.refresh_token if token else None

        user = create_user(
            spotify_id, spotify_display_name, spotify_image_url, created_at, access_token, refresh_token)

    elif token:
        user.refresh_token = token.refresh_token
        user.spotify_image_url = display_image
        db.session.commit()

    return user


def get_access_token_for_user(user_id):

    access_token = db.session.query(User.access_token).filter(
        User.user_id == user_id).first()

    return access_token


if __name__ == '__main__':
    from server import app
    connect_to_db(app)


# Test Script
# def test_script():
#     user_id = 1
#     playlist_title = "Best of Dido"
#     created_at = datetime.now()
#     last_updated_at = datetime.now()
#     search = create_search(user_id, created_at, query="dido")
#     playlist = create_playlist(user_id, search.search_id,
#                                created_at, last_updated_at, playlist_title, spotify_playlist_id=None)
#     sample = json.load(open("dido_data.json"))
#     tracks_in_playlist = sample['tracks']['items']

#     result = create_tracks_and_playlist_tracks_for_playlist(
#         tracks_in_playlist, playlist.playlist_id)

#     print(result)

#     return result
