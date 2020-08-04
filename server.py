from flask import Flask, render_template, jsonify, request
# from model import db, connect_to_db, Card

app = Flask(__name__)


@app.route("/")
def show_homepage():
    """Show the application's homepage."""

    return render_template("homepage.html")


if __name__ == "__main__":
    # connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
