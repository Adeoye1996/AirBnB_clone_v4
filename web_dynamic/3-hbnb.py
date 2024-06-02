#!/usr/bin/python3
"""
Flask Application that integrates with AirBnB static HTML Template
"""
from flask import Flask, render_template
from models import storage
import uuid

# Flask configuration
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


# Start Flask page rendering
@app.teardown_appcontext
def close_storage(exception):
    """
    After each request, this method invokes .close() (i.e., .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/3-hbnb')
def hbnb_filters(the_id=None):
    """
    Processes request to custom template with states, cities & amenities
    """
    state_objs = storage.all('State').values()
    states = {state.name: state for state in state_objs}
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    return render_template('3-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amens=amens,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """
    Main Flask Application
    """
    app.run(host=host, port=port)
