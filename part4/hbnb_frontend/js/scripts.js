/* 
  LOGIN
*/

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.auth-button');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.assign('templates/login.html');
        });
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
            console.log('User credentials:', userDetails);

            try {
                // Use relative URL for proxy support
                const apiUrl = '/api/v1/auth/login';
                console.log('Sending login request to:', apiUrl);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDetails),
                    mode: 'cors',
                    credentials: 'omit' // Don't send cookies
                });

                if (response.ok) {
                    const result = await response.json();
                    // Store the JWT token in a cookie
                    document.cookie = `token=${result.access_token}; path=/`;
                    // Redirect to the main page
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

    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.assign('templates/login.html');
        });
    }

    // Add event listener for price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', () => {
            const token = getCookie('token');
            displayPlaces(token);
        });
    }

    verifyUserSession();
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

        // Add mode: 'cors' to explicitly request CORS
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

function verifyUserSession() {
    const token = getCookie('token');
    const loginBtn = document.querySelector('.auth-button');
    const loginLink = document.getElementById('login-link');

    if (token) {
        // User is logged in
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.addEventListener('click', (event) => {
                event.preventDefault();
                // Clear the token cookie
                document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                // Redirect to the main page
                window.location.replace('../index.html');
            });
        }

        if (loginLink) {
            loginLink.style.display = 'none';
        }

        // If we're on the main page, fetch places data
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            displayPlaces(token);
        }
    } else {
        // User is not logged in
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.addEventListener('click', () => {
                window.location.assign('templates/login.html');
            });
        }

        if (loginLink) {
            loginLink.style.display = 'block';
        }

        // If we're on the main page, fetch places data without authentication
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            displayPlaces(null);
        }
    }
}

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        // Fetch places data if the user is authenticated
        displayPlaces(token);
    }
}

function getCookie(name) {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
