from flask import Flask, render_template

from pprint import pprint, pformat
from genres_python import GENRES
import json
import os
import requests
import time

app = Flask(__name__)
app.secret_key = 'SECRETSECRETSECRET'

app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


API_KEY = 'BQAbUjrHZclp288Ec8ysIzjLQHtaQtKVGsUAqDUi3DsKgoUnSI-abXmD05xMnAcPHrVKCgYpUZn503nPj8xM9Qg3DP8XZwHouzpQ38lOoCZ6yum25ZKVI0xWP3H49izsakrfJ98Mt9qSPmkx'

for genre in GENRES:
    escaped_genre = genre.replace('/', '-')
    filename = f'genres/{escaped_genre}.json'

    if os.path.exists(filename):
        continue

    params = {'q': f'genre:"{genre}"', 'type': 'track', }

    headers = {'Authorization': f'Bearer {API_KEY}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    if res.status_code != 200:
        print(f'Failed genre: {genre} ({res.status_code})')
        break

    genre_tracks = res.json()

    if len(genre_tracks['tracks']['items']) == 0:
        print(f'Empty genre: {genre}')
        continue

    with open(filename, 'w') as json_file:
        json.dump(genre_tracks, json_file, indent=2, sort_keys=True)

    time.sleep(30)
