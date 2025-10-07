// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        this.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Smooth Scroll to Form
function scrollToForm() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
    
    // Focus on the first input field after scrolling
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 800);
}

// Form Handling
document.getElementById('leadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        source: document.getElementById('source').value
    };
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.source) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Phone validation (basic Indian phone number check)
    if (!isValidPhone(formData.phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Simulate saving to Firebase
    showLoadingState();
    
    // Save to Firebase
    try {
        const result = await window.saveLeadToFirestore(formData);
        
        if (result.success) {
            console.log('Lead captured with ID:', result.id);
            showNotification('Successfully saved to Firebase! We\'ll contact you soon.', 'success');
            this.reset();
            localStorage.removeItem('leadFormData'); // Clear saved form data
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Firebase error:', error);
        showNotification('Error saving to Firebase. Please try again.', 'error');
    } finally {
        hideLoadingState();
    }
});

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Basic Indian phone number validation (10 digits, optionally starting with +91)
    const phoneRegex = /^(\+91[\s-]?)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showLoadingState() {
    const submitButton = document.querySelector('.form-submit');
    submitButton.innerHTML = `
        <span class="loading-spinner"></span>
        Saving to Firebase...
    `;
    submitButton.disabled = true;
    
    // Add spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

function hideLoadingState() {
    const submitButton = document.querySelector('.form-submit');
    submitButton.innerHTML = 'Start Free Trial';
    submitButton.disabled = false;
}

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .section-header');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Pricing Section Toggle (if needed in future)
function togglePricing(planType) {
    console.log('Pricing plan selected:', planType);
    // Future implementation for pricing plans
}

// Newsletter Signup (if added later)
function subscribeNewsletter(email) {
    if (isValidEmail(email)) {
        console.log('Newsletter subscription:', email);
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        return true;
    }
    showNotification('Please enter a valid email address', 'error');
    return false;
}

// Contact Form Auto-save (localStorage backup)
function autoSaveForm() {
    const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        source: document.getElementById('source')?.value || ''
    };
    
    localStorage.setItem('leadFormData', JSON.stringify(formData));
}

function restoreFormData() {
    const savedData = localStorage.getItem('leadFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('name').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('source').value = formData.source || '';
    }
}

// Auto-save form data on input
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('#leadForm input, #leadForm select');
    
    // Restore saved data
    restoreFormData();
    
    // Save data on input
    formInputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
        input.addEventListener('change', autoSaveForm);
    });
});

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('scheduler-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('scheduler-theme', newTheme);

    const notification = document.createElement('div');
    notification.textContent = `${newTheme === 'dark' ? 'Dark' : 'Light'} theme activated`;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${newTheme === 'dark' ? '#1F2937' : '#FFFFFF'};
        color: ${newTheme === 'dark' ? '#F9FAFB' : '#1F2937'};
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        animation: fadeIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

window.toggleTheme = toggleTheme;