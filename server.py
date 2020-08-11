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


# API_KEY = os.environ['SPOTIFY_KEY']


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


# @app.route('/afterparty/search')
# def find_afterparties():
#     """Search for afterparties on Eventbrite"""

#     keyword = request.args.get('keyword', '')
#     postalcode = request.args.get('zipcode', '')
#     radius = request.args.get('radius', '')
#     unit = request.args.get('unit', '')
#     sort = request.args.get('sort', '')

#     parameters = [keyword, postalcode, radius, unit, sort]

#     # url = 'https://app.ticketmaster.com/discovery/v2/events?'
#     url = '	https://api.spotify.com/v1/search?'
#     payload = {'apikey': API_KEY,
#                'keyword': keyword,
#                }

#     # for parameter in parameters:
#     #     if parameter:
#     #         payload[parameter] = str(parameter)

#     # res = requests.get(url, params=payload)
#     data = res.json()
#     events = data['_embedded']['events']
#     print(payload)

#     return render_template('search-results.html',
#                            pformat=pformat,
#                            data=data,
#                            results=events)


if __name__ == "__main__":
    # connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
