/* 
  LOGIN
*/

document.addEventListener('DOMContentLoaded', () => {
    // Add home button to all pages except index.html
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        addHomeButton();
    }

    const loginForm = document.getElementById('auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const credentials = new FormData(loginForm);
            const userDetails = {
                email: credentials.get('email'),
                password: credentials.get('password')
            };
            // console.log('User credentials:', userDetails);

            try {
                const apiUrl = '/api/v1/auth/login';
                // console.log('Sending login request to:', apiUrl);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetails),
                    mode: 'cors',
                    credentials: 'omit'
                });

                // console.log('Login response status:', response.status);
                if (response.ok) {
                    const result = await response.json();
                    // console.log('Login successful:', result);
                    document.cookie = `token=${result.access_token}; path=/`;
                    window.location.replace('../index.html');
                } else if (response.status === 401) {
                    alert('Invalid credentials. Please try again.');
                } else {
                    alert('Login failed: ' + response.statusText);
                }
            } catch (err) {
                // console.error('Error during login:', err);
                // console.error('Error details:', err.message);
                alert('Login error: ' + err.message + '. Please check if the backend server is running.');
            }
        });
    }

    // Check authentication on page load
    const token = checkAuthentication();

    // If we're on a page that requires authentication (like place details)
    // and the token is expired, redirect to login
    if (window.location.pathname.includes('place.html') && !token) {
        alert('Session expired. Please log in again.');
        window.location.href = '../templates/login.html';
        return;
    }

    // Set up price filter event listener
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', async () => {
            const token = checkAuthentication();
            if (token) {
                const places = await retrieveLocations(token);
                if (places) {
                    displayPlaces(places);
                }
            }
        });
    }

    const placeId = getPlaceIdFromURL();
    if (placeId) {
        // Only fetch place details if we have a valid token
        if (token) {
            fetchPlaceDetails(token, placeId);
        }
    }
});

/* Places */

async function displayPlaces(token) {
    try {
        const places = await retrieveLocations(token);
        if (places && Array.isArray(places)) {
            const placesList = document.getElementById('location-container');
            if (!placesList) {
                if (!window.location.pathname.includes('place.html')) {
                    console.error('Element with ID "location-container" not found.');
                }
                return;
            }

            placesList.innerHTML = ''; // Clear existing content

            const filteredPlaces = filterPlacesByPrice(places);

            if (filteredPlaces && Array.isArray(filteredPlaces)) {
                filteredPlaces.forEach(place => {
                    const placeElement = document.createElement('div');
                    placeElement.className = 'place-card';
                    placeElement.innerHTML = `
                        <div class="place-image-box">
                            <i class="fas fa-image"></i>
                            <p>Image not available</p>
                        </div>
                        <h2>${place.title || 'No Title'}</h2>
                        <p>Price: $${place.price || '0'} per night</p>
                        <button class="details-button" onclick="viewDetails('${place.id}')">View Details</button>
                    `;
                    placesList.appendChild(placeElement);
                });
            } else {
                placesList.innerHTML = "<p>No places available.</p>";
            }
        } else {
            console.error('No places data available');
            const locationsWrapper = document.getElementById('location-container');
            if (locationsWrapper) {
                locationsWrapper.innerHTML = "<p>No places available at the moment.</p>";
            }
        }
    } catch (error) {
        console.error('Error displaying places:', error);
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
        // console.log('Fetching places from:', apiUrl);

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
        console.error('Element containing places not found.');
        return;
    }
    locationsWrapper.innerHTML = '';

    const locations = await retrieveLocations(authToken);
    const filteredLocations = filterPlacesByPrice(locations);

    if (filteredLocations && Array.isArray(filteredLocations)) {
        if (filteredLocations.length === 0) {
            locationsWrapper.innerHTML = "<p>No places available in this price range.</p>";
            return;
        }

        filteredLocations.forEach(location => {
            const locationCard = document.createElement('div');
            locationCard.className = 'place-card';
            locationCard.innerHTML = `
                <div class="place-image-box">
                    <i class="fas fa-image"></i>
                    <p>Image not available</p>
                </div>
                <h2>${location.title}</h2>
                <p>Price: $${location.price} per night</p>
                <button class="details-button" onclick="viewDetails('${location.id}')">View Details</button>
            `;
            locationsWrapper.appendChild(locationCard);
        });
    } else {
        locationsWrapper.innerHTML = "<p>No places available.</p>";
    }
}

function filterPlacesByPrice(places) {
    if (!places || !Array.isArray(places)) {
        return places;
    }

    const priceFilter = document.getElementById('price-filter');
    const maxPrice = priceFilter ? parseFloat(priceFilter.value) : null;

    if (maxPrice && maxPrice !== 'all') {
        return places.filter(place => place.price <= maxPrice);
    }

    return places;
}

function displayPlaces(places) {
    const placesList = document.getElementById('location-container');
    if (!placesList) {
        if (!window.location.pathname.includes('place.html')) {
            console.error('Element with ID "location-container" not found.');
        }
        return;
    }

    placesList.innerHTML = ''; // Clear existing content

    const filteredPlaces = filterPlacesByPrice(places);

    filteredPlaces.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'place-card';
        placeElement.innerHTML = `
            <div class="place-image-box">
                <i class="fas fa-image"></i>
                <p>Image not available</p>
            </div>
            <h2>${place.title || 'No Title'}</h2>
            <p>Price: $${place.price || '0'} per night</p>
            <button class="details-button" onclick="viewDetails('${place.id}')">View Details</button>
        `;
        placesList.appendChild(placeElement);
    });
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
        return null;
    } else {
        // Check if token is expired
        if (!isTokenValid(token)) {
            // Clear the expired token
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            if (loginLink) loginLink.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (addReviewSection) addReviewSection.style.display = 'none';

            // If we're on a page that requires authentication, show alert and redirect
            if (window.location.pathname.includes('place.html')) {
                alert('Session expired. Please log in again.');
                window.location.href = '../templates/login.html';
            }
            return null;
        }

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
        return token;
    }
}

function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function fetchPlaces(token) {
    // Only proceed if we're on the main page
    if (!window.location.pathname.includes('place.html')) {
        try {
            const apiUrl = '/api/v1/places';
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(apiUrl, {
                method: 'GET',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch places');
                    }
                    return response.json();
                })
                .then(places => {
                    displayPlaces(places);
                })
                .catch(error => {
                    console.error('Error fetching places:', error);
                });
        } catch (error) {
            console.error('Error in fetchPlaces:', error);
        }
    }
}

function viewDetails(placeId) {
    if (!checkAndHandleTokenExpiry()) {
        return; // Stop execution if token is expired
    }
    window.location.href = `templates/place.html?placeId=${placeId}`;
}

function checkAndHandleTokenExpiry() {
    const token = getCookie('token');
    if (!token || !isTokenValid(token)) {
        // Clear the token
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        // Clear any other auth-related cookies or storage
        localStorage.clear();
        sessionStorage.clear();

        alert('Session expired. Please log in again.');
        window.location.href = '../templates/login.html';
        return false;
    }
    return true;
}

function isTokenValid(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        // console.log('Token Payload:', payload);
        // console.log('Token Expiry:', new Date(expiry));
        // console.log('Current Time:', new Date());
        return Date.now() < expiry;
    } catch (error) {
        // console.error('Error checking token validity:', error);
        return false;
    }
}

function applyPriceFilter() {
    const selectedPrice = document.getElementById('price-filter').value;
    const places = document.querySelectorAll('.place-card');

    console.log(`Filtering places with max price: ${selectedPrice}`);

    places.forEach(place => {
        // Extract price from the text content
        const priceText = place.querySelector('p').textContent;
        const priceMatch = priceText.match(/\$(\d+)/);

        if (priceMatch) {
            const price = parseInt(priceMatch[1]);
            console.log(`Place price: $${price}`);

            // Show all places if "all" is selected
            if (selectedPrice === 'all') {
                place.style.display = 'block';
            } else {
                // Compare with the selected price
                const maxPrice = parseInt(selectedPrice);
                if (price <= maxPrice) {
                    place.style.display = 'block';
                } else {
                    place.style.display = 'none';
                }
            }
        }
    });
}

function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('placeId');
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) {
            if (response.status === 401) {
                checkAndHandleTokenExpiry();
                return;
            }
            throw new Error('Failed to fetch place details');
        }

        const place = await response.json();
        displayPlaceDetails(place);

        // Fetch reviews for this place
        try {
            const reviewsResponse = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}/reviews`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include'
            });

            if (reviewsResponse.ok) {
                const reviews = await reviewsResponse.json();
                displayReviews(reviews);
            } else {
                // If reviews endpoint is not available, just show "No reviews yet"
                displayReviews([]);
            }
        } catch (reviewsError) {
            console.error('Error fetching reviews:', reviewsError);
            // If there's an error fetching reviews, just show "No reviews yet"
            displayReviews([]);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        alert('Failed to load place details. Please try again.');
    }
}

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;

    if (reviews && reviews.length > 0) {
        reviewsList.innerHTML = reviews.map(review => {
            // Get the first letter of the user's name for the circle
            const userInitial = (review.user_name || 'Anonymous').charAt(0).toUpperCase();

            return `
            <div class="review">
                <div class="review-image-circle">
                    ${userInitial}
                </div>
                <div class="review-content">
                    <div class="review-header">
                        <span class="user-name">${review.user_name || 'Anonymous'}</span>
                        <div class="rating">
                            ${Array(5).fill().map((_, i) =>
                `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
            ).join('')}
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <span class="review-date">${new Date(review.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        `}).join('');
    } else {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet</p>';
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    if (!placeDetails) {
        console.error('Element with ID place-details not found');
        return;
    }

    placeDetails.innerHTML = `
        <div id="place-details-container">
            <div class="place-details-box">
                <h2>${place.title || 'No Title'}</h2>
                <div class="content-wrapper">
                    <div class="place-info">
                        <p><strong>Host:</strong> ${place.owner_name || 'Unknown'}</p>
                        <p><strong>Description:</strong> ${place.description || 'No Description'}</p>
                        <p><strong>Price:</strong> $${place.price || '0'} per night</p>
                        <p><strong>Location:</strong> ${place.latitude || '0'}, ${place.longitude || '0'}</p>
                        <p><strong>Amenities:</strong> ${place.amenities ? place.amenities.map(a => a.name).join(', ') : 'None'}</p>
                    </div>
                    <div class="place-image-container">
                        <i class="fas fa-image"></i>
                        <p>Image not available</p>
                    </div>
                </div>
            </div>
            <div class="review-form-box">
                <h3>Write a Review</h3>
                <form id="review-form">
                    <div class="star-rating">
                        <p>Your Rating:</p>
                        <div class="stars">
                            <span class="star" data-rating="1">★</span>
                            <span class="star" data-rating="2">★</span>
                            <span class="star" data-rating="3">★</span>
                            <span class="star" data-rating="4">★</span>
                            <span class="star" data-rating="5">★</span>
                        </div>
                        <input type="hidden" id="rating-value" name="rating" value="0">
                    </div>
                    <div class="review-text">
                        <p>Your Review (max 200 characters):</p>
                        <textarea id="review-text" name="text" maxlength="200" placeholder="Write your review here..."></textarea>
                        <div class="char-count"><span id="char-count">0</span>/200</div>
                    </div>
                    <button type="submit" id="submit-review" class="submit-button disabled">Post Review</button>
                </form>
            </div>
        </div>
        
        <div class="reviews-list-box">
            <h3>Reviews</h3>
            <div id="reviews-list">
                <p class="no-reviews">Loading reviews...</p>
            </div>
        </div>
    `;

    // Set up event listeners for the review form
    setupReviewForm(place.id);
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

// Function to set up the review form event listeners
function setupReviewForm(placeId) {
    const form = document.getElementById('review-form');
    if (!form) return;

    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating-value');
    const reviewText = document.getElementById('review-text');
    const charCount = document.getElementById('char-count');
    const submitButton = document.getElementById('submit-review');

    // Get token and verify
    const token = getCookie('token');
    if (!token || !isTokenValid(token)) {
        // Hide review form and show login message
        const reviewFormBox = document.querySelector('.review-form-box');
        if (reviewFormBox) {
            reviewFormBox.innerHTML = '<p>Please <a href="../templates/login.html">login</a> to write a review.</p>';
        }
        return;
    }

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratingInput.value = rating;
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('selected');
                } else {
                    s.classList.remove('selected');
                }
            });
            updateSubmitButton();
        });
    });

    // Character count
    reviewText.addEventListener('input', () => {
        const length = reviewText.value.length;
        charCount.textContent = length;
        updateSubmitButton();
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verify token again before submitting
        if (!checkAndHandleTokenExpiry()) {
            return;
        }

        const rating = parseInt(ratingInput.value);
        const text = reviewText.value.trim();

        if (rating === 0 || text.length === 0) {
            alert('Please provide both a rating and a review text.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/v1/reviews/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating: rating,
                    text: text,
                    place_id: placeId
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    checkAndHandleTokenExpiry();
                    return;
                }
                // Get the error message from the response
                const errorData = await response.json();
                console.error('Server error response:', errorData);
                throw new Error(errorData.message || 'Failed to post review');
            }

            // Clear the form
            ratingInput.value = 0;
            reviewText.value = '';
            charCount.textContent = '0';
            stars.forEach(s => s.classList.remove('selected'));
            updateSubmitButton();

            // Show success message
            alert('Review posted successfully!');

            // Refresh the place details to show the new review
            const currentToken = getCookie('token');
            if (currentToken && isTokenValid(currentToken)) {
                fetchPlaceDetails(currentToken, placeId);
            }

        } catch (error) {
            console.error('Error posting review:', error);
            alert('Failed to post review: ' + error.message);
        }
    });

    function updateSubmitButton() {
        const rating = parseInt(ratingInput.value);
        const text = reviewText.value.trim();

        if (rating > 0 && text.length > 0) {
            submitButton.classList.remove('disabled');
        } else {
            submitButton.classList.add('disabled');
        }
    }
}

function checkTokenAndHideLogin() {
    const token = getCookie('token');
    const loginButton = document.getElementById('login-button');
    if (token && isTokenValid(token)) {
        if (loginButton) loginButton.style.display = 'none';
    }
}

// Call this function on page load
checkTokenAndHideLogin();

function addHomeButton() {
    const homeButton = document.createElement('a');
    homeButton.href = '../index.html';
    homeButton.className = 'home-button';
    homeButton.innerHTML = '<i class="fas fa-home"></i>Home';

    const brandDiv = document.querySelector('.brand');
    if (brandDiv) {
        brandDiv.appendChild(homeButton);
    }
}
