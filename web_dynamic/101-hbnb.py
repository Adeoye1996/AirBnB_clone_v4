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


# Begin flask page rendering
@app.teardown_appcontext
def teardown_db(exception):
    """
    After each request, this method invokes .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/101-hbnb')
def hbnb_filters(the_id=None):
    """
    Processes request to custom template with states, cities & amenities
    """
    state_objs = storage.all('State').values()
    states = {state.name: state for state in state_objs}
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    return render_template('101-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=state_objs,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    MAIN Flask App
    """
    app.run(host=host, port=port)
