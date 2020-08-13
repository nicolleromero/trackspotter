from flask import Flask, render_template, jsonify, request
import os
import json
from random import choice, randint
from datetime import datetime
from genres_python import GENRES

import crud
import model
import server


def test():

    with open('sample_response.json') as f:
        track_data = json.loads(f.read())

    tracks_in_db = []
    items = track_data['tracks']['items']

    for track in items:

        print(
            track['id'],
            track['name'],
            track['artists'][0]['name'],
            track['album']['name'],
            track['album']['release_date'],
            track['duration_ms'],
            track['preview_url'],
            track['popularity'],
            track['album']['images'][2]["url"],
            track['album']['release_date'])
        break


def names():

    users_in_db = []

    for i, name in enumerate(NAMES):
        print(
            name.lower().replace(' ', '{i}'),
            name,
            datetime.now())

    print(users_in_db)


NAMES = ['Jonathan Gulgowski', 'Velda Bergstrom', 'Tyra Stehr', 'Karolann Zulauf',
         'Augustus Bednar', 'Lenore Crooks', 'Cody Carter', 'Pedro Reilly', 'Gino Nikolaus',
         'Van Boehm', 'Abraham Gaylord', 'Abagail Haag', 'Cleora Stracke', 'Earline Hansen',
         'Clemens Emmerich', 'Karelle Green', 'Derick Cruickshank', 'Kaley Schaden', 'Vesta Taylor', 'Lisa Gordon',
         'Pauline Little', 'Barrett Hamill', 'Jamaal Hilll', 'Lexi Waelchi', 'Chauncey Rosenbaum', 'Marshall Cole',
         'Mabel Nicolas', 'Verdie Lueilwitz', 'Augustine Bosco', 'Sunny Okuneva', 'Kirstin Balistreri',
         'Wade Franecki', 'Lucinda Klein', 'Vanessa Hoeger', 'Stephanie Smith', 'Oma Muller', 'Herta Towne',
         'Retha Schowalter', 'Nikita Mraz', 'Antonina Wintheiser',
         'Willis Flatley', 'Wyman Cartwright', 'Wade Fahey', 'Stacey Nikolaus', 'Chance Vandervort', 'Demarcus Schowalter', 'Christina Ruecker',
         'Willis Predovic', 'Zoila Stokes', 'Hobart Herman', 'Pinkie Friesen', 'Wyatt Miller',
         'Zackary Russel', 'Wallace Smith', 'Juwan Hirthe', 'Madonna Adams', 'Devon Schuppe', 'Veronica Mueller',
         'Alia Hoeger', 'Andreane Block', 'Adrianna Torp', 'Ari Haley', 'Grady Stanton', 'Floyd Kuvalis',
         'Leslie Streich', 'Breana Little', 'Geovany Kunde', 'Paolo Donnelly', 'Harley Fay', 'Kellie Block']
