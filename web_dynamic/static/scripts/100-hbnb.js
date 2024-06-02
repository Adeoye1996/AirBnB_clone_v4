window.addEventListener('load', function () {
  // Task 3: Check API status
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // Task 2: Handle amenities checkboxes
  const selectedAmenities = {};
  $('.amenities input[type=checkbox]').on('change', function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    if (this.checked) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }
    const amenityList = Object.values(selectedAmenities).join(', ') || '&nbsp;';
    $('div.amenities h4').html(amenityList);
  });

  const selectedStates = {};
  const selectedCities = {};

  // Task 4: Handle search button click
  $('.filters button').on('click', function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(selectedAmenities),
        states: Object.keys(selectedStates),
        cities: Object.keys(selectedCities)
      })
    }).done(function (data) {
      const placesSection = $('section.places');
      placesSection.empty().append('<h1>Places</h1>');
      data.forEach(place => {
        const placeHTML = `
          <article>
            <div class="title">
              <h2>${place.name}</h2>
              <div class="price_by_night">
                $${place.price_by_night}
              </div>
            </div>
            <div class="information">
              <div class="max_guest">
                <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                <br />
                ${place.max_guest} Guests
              </div>
              <div class="number_rooms">
                <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                <br />
                ${place.number_rooms} Bedrooms
              </div>
              <div class="number_bathrooms">
                <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                <br />
                ${place.number_bathrooms} Bathroom
              </div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`;
        placesSection.append(placeHTML);
      });
    });
  });

  // Task 6: Handle state checkboxes
  $('.stateCheckBox').on('change', function () {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');
    if (this.checked) {
      selectedStates[stateId] = stateName;
    } else {
      delete selectedStates[stateId];
    }
    updateLocations();
  });

  // Handle city checkboxes
  $('.cityCheckBox').on('change', function () {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');
    if (this.checked) {
      selectedCities[cityId] = cityName;
    } else {
      delete selectedCities[cityId];
    }
    updateLocations();
  });

  // Function to update locations display
  function updateLocations() {
    const locationList = Object.values(selectedStates).concat(Object.values(selectedCities)).join(', ') || '&nbsp;';
    $('.locations h4').html(locationList);
  }
});

