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

    site_user = crud.get_user_by_id(user_id)
    print(site_user)

    session['user_id'] = user_id

    return jsonify(site_user)


@app.route("/api/save-playlist", methods=["POST"])
def save_playlist():

    # What's needed from the client:
    # be logged in for user_id
    # playlist_title
    # final query from final search
    # list of tracks

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
    """Update db for an edited playlist"""

    data = request.get_json()
    playlist_tracks = data["playlist_tracks"]
    playlist_title = data["playlist_title"]
    playlist_id = data["playlist_id"]

    playlist = crud.update_edited_playlist(
        playlist_id=playlist_id, playlist_tracks=playlist_tracks, playlist_title=playlist_title)

    return jsonify({})


@app.route("/api/delete-playlist", methods=["POST"])
def delete_playlist():
    """Update db to delete a playlist"""

    data = request.get_json()
    playlist_id = data["playlist_id"]

    crud.delete_playlist(
        playlist_id=playlist_id)

    return jsonify({})


@app.route("/api/search")
def search():
    """Search for tracks with Spotify endpoint"""

    query = request.args.get('query', '').strip()
    session['query'] = query
    user_id = session.get('user_id')
    user = crud.get_user_by_id(user_id)
    created_at = datetime.now()

    # search = crud.create_search(user, created_at, query)

    if not query:
        return jsonify([])

    # user = session.get('user', None)

    # if user is not None:
    #     token = users[user]

    # if session.get('user') is not None:
    #     token = cred.refresh(token)
    #     spot_id = session['user']
    #     spot_key = users[spot_id]

    #     if token.is_expiring:
    #         token = cred.refresh(token)
    #         users[user] = token

    # else:
    #     spot_key = SPOTIFY_KEY

    spot_key = SPOTIFY_KEY
    # TODO: try cred.request_client_token()

    params = {'q': f'{query}', 'type': 'track'}

    headers = {'Authorization': f'Bearer {spot_key}'}

    res = requests.get('https://api.spotify.com/v1/search?',
                       headers=headers,
                       params=params)

    data = res.json()
    search_tracks = data['tracks']['items']
    session['search_tracks'] = search_tracks

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

    data = crud.playlist_ordered_by_likes()

    return jsonify(data)


@app.route("/api/playlists/<playlist_id>")
def display_playlist_tracks(playlist_id):
    """Display a list of playlist tracks for a specific playlist"""

    playlist = crud.get_playlist_by_id(playlist_id)
    playlist_dict = playlist.as_dict()

    playlist_dict['tracks'] = crud.tracks_in_playlist_ordered(playlist_id)

    return jsonify(playlist_dict)


@app.route('/api/spotify-login', methods=['GET'])
def login():
    scope = tk.scope.user_read_email
    auth_url = cred.user_authorisation_url(scope=scope)

    return redirect(auth_url)


@app.route('/callback', methods=['GET'])
def login_callback():

    code = request.args.get('code', None)

    token = cred.request_user_token(code)
    with spotify.token_as(token):
        info = spotify.current_user()

    print("************user info.display_name", info.display_name)
    print("************user info.id", info.id)
    print("************user info.images", info.images)
    print("************user token", token)

    display_name = info.display_name
    spotify_id = info.id

    # user = crud.get_user_or_add_user(spotify_id, display_name)
    # session['user'] = user

    # TODO check if user exists, save user_id to session, commit all user info to db

    # access_token = crud method to get access token from user...

    # if access_token is None:
    #     app_token = tk.request_client_token(client_id, client_secret)
    #     spotify = tk.Spotify(app_token)

    # else:
    #     token = users[user]

    #     if token.is_expiring:
    #         token = cred.refresh(token)
    #         users[user] = token

    return redirect('/')


@app.route('/logout', methods=['GET'])
def logout():

    session.clear()

    return redirect('/')


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
