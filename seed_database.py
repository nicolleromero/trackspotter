"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime
from genres_python import GENRES

import crud
import model
import server


def create_users():
    # Create users from list of sample names
    # NAMES = ['Jonathan Gulgowski', 'Velda Bergstrom', 'Tyra Stehr', 'Karolann Zulauf',
    #          'Augustus Bednar', 'Lenore Crooks', 'Cody Carter', 'Pedro Reilly', 'Gino Nikolaus',
    #          'Van Boehm', 'Abraham Gaylord', 'Abagail Haag', 'Cleora Stracke', 'Earline Hansen',
    #          'Clemens Emmerich', 'Karelle Green', 'Derick Cruickshank', 'Kaley Schaden', 'Vesta Taylor', 'Lisa Gordon']
    NAMES = ['Test Tester']

    users_in_db = []

    for i, name in enumerate(NAMES):
        spotify_id = name.lower().replace(' ', f'{i}')
        spotify_display_name = name
        created_at = datetime.now()
        access_token = None
        refresh_token = None

        user = crud.create_user(
            spotify_id, spotify_display_name, created_at, access_token, refresh_token)

        users_in_db.append(user)

    return users_in_db


def create_tracks(track_data):
    # Create tracks from genre.json files

    items = track_data['tracks']['items']
    tracks_in_genre = []

    for track in items:
        uid, title, artist, album, release_date, playtime, preview, genre, popularity, album_art, release_date = (
            track['id'],
            track['name'],
            track['artists'][0]['name'],
            track['album']['name'],
            track['album']['release_date'],
            track['duration_ms'],
            track['preview_url'],
            track['popularity'],
            track['album']['images'][2]["url"],
            track['album']['release_date'])

        db_track = crud.create_track(uid,
                                     title,
                                     artist,
                                     album,
                                     release_date,
                                     playtime,
                                     preview,
                                     genre,
                                     popularity,
                                     album_art,
                                     release_date)

        tracks_in_genre.append(db_track)

    return tracks_in_genre


def create_searches():
    # Create searches and assign to random users

    created_at = datetime.now()
    # Not sure how best to do this
    query = f'genre:"{genre}"'

    user = choice(users_in_db)  # Select a random user to assign search to
    crud.create_search(user, created_at, query)


def create_playlists(genre):
    # Create playlists and assign to random users

    created_at = datetime.now()
    last_updated_at = datetime.now()
    playlist_title = f'my groovy {genre} playlist'

    crud.create_playlist(user, created_at, last_updated_at, playlist_title)
    playlist = crud.get_playlist_by_playlist_title(playlist_title)

    for i, track in enumerate(tracks_in_genre):

        track = track
        playlist = playlist
        track_order = i

        crud.create_playlist_track(track, playlist, track_order)


def seed():

    os.system('dropdb trackspotter')
    os.system('createdb trackspotter')

    model.connect_to_db(server.app)
    model.db.create_all()

    users_in_db = []
    tracks_in_db = []

    users_in_db = create_users()

    # for genre in GENRES:
    for genre in ['Beach', 'Bop']:

        escaped_genre = genre.replace('/', '-')
        filename = f'genres/{escaped_genre}.json'
        if not os.path.exists(filename):
            continue

        with open(f'genres/{escaped_genre}.json') as f:
            track_data = json.loads(f.read())

        tracks_in_genre = create_tracks(track_data)
        tracks_in_db.append(tracks_in_genre)

        create_searches(genre)
        create_playlists(genre, tracks_in_genre)

        print(genre)

    print()


seed()
