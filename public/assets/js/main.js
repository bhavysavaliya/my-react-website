 // Search Modal Functionality
const searchBtn = document.getElementById('searchBtn');
const searchModal = document.getElementById('searchModal');
const closeSearchModal = document.getElementById('closeSearchModal');
const searchForm = document.querySelector('.search-form');

// Open modal when search button is clicked
if (searchBtn && searchModal) {
    searchBtn.addEventListener('click', () => {
        searchModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
}

// Close modal when X is clicked
if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow scrolling
    });
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Prevent form submission if search query is empty
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        const input = searchForm.querySelector('input[name="q"]');
        if (input.value.trim() === '') {
            e.preventDefault();
            alert('Please enter a search term');
        }
    });
