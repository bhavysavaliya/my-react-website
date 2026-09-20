// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gallery functionality
    initGallery();
});

function initGallery() {
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeBtn = document.getElementById('closeGalleryModal');
    
    // Add click event to each image
    galleryImages.forEach(function(img) {
        img.addEventListener('click', function() {
            openModal(this);
        });
        
        // Add pointer cursor to indicate clickability
        img.style.cursor = 'pointer';
    });
    
    // Function to open the modal with the clicked image
    function openModal(element) {
        modal.style.display = "block";
        modalImg.src = element.src;
        
        // Use data attributes for caption if available
        const title = element.getAttribute('data-caption-title') || '';
        const description = element.getAttribute('data-caption-desc') || '';
        
        if (title && description) {
            captionText.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        } else {
            // Fallback to alt text if data attributes aren't available
            captionText.innerHTML = element.alt;
        }
        
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
        // Re-enable background scrolling
        document.body.style.overflow = 'auto';
    }
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}   