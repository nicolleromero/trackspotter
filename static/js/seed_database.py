"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb trackspotter')
os.system('createdb trackspotter')

model.connect_to_db(server.app)
model.db.create_all()


with open('data/tracks.json') as f:
    track_data = json.loads(f.read())

tracks_in_db = []
items = TEST_DATA2['tracks']['items']

for track in track_data:
    title, artist, album, playtime, preview, genre, popularity = (
        track['name'],
        track['artist'],
        track['album'],
        track['duration_ms'],
        track['preview'],
        track['genre'],
        track['popularity']),
    release_date = datetime.strptime(track['release_date'], '%Y-%m-%d')

    db_track = crud.create_track(title,
                                 artist,
                                 album,
                                 playtime,
                                 preview,
                                 genre,
                                 popularity,
                                 release_date)

    tracks_in_db.append(db_track)

# Stopped here on Tuesday, need to make crud file to create entries

for n in range(10):
    email = f'user{n}@test.com'
    password = 'test'

    user = crud.create_user(email, password)

    for _ in range(10):
        random_movie = choice(movies_in_db)
        score = randint(1, 5)

        crud.create_rating(user, random_movie, score)
