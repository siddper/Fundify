// Review carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const reviews = document.querySelectorAll('.review');
    let currentReviewIndex = 0;
    const reviewInterval = 4000; // 4 seconds per review

    // Function to show a specific review
    function showReview(index) {
        // Hide all reviews
        reviews.forEach(review => {
            review.classList.remove('active');
        });
        
        // Show the current review
        if (reviews[index]) {
            reviews[index].classList.add('active');
        }
    }

    // Function to move to next review
    function nextReview() {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        showReview(currentReviewIndex);
    }

    // Start the carousel
    function startCarousel() {
        // Show the first review immediately
        showReview(0);
        
        // Set up the interval for automatic rotation
        setInterval(nextReview, reviewInterval);
    }

    // Initialize the carousel
    startCarousel();
}); 