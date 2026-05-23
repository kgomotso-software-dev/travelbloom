// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsList = document.getElementById('resultsList');
const bookNowBtn = document.getElementById('bookNowBtn');

// Travel data storage
let travelData = null;

// Fetch data from JSON file
async function fetchTravelData() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        travelData = await response.json();
        console.log('Travel data loaded successfully');
    } catch (error) {
        console.error('Error loading travel data:', error);
        // Fallback data in case JSON fails to load
        travelData = {
            countries: [],
            temples: [],
            beaches: []
        };
    }
}

// Search function
async function searchDestinations() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        resultsSection.classList.add('hidden');
        return;
    }
    
    // Ensure data is loaded
    if (!travelData) {
        await fetchTravelData();
    }
    
    const results = [];
    
    // Search in countries and their cities
    if (travelData.countries) {
        travelData.countries.forEach(country => {
            // Check if country name matches
            if (country.name.toLowerCase().includes(query)) {
                country.cities.forEach(city => {
                    results.push({
                        name: city.name,
                        location: country.name,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                });
            }
            // Check cities within country
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(query)) {
                    results.push({
                        name: city.name,
                        location: country.name,
                        description: city.description,
                        imageUrl: city.imageUrl
                    });
                }
            });
        });
    }
    
    // Search in temples
    if (travelData.temples && query === 'temple' || travelData.temples && query === 'temples') {
        travelData.temples.forEach(temple => {
            results.push({
                name: temple.name,
                location: 'Temple',
                description: temple.description,
                imageUrl: temple.imageUrl
            });
        });
    } else if (travelData.temples) {
        travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(query)) {
                results.push({
                    name: temple.name,
                    location: 'Temple',
                    description: temple.description,
                    imageUrl: temple.imageUrl
                });
            }
        });
    }
    
    // Search in beaches
    if (travelData.beaches && query === 'beach' || travelData.beaches && query === 'beaches') {
        travelData.beaches.forEach(beach => {
            results.push({
                name: beach.name,
                location: 'Beach',
                description: beach.description,
                imageUrl: beach.imageUrl
            });
        });
    } else if (travelData.beaches) {
        travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(query)) {
                results.push({
                    name: beach.name,
                    location: 'Beach',
                    description: beach.description,
                    imageUrl: beach.imageUrl
                });
            }
        });
    }
    
    displayResults(results);
}

// Display search results
function displayResults(results) {
    if (!resultsList) return;
    
    if (results.length === 0) {
        resultsList.innerHTML = `
            <div style="color: white; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>No destinations found. Try "beach", "temple", "Japan", or "Thailand".</p>
            </div>
        `;
        resultsSection.classList.remove('hidden');
        return;
    }
    
    resultsList.innerHTML = results.map(result => `
        <div class="result-card">
            <img src="${result.imageUrl || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400'}" alt="${result.name}">
            <div class="info">
                <h4>${result.name}</h4>
                <p><strong>📍 ${result.location}</strong></p>
                <p>${result.description}</p>
                <button class="book-btn" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="bookDestination('${result.name}')">Book Now</button>
            </div>
        </div>
    `).join('');
    
    resultsSection.classList.remove('hidden');
}

// Clear search results
function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
    }
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }
    if (resultsList) {
        resultsList.innerHTML = '';
    }
}

// Book Now function
function bookNow() {
    alert('Thank you for choosing TravelBloom! A travel expert will contact you within 24 hours to help plan your perfect trip.');
}

function bookDestination(destinationName) {
    alert(`Thank you for your interest in ${destinationName}! Our travel specialists will reach out shortly with exclusive deals.`);
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        if (name && email && message) {
            formMessage.textContent = 'Thank you! Your message has been sent. We will reply within 24 hours.';
            formMessage.className = 'form-message success';
            formMessage.classList.remove('hidden');
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        } else {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.className = 'form-message error';
            formMessage.classList.remove('hidden');
        }
    });
}

// Event Listeners
if (searchBtn) {
    searchBtn.addEventListener('click', searchDestinations);
}

if (clearBtn) {
    clearBtn.addEventListener('click', clearSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchDestinations();
        }
    });
}

if (bookNowBtn) {
    bookNowBtn.addEventListener('click', bookNow);
}

// Load travel data when page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchTravelData();
    
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
