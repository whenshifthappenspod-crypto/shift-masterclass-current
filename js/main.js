// ===================================
// SHIFT Masterclass - Main JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initFormValidation();
    initScrollAnimations();
    initNavbarScroll();
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// ===================================
// SMOOTH SCROLLING
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hash
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// FAQ ACCORDION
// ===================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ===================================
// FORM VALIDATION
// ===================================
function initFormValidation() {
    const form = document.getElementById('enrollmentForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Reset previous errors
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(el => el.style.display = 'none');

        const errorGroups = form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => group.classList.remove('error'));

        let isValid = true;

        // Full Name validation
        const fullName = document.getElementById('fullName');
        if (!fullName.value.trim()) {
            showError(fullName, 'Please enter your full name');
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email');
        if (!email.value.trim()) {
            showError(email, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        if (!isValid) return;

        const linkedin = document.getElementById('linkedin');

        const formData = {
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            linkedin: linkedin ? linkedin.value.trim() : '',
            _captcha: 'false'
        };

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        // Send as a normal POST to the main Formsubmit endpoint (no /ajax),
        // encoded like a regular HTML form, so it behaves exactly as expected.
        const urlEncoded = new URLSearchParams(formData).toString();

        fetch('https://formsubmit.co/whenshifthappens.pod@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            body: urlEncoded
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Submission failed');
            }
            // We don't need the HTML thank-you page; just treat success as delivered.
            return response.text();
        })
        .then(() => {
            submitForm(form, formData);
        })
        .catch(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
            }

            let globalError = form.querySelector('.form-global-error');
            if (!globalError) {
                globalError = document.createElement('div');
                globalError.className = 'form-global-error form-error';
                form.prepend(globalError);
            }
            globalError.textContent = 'Something went wrong while submitting. Please try again in a moment.';
            globalError.style.display = 'block';
        });
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function submitForm(form, formData) {
    // Show success message
    const formCard = form.closest('.form-card');
    formCard.innerHTML = `
        <div class="form-success fade-in-up">
            <i class="fas fa-check-circle"></i>
            <h3>Application Submitted!</h3>
            <p>Thank you for applying to SHIFT Masterclass, ${formData.fullName}.</p>
            <p>We'll review your application and respond within 48 hours to <strong>${formData.email}</strong>.</p>
            <p style="margin-top: 30px; color: var(--text-muted);">
                In the meantime, check out the <a href="https://www.youtube.com/@when-shift-happens" target="_blank" style="color: var(--accent-color);">When Shift Happens podcast</a> to learn from the experts who'll be teaching the masterclass.
            </p>
        </div>
    `;
    
    // Scroll to success message
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Track submission (for analytics)
    console.log('Form submitted:', formData);
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(`
        .problem-card,
        .module-card,
        .benefit-card,
        .episode-card,
        .audience-card,
        .solution-card
    `);
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===================================
// EPISODE CARD CLICK HANDLERS
// ===================================
// Add click handlers for episode cards to open specific YouTube episodes
document.addEventListener('DOMContentLoaded', function() {
    const episodeCards = document.querySelectorAll('.episode-card');
    
    episodeCards.forEach((card) => {
        card.style.cursor = 'pointer';
        
        // Get the episode URL from the data attribute
        const episodeUrl = card.getAttribute('data-episode-url');
        
        card.addEventListener('click', function() {
            if (episodeUrl) {
                window.open(episodeUrl, '_blank');
            }
        });
    });
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ===================================
// ANALYTICS (placeholder)
// ===================================
function trackEvent(category, action, label) {
    // Add your analytics tracking here
    // Example: gtag('event', action, { 'event_category': category, 'event_label': label });
    console.log('Event tracked:', { category, action, label });
}

// Track CTA button clicks
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const text = this.textContent.trim();
            trackEvent('CTA', 'click', text);
        });
    });
});