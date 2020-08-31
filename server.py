from flask import (Flask, render_template, jsonify,
                   request, flash, session, redirect)
from model import connect_to_db
import tekore as tk

from pprint import pprint, pformat
import os
from urllib.parse import urlencode
from sys import argv
import json
import requests
import crud
from datetime import datetime


app = Flask(__name__)
app.secret_key = 'dev'

app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


SPOTIFY_KEY = os.environ['SPOTIFY_KEY']

conf = tk.config_from_environment()
client_id, client_secret, redirect_uri = conf
cred = tk.Credentials(*conf)
spotify = tk.Spotify()

users = {}


@app.route("/")
def show_homepage():
    """Show the homepage."""

    if 'user_id' in session:
        user_id = session.get('user_id')
        user_dict = crud.get_user_by_id(user_id)
    else:
        user_dict = None

    return render_template("homepage.html", user_json=json.dumps(user_dict))


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """Catchall for all misdirects"""

    if 'user_id' in session:
        user_id = session.get('user_id')
        user_dict = crud.get_user_by_id(user_id)
    else:
        user_dict = None

    return render_template("homepage.html", user_json=json.dumps(user_dict))


@app.route('/login', methods=['GET'])
def login():
    """Log in to Spotify"""

    scope = tk.scope.playlist_modify_public + \
        tk.scope.user_top_read + tk.scope.playlist_modify_private
    auth_url = cred.user_authorisation_url(scope=scope)

    return redirect(auth_url)


@app.route('/devlogin/<user_id>', methods=['GET'])
def devlogin(user_id):
    """Log in to a dev user account"""

    session['user_id'] = user_id

    return redirect("/")


@app.route('/callback', methods=['GET'])
def login_callback():
    """Callback for Spotify login"""

    code = request.args.get('code', None)
    print("code", code)
    session['code'] = code

    token = cred.request_user_token(code)

    with spotify.token_as(token):
        info = spotify.current_user()

    display_name = info.display_name
    spotify_id = info.id

    user = crud.get_user_or_add_user(spotify_id, display_name, token)
    session['user_id'] = user.user_id

    return redirect('/')


@app.route('/logout', methods=['GET'])
def logout():
    """Log out from Spotify or dev user"""

    session.clear()

    return redirect('/')


@app.route("/api/search")
def search():
    """Search for tracks with Spotify endpoint"""

    query = request.args.get('query', '').strip()
    session['query'] = query

    if not query:
        return jsonify([])

    token = cred.request_client_token()

    spot_key = token.access_token

    params = {'q': f'{query}', 'type': 'track'}

    headers = {'Authorization': f'Bearer {spot_key}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    data = res.json()
    search_tracks = data['tracks']['items']
    session['search_tracks'] = search_tracks

    # TODO: return tracks from db (add tracks to db, then retrieve w/ crud method)

    return jsonify(search_tracks)


@app.route("/api/playlists")
def display_playlists():
    """ Display a list of playlists for a user"""

    user_id = session.get('user_id')
    data = crud.get_playlist_by_user_id(user_id)

    return jsonify(data)


@app.route("/api/top-playlists")
def get_top_playlists():
    """Get the top playlists to display """

    # TODO: set offset in db query and feed next 20 playlists to client

    data = crud.playlist_ordered_by_likes()

    return jsonify(data)


@app.route("/api/playlists/<playlist_id>")
def display_playlist_tracks(playlist_id):
    """Display a list of playlist tracks for a specific playlist"""

    playlist = crud.get_playlist_by_id(playlist_id)
    playlist_dict = playlist.as_dict()
    user_id = session.get('user_id')

    playlist_dict['tracks'] = crud.tracks_in_playlist_ordered(playlist_id)
    playlist_dict['user_id'] = playlist.user_id

    playlist_like = crud.get_playlist_like_by_user(
        user_id, playlist_id)

    if playlist_like is None:
        playlist_dict['playlist_like'] = False
    else:
        playlist_dict['playlist_like'] = True

    return jsonify(playlist_dict)


@app.route("/api/save-playlist", methods=["POST"])
def save_playlist():

    # What's needed from the client:
    # be logged in for user_id
    # playlist_title
    # final query from final search
    # list of tracks

    # TODO prompt to log in to Spotify, then send request to save playlist to user's Spotify account
    user_id = session.get('user_id')
    data = request.get_json()
    query = data["query"]
    search_tracks = data["playlist_tracks"]
    playlist_title = data["playlist_title"]

    # tracks = pass in from client

    created_at = datetime.now()
    last_updated_at = datetime.now()

    # create the search and save to db
    search = crud.create_search(user_id, created_at, query)

    # create playlist and save to db
    playlist = crud.create_playlist(user_id, search.search_id, created_at,
                                    last_updated_at, playlist_title)

    # create tracks, playlist_tracks and save to db
    tracks = crud.create_tracks_and_playlist_tracks_for_playlist(
        search_tracks, playlist.playlist_id)

    # return tracks as list of dicts to render on playlist tracks screen
    return jsonify({
        'playlist_id': playlist.playlist_id,
    })


@app.route("/api/update-playlist", methods=["POST"])
def save_edited_playlist():
    """Update db for an edited playlist and save to Spotify"""

    user_id = session.get('user_id')
    user = crud.get_user(user_id) if user_id else None
    if not user:
        raise 'TODO Unautborized Exception'

    data = request.get_json()
    playlist_tracks = data["playlist_tracks"]
    playlist_title = data["playlist_title"]
    playlist_id = data["playlist_id"]

    playlist = crud.update_edited_playlist(
        playlist_id=playlist_id, playlist_tracks=playlist_tracks, playlist_title=playlist_title)

    print("user refresh token", user.refresh_token)
    token = tk.refresh_user_token(client_id, client_secret, user.refresh_token)

    # TODO Check to see if spotify_playlist_id exists in db or prompt to log in to Spotify

    uris = []
    for track in playlist_tracks:
        uris.append("spotify:track:" + track['uid'])
        print("spotify:track:" + track['uid'])

    name = data["playlist_title"]

    with spotify.token_as(token):
        playlist = spotify.playlist_create(user.spotify_id, name=name, public=False,
                                           description=None)

        response = spotify.playlist_add(playlist.id, uris=uris, position=None)
        print("Response from playlist save attempt", response)

    return jsonify({})


@app.route("/api/copy-playlist", methods=["POST"])
def copy_playlist():

    user_id = session.get('user_id')
    data = request.get_json()
    original_playlist_id = data["playlist_id"]
    playlist_tracks = data["playlist_tracks"]

    playlist = crud.copy_playlist(
        user_id, original_playlist_id, playlist_tracks)

    return jsonify({
        'playlist_id': playlist.playlist_id,
    })


@app.route("/api/update-playlist-like", methods=["POST"])
def update_playlist_like():

    data = request.get_json()
    user_id = session.get('user_id')
    playlist_id = data["playlist_id"]

    status = crud.update_playlist_like(
        user_id=user_id, playlist_id=playlist_id)

    return jsonify({"status": status})


@app.route("/api/delete-playlist", methods=["POST"])
def delete_playlist():
    """Update db to delete a playlist"""

    data = request.get_json()
    playlist_id = data["playlist_id"]

    crud.delete_playlist(
        playlist_id=playlist_id)

    return jsonify({})


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
