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
    NAMES = ['Jonathan Gulgowski', 'Velda Bergstrom', 'Tyra Stehr', 'Karolann Zulauf',
             'Augustus Bednar', 'Lenore Crooks', 'Cody Carter', 'Pedro Reilly', 'Gino Nikolaus',
             'Van Boehm', 'Abraham Gaylord', 'Abagail Haag', 'Cleora Stracke', 'Earline Hansen',
             'Clemens Emmerich', 'Karelle Green', 'Derick Cruickshank', 'Kaley Schaden', 'Vesta Taylor', 'Lisa Gordon',
             'Pauline Little', 'Barrett Hamill', 'Jamaal Hilll', 'Lexi Waelchi', 'Chauncey Rosenbaum', 'Marshall Cole',
             'Mabel Nicolas', 'Verdie Lueilwitz', 'Augustine Bosco', 'Sunny Okuneva', 'Kirstin Balistreri',
             'Wade Franecki', 'Lucinda Klein', 'Vanessa Hoeger', 'Stephanie Smith', 'Oma Muller', 'Herta Towne',
             'Retha Schowalter', 'Nikita Mraz', 'Antonina Wintheiser', 'Demarcus Schowalter', 'Christina Ruecker',
             'Willis Flatley', 'Wyman Cartwright', 'Wade Fahey', 'Stacey Nikolaus', 'Chance Vandervort',
             'Willis Predovic', 'Zoila Stokes', 'Hobart Herman', 'Pinkie Friesen', 'Wyatt Miller',
             'Zackary Russel', 'Wallace Smith', 'Juwan Hirthe', 'Madonna Adams', 'Devon Schuppe', 'Veronica Mueller',
             'Alia Hoeger', 'Andreane Block', 'Adrianna Torp', 'Ari Haley', 'Grady Stanton', 'Floyd Kuvalis',
             'Leslie Streich', 'Breana Little', 'Geovany Kunde', 'Paolo Donnelly', 'Harley Fay', 'Kellie Block']

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


def create_tracks(genre, track_data):
    # Create tracks from genre.json files

    items = track_data['tracks']['items']
    tracks_in_genre = []

    for track in items:
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

        db_track = crud.create_track(uid,
                                     title,
                                     artist,
                                     album,
                                     release_date,
                                     playtime,
                                     genre,
                                     preview,
                                     popularity,
                                     album_art)

        tracks_in_genre.append(db_track)

    return tracks_in_genre


def create_search(genre, user):
    # Create searches and assign to random users

    created_at = datetime.now()
    # Not sure how best to do this
    query = f'genre:"{genre}"'

    return crud.create_search(user.user_id, created_at, query)


def create_playlist(genre, search, user, tracks_in_genre):
    # Create playlists and assign to random users

    created_at = datetime.now()
    last_updated_at = datetime.now()
    playlist_title = f'{genre} Playlist'

    playlist = crud.create_playlist(user.user_id, search.search_id, created_at,
                                    last_updated_at, playlist_title)

    for track_order, track in enumerate(tracks_in_genre):
        crud.create_playlist_track(
            track.track_id, playlist.playlist_id, track_order)


def seed():

    os.system('dropdb trackspotter')
    os.system('createdb trackspotter')

    model.connect_to_db(server.app)
    model.db.create_all()

    users_in_db = create_users()

    for genre in GENRES:
        # for genre in ['Beach', 'Bop']:

        escaped_genre = genre.replace('/', '-')
        filename = f'genres/{escaped_genre}.json'
        if not os.path.exists(filename):
            continue

        with open(f'genres/{escaped_genre}.json') as f:
            track_data = json.loads(f.read())

        tracks_in_genre = create_tracks(genre, track_data)

        user = choice(users_in_db)  # Select a random user to assign search to
        search = create_search(genre, user)

        create_playlist(genre, search, user, tracks_in_genre)

        print(genre)


seed()
