 // API Configuration
 const API_KEY = 'API_KEY'; 
 const API_BASE = 'https://www.omdbapi.com/';

 // DOM Elements
 const searchInput = document.getElementById('search-input');
 const searchButton = document.getElementById('search-button');
 const typeFilter = document.getElementById('type-filter');
 const yearFilter = document.getElementById('year-filter');
 const resultsContainer = document.getElementById('results-container');
 const paginationContainer = document.getElementById('pagination');
 const loadingElement = document.getElementById('loading');
 const errorMessage = document.getElementById('error-message');
 const movieDetails = document.getElementById('movie-details');
 const detailsContent = document.querySelector('.details-content');
 const closeDetails = document.getElementById('close-details');

 // Global State
 let currentPage = 1;
 let totalResults = 0;
 let currentSearchTerm = '';
 let currentType = '';
 let currentYear = '';

 // Initialize the application
 function init() {
     // Set up event listeners
     searchButton.addEventListener('click', performSearch);
     searchInput.addEventListener('keyup', (e) => {
         if (e.key === 'Enter') performSearch();
     });
     
     typeFilter.addEventListener('change', () => {
         currentType = typeFilter.value;
         if (currentSearchTerm) performSearch();
     });
     
     yearFilter.addEventListener('change', () => {
         currentYear = yearFilter.value;
         if (currentSearchTerm) performSearch();
     });
     
     closeDetails.addEventListener('click', () => {
         movieDetails.classList.add('hidden');
     });
     
     // Generate year options (from 1900 to current year)
     const currentYearValue = new Date().getFullYear();
     for (let year = currentYearValue; year >= 1900; year--) {
         const option = document.createElement('option');
         option.value = year;
         option.textContent = year;
         yearFilter.appendChild(option);
     }
 }

 // Perform search function
 async function performSearch() {
     const searchTerm = searchInput.value.trim();
     
     if (!searchTerm) {
         showError('Por favor ingresa un término de búsqueda');
         return;
     }
     
     // Update current search parameters
     currentSearchTerm = searchTerm;
     currentPage = 1;
     
     // Show loading state
     showLoading(true);
     hideError();
     
     try {
         // Build the search URL using URLSearchParams
         const params = new URLSearchParams({
             apikey: API_KEY,
             s: searchTerm,
             page: currentPage
         });
         
         if (currentType) params.append('type', currentType);
         if (currentYear) params.append('y', currentYear);
         
         const searchUrl = `${API_BASE}?${params.toString()}`;
         
         // Fetch data from OMDB API
         const response = await fetch(searchUrl);
         const data = await response.json();
         
         // Check for errors
         if (data.Response === 'False') {
             showError(data.Error || 'No se encontraron resultados');
             resultsContainer.innerHTML = '';
             paginationContainer.innerHTML = '';
             return;
         }
         
         // Process successful response
         totalResults = parseInt(data.totalResults);
         displayResults(data.Search);
         setupPagination();
         
     } catch (error) {
         showError('Error al conectarse con el servidor. Inténtalo de nuevo.');
         console.error('API Error:', error);
     } finally {
         showLoading(false);
     }
 }

 // Display search results
 function displayResults(movies) {
     resultsContainer.innerHTML = '';
     
     if (!movies || movies.length === 0) {
         resultsContainer.innerHTML = '<p>No se encontraron películas</p>';
         return;
     }
     
     movies.forEach(movie => {
         const movieCard = document.createElement('div');
         movieCard.classList.add('movie-card');
         
         // Create movie card HTML
         movieCard.innerHTML = `
             <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" 
                  alt="${movie.Title}" 
                  class="movie-poster">
             <div class="movie-info">
                 <h3 class="movie-title">${movie.Title}</h3>
                 <p class="movie-year">${movie.Year}</p>
                 <p class="movie-type">${getTypeDisplay(movie.Type)}</p>
             </div>
         `;
         
         // Add click event to show details
         movieCard.addEventListener('click', () => {
             showMovieDetails(movie.imdbID);
         });
         
         resultsContainer.appendChild(movieCard);
     });
 }

 // Get display text for movie type
 function getTypeDisplay(type) {
     const typeMap = {
         'movie': 'Película',
         'series': 'Serie',
         'episode': 'Episodio'
     };
     return typeMap[type] || type;
 }

 // Setup pagination controls
function setupPagination() {
    if (!totalResults) {
        throw new Error('totalResults is undefined or null');
    }
    
    paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(totalResults / 10);
    
    if (totalPages === 0) {
        throw new Error('totalResults is 0, cannot calculate totalPages');
    }
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    
    // Check if currentPage is greater than 1 to enable/disable prevButton
    prevButton.disabled = currentPage <= 1;
    
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);
    
   // Page buttons
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            try {
                currentPage = i;
                loadPage(currentPage);
            } catch (error) {
                console.error(error);
            }
        });

        // Agregar condicional para cambiar el color de fondo del botón
        if (i === currentPage) {
            pageButton.style.background = 'red';
        } else {
            pageButton.style.background = ''; // Restaurar el color de fondo original
        }

        paginationContainer.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage >= totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadPage(currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}
 
// Load a specific page of results
async function loadPage(page) {
    showLoading(true);
    hideError();
    
    try {
        // Build the search URL using URLSearchParams
        const params = new URLSearchParams({
            apikey: API_KEY,
            s: currentSearchTerm,
            page: page
        });
        
        if (currentType) params.append('type', currentType);
        if (currentYear) params.append('y', currentYear);
        
        const searchUrl = `${API_BASE}?${params.toString()}`;
        
        // Fetch data from OMDB API
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        // Check for errors
        if (data.Response === 'False') {
            showError(data.Error || 'Error al cargar la página');
            return;
        }
        
        // Update currentPage before calling setupPagination
        currentPage = page;
        
        // Update results
        displayResults(data.Search);
        setupPagination();
        
    } catch (error) {
        showError('Error al conectarse con el servidor. Inténtalo de nuevo.');
        console.error('API Error:', error);
    } finally {
        showLoading(false);
    }
}

 // Show movie details
 async function showMovieDetails(imdbID) {
     showLoading(true);
     hideError();
     movieDetails.classList.add('hidden');
     
     try {
         // Build the details URL using URLSearchParams
         const params = new URLSearchParams({
             apikey: API_KEY,
             i: imdbID,
             plot: 'full'
         });
         
         const detailsUrl = `${API_BASE}?${params.toString()}`;
         
         // Fetch movie details
         const response = await fetch(detailsUrl);
         const movie = await response.json();
         
         // Check for errors
         if (movie.Response === 'False') {
             showError(movie.Error || 'Error al cargar los detalles de la película');
             return;
         }
         
         // Display movie details
         displayMovieDetails(movie);
         movieDetails.classList.remove('hidden');
         
     } catch (error) {
         showError('Error al cargar los detalles de la película');
         console.error('API Error:', error);
     } finally {
         showLoading(false);
     }
 }

 // Display movie details in modal
 function displayMovieDetails(movie) {
     // Build movie details HTML
     detailsContent.innerHTML = `
         <div class="details-header">
             <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}" 
                  alt="${movie.Title}" 
                  class="details-poster">
             <div class="details-info">
                 <h2 class="details-title">${movie.Title} (${movie.Year})</h2>
                 <div class="details-meta">
                     <span>${movie.Rated}</span>
                     <span>${movie.Runtime}</span>
                     <span>${movie.Genre}</span>
                     <div class="details-rating">
                         <i class="fas fa-star"></i>
                         ${movie.imdbRating}/10
                     </div>
                 </div>
                 <p class="details-plot">${movie.Plot}</p>
                 
                 <div class="details-grid">
                     <div class="details-item">
                         <div class="details-label">Director</div>
                         <div class="details-value">${movie.Director}</div>
                     </div>
                     <div class="details-item">
                         <div class="details-label">Escritores</div>
                         <div class="details-value">${movie.Writer}</div>
                     </div>
                     <div class="details-item">
                         <div class="details-label">Actores</div>
                         <div class="details-value">${movie.Actors}</div>
                     </div>
                     <div class="details-item">
                         <div class="details-label">Idioma</div>
                         <div class="details-value">${movie.Language}</div>
                     </div>
                     <div class="details-item">
                         <div class="details-label">País</div>
                         <div class="details-value">${movie.Country}</div>
                     </div>
                     <div class="details-item">
                         <div class="details-label">Premios</div>
                         <div class="details-value">${movie.Awards}</div>
                     </div>
                 </div>
             </div>
         </div>
     `;
 }

 // Show loading state
 function showLoading(show) {
     loadingElement.style.display = show ? 'block' : 'none';
 }

 // Show error message
 function showError(message) {
     errorMessage.textContent = message;
     errorMessage.style.display = 'block';
 }

 // Hide error message
 function hideError() {
     errorMessage.style.display = 'none';
 }

 // Initialize the application when DOM is loaded
 document.addEventListener('DOMContentLoaded', init);
