from flask import (Flask, render_template, jsonify,
                   request, flash, session, redirect)
from model import connect_to_db

from pprint import pformat
import os
from sys import argv
import json
import requests
import crud


app = Flask(__name__)
app.secret_key = 'dev'

# This configuration option makes the Flask interactive debugger
# more useful (you should remove this line in production though)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


SPOTIFY_KEY = os.environ['SPOTIFY_KEY']


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


@app.route('/api/handle-login')
def handle_login():
    """Log user into application."""

    user_id = int(request.args.get('query', '').strip())
    print("Something important:", user_id)

    # user_id = int(request.args.get('user_id', '').strip())
    data = crud.get_user_by_id(user_id)
    print(data)

    # session['current_user'] = user.user_id

    return jsonify(data)


@app.route("/api/top-playlists")
def get_top_playlists():
    """Get the top playlists to display """

    top_playlists = crud.playlist_ordered_by_likes()

    return jsonify(top_playlists)


@app.route("/api/save-playlist", methods=["POST"])
def save_playlist():

    # im expecting this kind of object as JSON in the request
    # {"post_title": "post 1", "post_body": "stuf stuf stuf"}

    data = request.get_json()
    user_id = data['search']['user_id']
    created_at = data['search']['created_at']
    query = data['search']['query']

    # create the search object first
    search = crud.create_search(user_id, created_at, query)

    search_id = search['search_id']
    last_updated_at = created_at
    playlist_title = data['playlist']['playlist_title']

    # Should I save the tracks from the playlist before the playlist itself

    items = data.track_data['tracks']['items']  # this is a list

    # create the playlist object
    crud.create_playlist(user_id, search_id, created_at,
                         last_updated_at, playlist_title)

    for track_order, track in enumerate(tracks_in_genre):
        crud.create_playlist_track(
            track.track_id, playlist.playlist_id, track_order)

    # need to save the playlist-track associations too


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


@app.route("/api/playlists")
def display_playlists():
    """ Display a list of playlists for a user"""

    user = session['user']

    user_playlists = crud.get_playlist_by_user_id(user.user_id)

    return jsonify(user_playlists)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
