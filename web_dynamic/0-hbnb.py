#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


# Teardown method for closing SQLAlchemy Session
@app.teardown_appcontext
def teardown_db(exception):
    """
    After each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


# Route for handling request to custom template with states, cities, and amenities
@app.route('/0-hbnb')
def hbnb_filters():
    """
    Handles request to custom template with states, cities & amenities
    """
    state_objs = storage.all('State').values()
    states = {state.name: state for state in state_objs}
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    return render_template('0-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amens=amens,
                           places=places,
                           users=users)


if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=host, port=port)