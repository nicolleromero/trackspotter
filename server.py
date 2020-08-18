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

# from OAuth code
# def app_factory() -> Flask:
#     app = Flask(__name__)
#     app.config['SECRET_KEY'] = 'aliens'

# This configuration option makes the Flask interactive debugger
# more useful (you should remove this line in production though)
app.config['PRESERVE_CONTEXT_ON_EXCEPTION'] = True


SPOTIFY_KEY = os.environ['SPOTIFY_KEY']
client_id = os.environ['client_id']
client_secret = os.environ['client_secret']
redirect_uri = os.environ['redirect_uri']

client_id, client_secret, redirect_uri = tk.config_from_environment()
conf = tk.config_from_environment()
cred = tk.Credentials(*conf)
spotify = tk.Spotify()
tk.config_from_environment(return_refresh=True)


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


@app.route('/api/handle-login')
def handle_login():
    """Log user into application."""

    user_id = int(request.args.get('query', '').strip())
    print("Something important:", user_id)

    user = crud.get_user_by_id(user_id)
    print(user)

    session['user_id'] = user_id

    return jsonify(user)


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):

#     return render_template('homepage.html')


@app.route("/api/top-playlists")
def get_top_playlists():
    """Get the top playlists to display """

    data = crud.playlist_ordered_by_likes_json()

    return data


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


# @app.route("/api/spotify-login")
# def spotify_login():

#     url = request.args.get('query', '').strip()

#     response = requests.get(url)
#     data = res.json()
#     print(data)

#     session['user'] = data

#     # iterate over all headers
#     for key, value in data:
#         print(key, value)

#     return jsonify(data)


@app.route("/api/playlists")
def display_playlists():
    """ Display a list of playlists for a user"""

    user_id = session.get('user_id')
    data = crud.get_playlist_by_user_id(user_id)

    return data


# __________________OAuth__Routes___________________________________ #
users = {}


# @app.route('/spotify-login', methods=['GET'])
# def spotify_login():

#     user = session.get('user', None)
#     in_link = '<a href="/login">login</a>'
#     out_link = '<a href="/logout">logout</a>'
#     page = f'User ID: {user}<br>You can {in_link} or {out_link}'

#     if user is not None:
#         token = users[user]

#         if token.is_expiring:
#             token = cred.refresh(token)
#             users[user] = token

#         try:
#             with spotify.token_as(users[user]):
#                 song = spotify.playback_currently_playing()

#             page += f'<br>Now playing: {song.item.name}'
#         except Exception:
#             page += '<br>Error in retrieving now playing!'

#     return page


@app.route('/spotify-login', methods=['GET'])
def login():
    auth_url = cred.user_authorisation_url(
        scope="user-read-private playlist-modify-public playlist-modify-private streaming")
    return redirect(auth_url, 307)


@app.route('/callback', methods=['GET'])
def login_callback():
    code = request.args.get('code', None)

    token = cred.request_user_token(code)
    with spotify.token_as(token):
        info = spotify.current_user()

    session['user'] = info.id
    users[info.id] = token
    print(session['user'])
    print(token)

    return jsonify(info)


# @app.route('/logout', methods=['GET'])
# def logout():
#     uid = session.pop('user', None)
#     if uid is not None:
#         users.pop(uid, None)
#     return redirect('/', 307)

# return app


if __name__ == "__main__":
    connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
