// Global state
let currentUser = null;
let currentSection = 'dashboard';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    generateCalendar();
    setupEventListeners();
});

function initializeDashboard() {
    // Set initial active section
    showSection('dashboard');
    
    // Initialize character counter for create post modal
    const postContent = document.getElementById('postContent');
    if (postContent) {
        postContent.addEventListener('input', updateCharacterCount);
    }
    
    // Initialize schedule options
    const scheduleRadios = document.querySelectorAll('input[name="schedule"]');
    scheduleRadios.forEach(radio => {
        radio.addEventListener('change', toggleScheduleDateTime);
    });
    
    // Initialize create post form
    const createPostForm = document.querySelector('.create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }
}

function setupEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('createPostModal');
        if (e.target === modal) {
            hideCreatePost();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close modal
        if (e.key === 'Escape') {
            hideCreatePost();
        }
        
        // Ctrl/Cmd + N to create new post
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            showCreatePost();
        }
    });
}

// Navigation functions
function showSection(sectionName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    }
    
    currentSection = sectionName;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Create Post Modal functions
function showCreatePost() {
    const modal = document.getElementById('createPostModal');
    modal.classList.add('active');
    // Accessibility: mark dialog visible and prevent body scroll
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus on platform select
    const platformSelect = document.getElementById('postPlatform');
    if (platformSelect) {
        platformSelect.focus();
    }
}

function hideCreatePost() {
    const modal = document.getElementById('createPostModal');
    modal.classList.remove('active');
    // Accessibility: mark dialog hidden and restore body scroll
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset form
    const form = document.querySelector('.create-post-form');
    if (form) {
        form.reset();
        updateCharacterCount();
        toggleScheduleDateTime();
    }
}

function updateCharacterCount() {
    const postContent = document.getElementById('postContent');
    const charCount = document.getElementById('charCount');
    
    if (postContent && charCount) {
        const count = postContent.value.length;
        charCount.textContent = count;
        
        // Change color based on character limit
        if (count > 250) {
            charCount.style.color = 'var(--error)';
        } else if (count > 200) {
            charCount.style.color = 'var(--warning)';
        } else {
            charCount.style.color = 'var(--text-light)';
        }
    }
}

function toggleScheduleDateTime() {
    const scheduleRadios = document.querySelectorAll('input[name="schedule"]');
    const scheduleDateTime = document.getElementById('scheduleDateTime');
    
    const isScheduleLater = Array.from(scheduleRadios).find(radio => 
        radio.checked && radio.value === 'later'
    );
    
    if (scheduleDateTime) {
        scheduleDateTime.style.display = isScheduleLater ? 'block' : 'none';
    }
}

async function handleCreatePost(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const postData = {
        platform: formData.get('postPlatform'),
        content: document.getElementById('postContent').value,
        schedule: formData.get('schedule'),
        scheduledFor: formData.get('schedule') === 'later' ? 
            document.getElementById('scheduleTime').value : null
    };
    
    // Validation
    if (!postData.platform || !postData.content.trim()) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (postData.schedule === 'later' && !postData.scheduledFor) {
        showNotification('Please select a date and time for scheduling.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading-spinner"></span>Creating...';
    submitBtn.disabled = true;
    
    try {
        // Convert scheduled time to timestamp if needed
        if (postData.scheduledFor) {
            postData.scheduledFor = new Date(postData.scheduledFor).toISOString();
        }
        
        // Save post using Firebase function
        const result = await window.savePost(postData);
        
        if (result.success) {
            showNotification('Post created successfully!', 'success');
            hideCreatePost();
            
            // Refresh the posts section if currently viewing
            if (currentSection === 'posts') {
                // In a real app, you would refresh the posts list here
                console.log('Refreshing posts list...');
            }
        } else {
            throw new Error(result.error);
        }
        
    } catch (error) {
        console.error('Error creating post:', error);
        showNotification('Failed to create post. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Calendar functions
function generateCalendar() {
    const calendarBody = document.getElementById('calendarBody');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarBody || !currentMonthElement) return;
    
    // Update month display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear previous calendar
    calendarBody.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Generate calendar days
    let dayCount = 1;
    
    for (let week = 0; week < 6; week++) {
        for (let day = 0; day < 7; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-date';
            
            if (week === 0 && day < firstDay) {
                // Empty cells before first day
                dayElement.innerHTML = '';
            } else if (dayCount <= daysInMonth) {
                dayElement.innerHTML = `
                    <div class="date-number">${dayCount}</div>
                    <div class="date-posts">
                        ${generateRandomPosts(dayCount)}
                    </div>
                `;
                
                // Highlight today
                const today = new Date();
                if (currentYear === today.getFullYear() && 
                    currentMonth === today.getMonth() && 
                    dayCount === today.getDate()) {
                    dayElement.classList.add('today');
                }
                
                dayCount++;
            }
            
            calendarBody.appendChild(dayElement);
        }
        
        if (dayCount > daysInMonth) break;
    }
    
    // Add calendar styles
    addCalendarStyles();
}

function generateRandomPosts(day) {
    // Simulate some posts on random days
    const hasPost = Math.random() > 0.7;
    if (!hasPost) return '';
    
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    
    return `<div class="calendar-post ${randomPlatform}"></div>`;
}

function addCalendarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .calendar-date {
            min-height: 100px;
            padding: 0.5rem;
            border-right: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
            background: var(--surface);
            transition: var(--transition);
        }
        
        .calendar-date:hover {
            background: var(--background);
        }
        
        .calendar-date:nth-child(7n) {
            border-right: none;
        }
        
        .calendar-date.today {
            background: rgba(59, 130, 246, 0.1);
        }
        
        .date-number {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.25rem;
        }
        
        .calendar-date.today .date-number {
            color: var(--primary-color);
        }
        
        .date-posts {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
        }
        
        .calendar-post {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        
        .calendar-post.facebook {
            background: #1877F2;
        }
        
        .calendar-post.twitter {
            background: #1DA1F2;
        }
        
        .calendar-post.instagram {
            background: #E4405F;
        }
        
        .calendar-post.linkedin {
            background: #0A66C2;
        }
    `;
    
    // Only add if not already added
    if (!document.querySelector('#calendar-styles')) {
        style.id = 'calendar-styles';
        document.head.appendChild(style);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar();
}

// Utility functions
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
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 2001;
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

// Add loading spinner styles
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

// Export functions for global access
window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.showCreatePost = showCreatePost;
window.hideCreatePost = hideCreatePost;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;