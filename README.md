# <img src="https://github.com/nicolleromero/trackspotter/blob/master/static/img/logo.png" width="60%" alt="Trackspotter">
Trackspotter is a single-page web app built in React that provides a streamlined GUI allowing users to perform powerful, targeted searches of Spotify's 50 million track music library. The app supports a set of advanced search syntax, building and editing playlists from the search results, and saving playlists to a user's Spotify account.

## Deployment
https://trackspotter.app/

## Contents
* [Tech Stack](#tech-stack)
* [App Features](#app-features)
* [Future Releases](#future)
* [License](#license)

## <a name="tech-stack"></a>Technologies
* React
* React-Router
* Python
* Flask
* Nginx
* PostgresQL
* SQLAlchemy ORM
* HTML
* CSS
* React-Bootstrap
* Spotify API

## <a name="app-features"></a>App Features

![alt text](https://github.com/nicolleromero/trackspotter/blob/master/static/img/search6.gif "trackspotter search")

* Users search by artist, album, keyword, release date (or year span), and genre where an autocomplete component provides targeted suggestions for Spotify’s 500 genres.
* Submitted parameters and operators are aggregated and wildcards are applied to represent the query.
* The parameters are persisted in the UI in the form of query badges and users can refine their search through directly manipulating the badges.
* Paginated search results allow users to pull in additional tracks as they modify their query.
* Spotify widgets (iframes) support playback of tracks. Logged in users can play full songs, and non-logged in users can play a 30-second long preview.
* A user can continue to refine their search query, tracks can be reordered through the drag-and-drop UI built with [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd) or removed from the set, and the final track list can be saved as a playlist to their Spotify account.

![alt text](https://github.com/nicolleromero/trackspotter/blob/master/static/img/save2.gif "trackspotter save")

* Playlists include query badges that capture the search parameters used to build the playlist.
* Users can continue to customize their playlists after assembling tracks from their search and updates are saved to their Spotify accounts.
* Users can also explore popular community playlists, up vote playlists, and clone and modify a popular playlist.
* Trackspotter’s backend is written in Python, with the Flask web framework, and accesses a PostgresQL database through SQLAlchemy.
* [Tekore](https://pypi.org/project/tekore/), a Spotify Web API client for Python 3, is leveraged to hit Spotify’s Web API endpoints from the backend to streamline the Spotify OAuth flow.


## <a name="future"></a>Future Releases
* Search community playlists by filtering on query parameters used to assemble the playlist.
* Support additional operators in the searh GUI (e.g., NOT and OR).
* Add support for sharing playlists directly from the app.
* Add support for collaborative playlists.

## <a name="license"></a>License
* MIT © Nicolle Romero 2020
* Homepage Photo by Alphacolor on Unsplash
