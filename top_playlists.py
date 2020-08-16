from model import db, User, Search, Playlist, PlaylistTrack, PlaylistLike, Track, connect_to_db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc
import json
import crud

top_playlists = [('Ambient Techno Playlist', 7), ('New Orleans Blues Playlist', 6), ('Fado Playlist', 6), ('Speed Metal Playlist', 6), ('Southern Soul Playlist', 6), ('Progressive Bluegrass Playlist', 6), ('Japanese Pop Playlist', 6), ('Memphis Soul Playlist', 6), ('Neo - Classical Playlist', 6),
                 ('Minimalism Playlist', 5), ('Bollywood Playlist', 5), ('Ska - Punk Playlist', 5), ('Cabaret Playlist', 5), ('Fantasy Playlist', 5), ('Goth Rock Playlist', 5), ('Beach Playlist', 5), ('Deep Funk Playlist', 5), ('Dub Poetry Playlist', 5), ('Big Band Playlist', 5), ('Punk Revival Playlist', 5)]

# top_playlists = crud.playlist_ordered_by_likes_json()


def Convert(tup, di):
    di = dict(tup)
    return di


def main():
    dictionary = {}
    result = (Convert(top_playlists, dictionary))

    return json.dumps(result)


main()
print(main())
