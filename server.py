from flask import Flask, render_template, jsonify, request
# from model import db, connect_to_db, Card

from pprint import pformat
import os
from sys import argv
import json
import requests


app = Flask(__name__)
app.secret_key = 'SECRETSECRETSECRET'

# This configuration option makes the Flask interactive debugger
# more useful (you should remove this line in production though)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


SPOTIFY_KEY = os.environ['SPOTIFY_KEY']


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


@app.route("/api/search")
def search():
    """Search for tracks with Spotify endpoint"""

    query = request.args.get('query', '').strip()

    if not query:
        return jsonify([])

    params = {'q': f'{query}', 'type': 'track'}

    headers = {'Authorization': f'Bearer {SPOTIFY_KEY}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    data = res.json()
    items = data['tracks']['items']

    return jsonify(items)


if __name__ == "__main__":
    # connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
