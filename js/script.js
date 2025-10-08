// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    
    // Update carousel track position
    const track = document.getElementById('carouselTrack');
    track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Event listeners for carousel buttons
if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

// Event listeners for indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance carousel every 5 seconds
let autoAdvance = setInterval(nextSlide, 5000);

// Pause auto-advance on hover
const carouselWrapper = document.querySelector('.carousel-wrapper');
if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', () => {
        clearInterval(autoAdvance);
    });

    carouselWrapper.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(nextSlide, 5000);
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Card click animation
document.querySelectorAll('.content-card, .blog-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add click effect
        this.style.transform = 'translate(-2px, -2px)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Blog page filter functionality
const filterCheckboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
const blogCards = document.querySelectorAll('.blog-card');

if (filterCheckboxes.length > 0) {
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterBlogPosts);
    });
}

function filterBlogPosts() {
    const selectedFilters = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
    
    // If no filters selected, show all
    if (selectedFilters.length === 0) {
        blogCards.forEach(card => {
            card.style.display = 'block';
        });
        updateResultsCount(blogCards.length);
        return;
    }
    
    // Filter cards
    let visibleCount = 0;
    blogCards.forEach(card => {
        const category = card.dataset.category;
        if (selectedFilters.includes(category)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
    const resultsElement = document.querySelector('.results-count');
    if (resultsElement) {
        resultsElement.textContent = `${count} resultado${count !== 1 ? 's' : ''}`;
    }
}

// Initialize results count on blog page
if (document.querySelector('.blog-layout')) {
    updateResultsCount(blogCards.length);
}

// Search functionality (if search input exists)
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}