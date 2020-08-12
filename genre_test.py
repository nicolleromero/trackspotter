from flask import Flask, render_template

from pprint import pprint, pformat
# from genres_python import GENRES
import json
import os
import requests
import time

app = Flask(__name__)
app.secret_key = 'SECRETSECRETSECRET'

app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


API_KEY = 'BQCMiGj-wncrZP-GLDY--NNAWFZONJxIFTPSyeaQUkl6nJu8ef3Aizdkfkf7bygcYO3dvSl3iUc4RUAvBOzKt2SNuqKfGlAou19tyJDzG2KyYUzcB5SxxRVsiUhwusrsBNIbKhSWxQVf7dkp'

GENRES = ['Acid Jazz']

for genre in GENRES:
    filename = f'genres/{genre}.json'

    if os.path.exists(filename):
        continue

    params = {'q': f'genre:"{genre}"', 'type': 'track', }

    headers = {'Authorization': f'Bearer {API_KEY}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    genre_tracks = res.json()

    print(res)

    with open(filename, 'w') as json_file:
        json.dump(genre_tracks, json_file, indent=2, sort_keys=True)

    time.sleep(30)
