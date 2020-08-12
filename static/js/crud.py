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
    """Create and return a new movie"""

    movie = Movie(user_id=user_id,
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


def create_track(user_id, movie, score):
    """Create a new track"""

    track = Track(uid=uid, title=title, artist=artist, album=album,
                  release_date=release_date, genre=genre, popularity=popularity)

    db.session.add(track)
    db.session.commit()

    return rating


def create_rating(user_id, movie, score):
    """Create a new rating"""

    rating = Rating(user_id=user_id, movie=movie, score=score)

    db.session.add(rating)
    db.session.commit()

    return rating


def create_rating(user_id, movie, score):
    """Create a new rating"""

    rating = Rating(user_id=user_id, movie=movie, score=score)

    db.session.add(rating)
    db.session.commit()

    return rating


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
