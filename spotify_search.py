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


def genres_autocomplete():

    FINAL_GENRES = []

    for genre in GENRES:

        escaped_genre = genre.replace('/', '-')
        filename = f'genres/{escaped_genre}.json'
        if not os.path.exists(filename):
            continue
        FINAL_GENRES.append(genre)

    print(FINAL_GENRES)


genres_autocomplete()

FINAL_GENRES = ['Acid House', 'Acid Jazz', 'Acid Rock', 'Acid Techno', 'Acoustic Blues', 'African Jazz',
                'Afro-Beat', 'Afro-Brazilian', 'Afro - Cuban', 'Album Rock', 'Alternative CCM', 'Alternative Country',
                'Alternative Dance', 'Alternative Metal', 'Alternative Pop / Rock', 'Alternative Rap', 'Ambient',
                'Ambient Dub', 'Ambient House', 'Ambient Pop', 'Ambient Techno', 'Americana', 'AM Pop', 'Andalus Classical',
                'Anti - Folk', 'Appalachian Folk', 'Armenian', 'Armenian Folk', 'Asian Folk', 'AustroPop', 'Avant - Garde',
                'Avant - Garde Jazz', 'Bachata', 'Bakersfield Sound', 'Banda', 'Baroque', 'Baroque Pop', 'Bass Music',
                'Beach', 'Beat Poetry', 'Bhangra', 'Big Band', 'Big Beat', 'Bikutsi', 'Bluegrass', 'Bluegrass - Gospel',
                'Blues', 'Blues Gospel', 'Blues - Rock', 'Bolero', 'Bollywood', 'Boogaloo', 'Boogie - Woogie', 'Bop',
                'Bossa Nova', 'Brass Band', 'Brazilian Jazz', 'Brazilian Pop', 'Brill Building Pop', 'British Blues',
                'British Folk', 'British Invasion', 'British Metal', 'Britpop', 'Broken Beat', 'Bubblegum', 'Bulgarian Folk',
                'C - 86', 'Cabaret', 'Cadence', 'Cajun', 'Calypso', 'Canterbury Scene', 'Carnatic', 'CCM', 'Celtic',
                'Celtic Rock', 'Cha - Cha', 'Chamber Pop', 'Chant', 'Charanga', 'Chicago Blues', 'Chicago Soul',
                "Children's", "Children's Folk", 'Chinese Classical', 'Chinese Folk', 'Chinese Pop', 'Choral', 'Choro',
                'Christian Metal', 'Christian Punk', 'Christian Rap', 'Christian Rock', 'Christmas', 'Classical',
                'Classical Guitar', 'Classic Jazz', 'Comedy', 'Comedy Rap', 'Comedy Rock', 'Contemporary Country',
                'Contemporary Folk', 'Contemporary Gospel', 'Contemporary Jazz', 'Contemporary Native American',
                'Cool', 'Corrido', 'Country', 'Country Blues', 'Country Boogie', 'Country - Folk', 'Country Gospel',
                'Country - Pop', 'Country - Rock', 'Cowboy', 'Cowpunk', 'Cuatro', 'Cuban Jazz', 'Cumbia', 'Dancehall',
                'Dance - Pop', 'Dance - Rock', 'Dark Ambient', 'Deep Funk', 'Deep Soul', 'Delta Blues', 'Detroit Techno',
                'Dhrupad', 'Dirty Rap', 'Dirty South', 'Disco', 'Dixieland', 'DJ', 'Doom Metal', 'Doo Wop', 'Downtempo',
                'Drama', 'Dream Pop', "Drill'n'bass", 'Dub', 'Dub Poetry', 'Dutch Pop', 'Early Music', 'Easter',
                'Easy Listening', 'Electric Blues', 'Electro', 'Electro - Industrial', 'Electro - Jazz', 'Electronic',
                'Electronica', 'Emo', 'Enka', 'Environmental', 'Erotica', 'Ethiopian Pop', 'Exotica', 'Experimental',
                'Experimental Ambient', 'Experimental Big Band', 'Experimental Dub', 'Experimental Electro',
                'Experimental Rock', 'Experimental Techno', 'Fado', 'Fantasy', 'Finnish Folk', 'Flamenco', 'Folk',
                'Folklore', 'Folk - Pop', 'Folk Revival', 'Folk - Rock', 'Forro', 'Freakbeat', 'Free Folk', 'Free Improvisation',
                'Free Jazz', 'Freestyle', 'French Folk', 'French Pop', 'French Rock', 'Fuji', 'Funk', 'Funk Metal',
                'Funky Breaks', 'Fusion', 'Gabba', 'Gamelan', 'Gangsta Rap', 'Garage Punk', 'Garage Rock', 'Garage Rock Revival',
                'Gay', 'G - Funk', 'Girl Group', 'Glam Rock', 'Glitch', 'Glitter', 'Goa Trance', 'Go - Go', 'Gospel',
                'Goth Metal', 'Goth Rock', 'Greek Folk', 'Grindcore', 'Grunge', 'Gypsy', 'Halloween', 'Happy Hardcore',
                'Hard Bop', 'Hardcore Punk', 'Hardcore Techno', 'Hard Rock', 'Harmonica Blues', 'Harmony Vocal Group',
                'Healing', 'Heartland Rock', 'Heavy Metal', 'Highlife', 'Hi - NRG', 'Hip - Hop', 'Honky Tonk', 'House',
                'IDM', 'Illbient', 'Improvisation', 'Indian Classical', 'Indian Folk', 'Indian Pop', 'Indie Electronic',
                'Indie Pop', 'Indie Rock', 'Indigenous', 'Industrial', 'Industrial Metal', 'Instrumental Rock', 'Inuit',
                'Irish Folk', 'Italian Folk', 'Italian Pop', 'Jangle Pop',
                'Japanese Pop', 'Japanese Rock', 'Jazz', 'Jazz Blues', 'Jazz - Funk', 'Jazz - Rap', 'Jazz - Rock', 'Jug Band',
                'Juju', 'Jump Blues', 'Karaoke', 'Kayokyoku', 'Klezmer', 'Kora', 'Korean Pop', 'Korean Rock', 'L.A.Punk',
                'Latin', 'Latin Comedy', 'Latin Folk', 'Latin Jazz', 'Latin Pop', 'Latin Rap', 'Latin Rock', 'Lo - Fi',
                'Louisiana Blues', 'Lounge', 'Lovers Rock', 'Madchester', 'Makossa', 'Mambo', 'March', 'Mariachi',
                'Math Rock', 'Mbalax', 'Mbira', 'Medieval', 'Meditation', 'Memphis Blues', 'Memphis Soul', 'Mento',
                'Merengue', 'Merseybeat', 'Microhouse', 'Microtonal', 'Military', 'Minimalism', 'Minimal Techno', 'Mod',
                'Modern Big Band', 'Modern Free', 'Mod Revival', 'Moravian Folk', 'Morna', 'Motown', 'MPB', 'Musette',
                'Music Hall', 'Neo - Classical', 'Neo - Classical Metal', 'Neo - Prog', 'Neo - Soul', 'Neo - Traditional',
                'New Age', 'New Jack Swing', 'New Orleans Blues', 'New Orleans Jazz', 'New Romantic', 'New Wave', 'Noh',
                'Noise', 'Noise Pop', 'Noise - Rock', 'Norteño', 'Northern Soul', 'Norwegian Folk', 'Novelty', 'No Wave',
                'Nu Breaks', 'Nueva Cancion', 'Nueva Trova', 'Nyahbinghi', 'Oi!', 'Okinawan Pop', 'Opera', 'Orchestral',
                'Outlaw Country', 'Paisley Underground', 'Philly Soul', 'Piano Blues', 'Piedmont Blues', 'Plena',
                'Poetry', 'Polka', 'Pop', 'Pop Idol', 'Pop - Rap', 'Pop / Rock', 'Pop Underground', 'Portuguese Music',
                'Post - Bop', 'Post - Disco', 'Post - Grunge', 'Post - Hardcore', 'Post - Minimalism', 'Post - Punk',
                'Post - Romantic', 'Power Metal', 'Power Pop', 'Progressive Alternative', 'Progressive Bluegrass',
                'Progressive House', 'Progressive Jazz', 'Progressive Metal', 'Progressive Trance', 'Psychedelic',
                'Psychedelic Pop', 'Psychobilly', 'Pub Rock', 'Punk', 'Punk Blues', 'Punk - Pop', 'Punk Revival',
                'Qawwali', 'Queercore', 'Quiet Storm', 'Ragga', 'Ragtime', 'Rai', 'Rakugo', 'Ranchera', 'Rap',
                'Rap - Metal', 'Rap - Rock', 'Rave', 'R & B', 'Reggae', 'Reggae Gospel', 'Reggae - Pop',
                'Reggaeton', 'Renaissance', 'Retro - Soul', 'Riot Grrrl', 'Rock', 'Rockabilly', 'Rock en Español',
                'Rock & Roll', 'Romantic', 'Roots Reggae', 'Roots Rock', 'Russian Folk', 'Salsa', 'Samba',
                'Scottish Folk', 'Screamo', 'S√©ga', 'Shaabi', 'Shibuya - Kei', 'Shoegaze', 'Show Tunes',
                'Singer / Songwriter', 'Ska', 'Ska - Punk', 'Ska Revival', 'Skiffle', 'Slack - Key Guitar',
                'Slowcore', 'Sludge Metal', 'Smooth Jazz', 'Smooth Soul', 'Soca', 'Soft Rock', 'Son', 'Soukous',
                'Soul', 'Soul - Blues', 'Soul - Jazz', 'Sound Art', 'Sound Collage', 'Sound Effects', 'Soundtrack',
                'South African Pop', 'Southern Gospel', 'Southern Rock', 'Southern Soul', 'Space', 'Space Age Pop',
                'Space Rock', 'Spanish Folk', 'Speed Metal', 'Spiritual', 'Spirituals', 'Spoken Word', 'Standards',
                'Stoner Metal', 'Straight - Edge', 'Stride', 'Sunshine Pop', 'Surf', 'Swamp Blues', 'Swamp Pop',
                'Swedish Folk', 'Swing', 'Symphonic Black Metal', 'Taiwanese Pop', 'Tango', 'Tech - House',
                'Techno', 'Techno - Dub', 'Teen Pop', 'Tejano', 'Texas Blues', 'Tex - Mex', 'Thai Pop', 'Thrash',
                'Throat Singing', 'Timba', 'Traditional', 'Traditional Bluegrass', 'Traditional Chinese',
                'Traditional Country', 'Traditional Folk', 'Traditional Japanese', 'Traditional Korean',
                'Traditional Scottish Folk', 'Trad Jazz', 'Trance', 'Tribal - House', 'Trip - Hop', 'Tropical',
                'Trot', 'Trova', 'Truck Driving Country', 'Turkish Folk', 'Turntablism', 'Twee Pop',
                'Underground Rap', 'Urban', 'Vallenato', 'Vaudeville', 'Video', 'Video Game Music', 'Vocal',
                'Vocal Jazz', 'West Coast Rap', 'Western Swing', "Women's", 'World', 'World Fusion',
                'Yodeling', 'Zouk', 'Zydeco']
