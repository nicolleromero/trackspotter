from flask import (Flask, render_template, jsonify,
                   request, flash, session, redirect)
from model import connect_to_db
import tekore as tk

from pprint import pformat
import os
from sys import argv
import json
import requests
import crud


app = Flask(__name__)
app.secret_key = 'dev'

app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


SPOTIFY_KEY = os.environ['SPOTIFY_KEY']
client_id = os.environ['client_id']
client_secret = os.environ['client_secret']
redirect_uri = os.environ['redirect_uri']

conf = tk.config_from_environment()
cred = tk.Credentials(*conf)
spotify = tk.Spotify()

users = {}


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):

#     return render_template('homepage.html')


@app.route('/api/handle-login')
def handle_login():
    """Log user into application."""

    user_id = int(request.args.get('query', '').strip())
    print("logged in user:", user_id)

    user = crud.get_user_by_id(user_id)
    print(user)

    session['user_id'] = user_id

    return jsonify(user)


@app.route("/api/save-playlist", methods=["POST"])
def save_playlist():

    data = request.get_json()
    user_id = data['search']['user_id']
    created_at = data['search']['created_at']
    query = data['search']['query']

    # create the search object first
    search = crud.create_search(user_id, created_at, query)

    search_id = search['search_id']
    last_updated_at = created_at
    playlist_title = data['playlist']['playlist_title']

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

    user = session.get('user', None)

    if user is not None:
        token = users[user]

    if session.get('user') is not None:
        token = cred.refresh(token)
        spot_id = session['user']
        spot_key = users[spot_id]

        if token.is_expiring:
            token = cred.refresh(token)
            users[user] = token

    else:
        spot_key = SPOTIFY_KEY

    params = {'q': f'{query}', 'type': 'track'}

    headers = {'Authorization': f'Bearer {spot_key}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    data = res.json()
    tracks = data['tracks']['items']

    # tracks_in_search = []

    # for track in tracks:

    #     check = crud.get_track_by_track_id(track.track_id)

    #     if check is not None:
    #         continue

    #         uid, title, artist, album, release_date, playtime, preview, popularity, album_art = (
    #             track['id'],
    #             track['name'],
    #             track['artists'][0]['name'],
    #             track['album']['name'],
    #             track['album']['release_date'],
    #             track['duration_ms'],
    #             track['preview_url'],
    #             track['popularity'],
    #             track['album']['images'][2]["url"])

    #         db_track = crud.create_track(uid,
    #                                      title,
    #                                      artist,
    #                                      album,
    #                                      release_date,
    #                                      playtime,
    #                                      preview,
    #                                      popularity,
    #                                      album_art)

    #         tracks_in_search.append(db_track)

    #     else:
    #         continue

    #     tracks_to_return = []

    #     for track in tracks_in_search:
    #         data = crud.get_track_by_track_id(track.track_id)

    #         tracks_to_return.append(data)

    return jsonify(tracks)


@app.route("/api/playlists")
def display_playlists():
    """ Display a list of playlists for a user"""

    user_id = session.get('user_id')
    data = crud.get_playlist_by_user_id(user_id)

    return jsonify(data)


@app.route("/api/top-playlists")
def get_top_playlists():
    """Get the top playlists to display """

    data = crud.playlist_ordered_by_likes()

    return jsonify(data)


@app.route("/api/playlists/<playlist_id>")
def display_playlist_tracks(playlist_id):
    """ Display a list of playlist tracks for a specific playlist"""

    tracks = crud.tracks_in_playlist_ordered(playlist_id)

    return jsonify(tracks)


@app.route('/spotify-login', methods=['GET'])
def login():
    auth_url = cred.user_authorisation_url(
        scope="playlist-modify-public playlist-modify-private")
    return redirect(auth_url, 307)


@app.route('/callback', methods=['GET'])
def login_callback():
    code = request.args.get('code', None)

    token = cred.request_user_token(code)
    with spotify.token_as(token):
        info = spotify.current_user()

    session['user'] = info.id
    users[info.id] = token

    if token.is_expiring:
        token = cred.refresh(token)
        users[user] = token

    return jsonify(info)


@app.route('/logout', methods=['GET'])
def logout():
    uid = session.pop('user', None)
    if uid is not None:
        users.pop(uid, None)
    return redirect('/', 307)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
