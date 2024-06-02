window.addEventListener('load', function () {
  // Task 3: Check API status
  $.ajax('http://0.0.0.0:5001/api/v1/status').done(function (data) {
    $('#api_status').toggleClass('available', data.status === 'OK');
  });

  // Task 2: Handle amenities checkboxes
  const amenityIds = {};
  $('.amenities input[type=checkbox]').on('click', function () {
    const id = $(this).data('id');
    const name = $(this).data('name');
    if (this.checked) {
      amenityIds[id] = name;
    } else {
      delete amenityIds[id];
    }
    const names = Object.values(amenityIds).join(', ') || '&nbsp;';
    $('div.amenities h4').html(names);
  });

  const stateIds = {};
  const cityIds = {};

  // Task 4: Handle search button click
  $('.filters button').on('click', function () {
    const searchParams = {
      amenities: Object.keys(amenityIds),
      states: Object.keys(stateIds),
      cities: Object.keys(cityIds)
    };
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify(searchParams)
    }).done(function (data) {
      const placesSection = $('section.places').empty().append('<h1>Places</h1>');
      data.forEach(place => {
        const template = `
          <article>
            <div class="title">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
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
            <div class="description">${place.description}</div>
            <div class="reviews">
              <h2>Reviews <span class="reviewSpan" data-id="${place.id}">show</span></h2>
              <ul></ul>
            </div>
          </article>`;
        placesSection.append(template);
      });

      // Task 7: Fetch and display reviews for each place
      $('.reviewSpan').on('click', function () {
        const $this = $(this);
        const reviewList = $this.closest('.reviews').find('ul');
        if ($this.text() === 'show') {
          $.ajax(`http://0.0.0.0:5001/api/v1/places/${$this.data('id')}/reviews`).done(function (data) {
            data.forEach(review => {
              reviewList.append(`<li>${review.text}</li>`);
            });
            $this.text('hide');
          });
        } else {
          reviewList.empty();
          $this.text('show');
        }
      });
    });
  });

  // Task 6: Handle state checkboxes
  $('.stateCheckBox, .cityCheckBox').on('click', function () {
    const isChecked = $(this).prop('checked');
    const id = $(this).data('id');
    const name = $(this).data('name');
    const targetObj = $(this).hasClass('stateCheckBox') ? stateIds : cityIds;

    if (isChecked) {
      targetObj[id] = name;
    } else {
      delete targetObj[id];
    }

    const names = [...Object.values(stateIds), ...Object.values(cityIds)].join(', ') || '&nbsp;';
    $('.locations h4').html(names);
  });
});
