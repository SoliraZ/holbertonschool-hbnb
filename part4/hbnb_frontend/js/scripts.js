/* 
  LOGIN
*/

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const credentials = new FormData(loginForm);
            const userDetails = {
                email: credentials.get('email'),
                password: credentials.get('password')
            };
            console.log('User credentials:', userDetails);

            try {
                const apiUrl = '/api/v1/auth/login';
                console.log('Sending login request to:', apiUrl);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetails),
                    mode: 'cors',
                    credentials: 'omit'
                });

                console.log('Login response status:', response.status);
                if (response.ok) {
                    const result = await response.json();
                    console.log('Login successful:', result);
                    document.cookie = `token=${result.access_token}; path=/`;
                    window.location.replace('../index.html');
                } else if (response.status === 401) {
                    alert('Invalid credentials. Please try again.');
                } else {
                    alert('Login failed: ' + response.statusText);
                }
            } catch (err) {
                console.error('Error during login:', err);
                console.error('Error details:', err.message);
                alert('Login error: ' + err.message + '. Please check if the backend server is running.');
            }
        });
    }

    checkAuthentication();

    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', () => {
            const token = getCookie('token');
            fetchPlaces(token);
        });
    }

    const placeId = getPlaceIdFromURL();
    if (placeId) {
        const token = checkAuthentication();
        fetchPlaceDetails(token, placeId);
    }
});

/* Places */

async function displayPlaces(token) {
    try {
        const locations = await retrieveLocations(token);
        if (locations && Array.isArray(locations)) {
            await renderLocations(token);
        } else {
            console.error('No locations data available');
            // Display a message to the user
            const locationsWrapper = document.getElementById('location-container');
            if (locationsWrapper) {
                locationsWrapper.innerHTML = "<p>No places available at the moment.</p>";
            }
        }
    } catch (error) {
        console.error('Error displaying places:', error);
        // Display a message to the user
        const locationsWrapper = document.getElementById('location-container');
        if (locationsWrapper) {
            locationsWrapper.innerHTML = "<p>Error loading places. Please try again later.</p>";
        }
    }
}

async function retrieveLocations(authToken) {
    try {
        // Use relative URL for proxy support
        const apiUrl = '/api/v1/places';
        console.log('Fetching places from:', apiUrl);

        // Create headers object
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add Authorization header if token is available
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const request = await fetch(apiUrl, {
            method: 'GET',
            headers: headers,
            mode: 'cors',
            credentials: 'omit' // Don't send cookies
        });

        if (!request.ok) {
            throw new Error('Impossible de récupérer les données: ' + request.statusText);
        }

        const responseData = await request.json();
        return responseData;
    } catch (err) {
        console.error('Erreur lors du chargement des lieux:', err);
        return null;
    }
}

async function renderLocations(authToken) {
    const locationsWrapper = document.getElementById('location-container');
    if (!locationsWrapper) {
        console.error('Élément contenant les lieux non trouvé.');
        return;
    }
    locationsWrapper.innerHTML = '';

    const locations = await retrieveLocations(authToken);

    // Get the selected max price from the filter
    const priceFilter = document.getElementById('price-filter');
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : null;

    // Filter locations by price if a max price is selected
    let filteredLocations = locations;
    if (maxPrice && maxPrice !== 'all' && locations && Array.isArray(locations)) {
        filteredLocations = locations.filter(location => location.price <= maxPrice);
        console.log(`Filtered ${locations.length} locations to ${filteredLocations.length} with max price $${maxPrice}`);
    }

    if (filteredLocations && Array.isArray(filteredLocations)) {
        if (filteredLocations.length === 0) {
            locationsWrapper.innerHTML = "<p>Aucun hébergement disponible dans cette fourchette de prix.</p>";
            return;
        }

        filteredLocations.forEach(location => {
            const locationCard = document.createElement('form');
            locationCard.className = 'location-card';
            locationCard.innerHTML = `
          <h2>${location.title}</h2>
          <p>$${location.price} per night</p>
          <button type='submit' class='details-button'>See More</button>
        `;
            locationsWrapper.appendChild(locationCard);
        });
    } else {
        locationsWrapper.innerHTML = "<p>Aucun hébergement disponible.</p>";
    }
}

/* CheckAuth */

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none'; // Hide logout button
        if (addReviewSection) addReviewSection.style.display = 'none';
    } else {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutButton) {
            logoutButton.style.display = 'block';
            logoutButton.addEventListener('click', (event) => {
                event.preventDefault();
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.replace('../index.html');
            });
        }
        if (addReviewSection) addReviewSection.style.display = 'block';
        fetchPlaces(token);
    }
    return token;
}

function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

async function fetchPlaces(token) {
    try {
        const apiUrl = '/api/v1/places';
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch places');
        }

        const places = await response.json();
        displayPlaces(places);
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('location-container');
    if (!placesList) {
        console.error('Element with ID "location-container" not found.');
        return;
    }

    placesList.innerHTML = ''; // Clear existing content

    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-card';
        placeElement.innerHTML = `
            <h2>${place.title || 'No Title'}</h2>
            <p>Price: $${place.price || '0'} per night</p>
            <button class="details-button" onclick="viewDetails('${place.id}')">View Details</button>
        `;
        placesList.appendChild(placeElement);
    });

    applyPriceFilter();
}

function viewDetails(placeId) {
    window.location.href = `templates/place.html?placeId=${placeId}`;
}

function applyPriceFilter() {
    const selectedPrice = parseFloat(document.getElementById('price-filter').value);
    const places = document.querySelectorAll('.place');

    places.forEach(place => {
        const price = parseFloat(place.querySelector('p:nth-child(4)').textContent.replace(/[^0-9.-]+/g, ""));
        if (isNaN(selectedPrice) || selectedPrice === 'all' || price <= selectedPrice) {
            place.style.display = 'block';
        } else {
            place.style.display = 'none';
        }
    });
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const apiUrl = `/api/v1/places/${placeId}`;
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            console.error('No token found, user is not authenticated.');
            return;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch place details');
        }

        const place = await response.json();
        console.log('Fetched place details:', place);
        displayPlaceDetails(place);
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) {
        console.error('Element with ID "place-details" not found.');
        return;
    }

    placeDetails.innerHTML = `
        <h2>${place.title || 'No Title'}</h2>
        <p>${place.description || 'No Description'}</p>
        <p>Price: $${place.price || '0'} per night</p>
        <h3>Amenities</h3>
        <ul>${(place.amenities || []).map(amenity => `<li>${amenity.name}</li>`).join('')}</ul>
        <h3>Reviews</h3>
        <ul>${(place.reviews || []).map(review => `<li>${review.text} - Rating: ${review.rating}</li>`).join('')}</ul>
    `;
}
