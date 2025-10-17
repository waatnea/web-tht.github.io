// Team Detail Functions
function showTeamDetail(team) {
    const overlay = document.getElementById(team + '-overlay');
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideTeamDetail(team) {
    const overlay = document.getElementById(team + '-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Close all category contents
    const categories = overlay.querySelectorAll('.category-content');
    categories.forEach(category => {
        category.classList.remove('expanded');
    });
    
    const icons = overlay.querySelectorAll('.toggle-icon');
    icons.forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
    });
}

function toggleCategory(categoryId) {
    const content = document.getElementById(categoryId + '-content');
    const icon = document.getElementById(categoryId + '-icon');
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.classList.add('expanded');
        icon.style.transform = 'rotate(180deg)';
    }
}

// Smooth scroll to teams section
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    document.getElementById('teams').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Close overlay when clicking outside
document.querySelectorAll('.team-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.team-card, .resource-card, .rule-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});