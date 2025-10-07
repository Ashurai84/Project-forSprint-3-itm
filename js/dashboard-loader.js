// Dashboard Data Loader
// This script handles loading both demo and real user data into the dashboard

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});

function loadDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isDemo = currentUser.isDemo === true;
    
    if (isDemo) {
        loadDemoData();
    } else {
        loadRealData();
    }
    
    // Update user profile section
    updateUserProfile(currentUser);
}

function loadDemoData() {
    // Load analytics data
    const analytics = JSON.parse(localStorage.getItem('socialSetuAnalytics') || '{}');
    
    // Update stats cards
    if (analytics.totalPosts) {
        updateStatCard('total-posts', analytics.totalPosts, '+12% from last month');
    }
    
    if (analytics.totalEngagement) {
        const engagementK = (analytics.totalEngagement / 1000).toFixed(1) + 'K';
        updateStatCard('engagement', engagementK, '+8% from last week');
    }
    
    if (analytics.totalReach) {
        const reachK = (analytics.totalReach / 1000).toFixed(1) + 'K';
        updateStatCard('total-reach', reachK, '+25% from last month');
    }
    
    // Load posts
    const posts = JSON.parse(localStorage.getItem('socialSetuPosts') || '[]');
    
    // Update scheduled count
    const scheduledPosts = posts.filter(p => p.status === 'scheduled');
    updateStatCard('scheduled', scheduledPosts.length, scheduledPosts.length > 0 ? 'Next in 2 hours' : 'No scheduled posts');
    
    // Update upcoming posts section
    updateUpcomingPostsSection(scheduledPosts.slice(0, 3));
    
    // Update recent posts section
    updateRecentPostsSection(posts.slice(0, 5));
    
    // Update quick stats in sidebar
    updateQuickStats(analytics);
}

function loadRealData() {
    // This would load real user data from Firebase or your backend
    // For now, we'll just use default values
    updateStatCard('total-posts', '0', 'No posts yet');
    updateStatCard('engagement', '0', 'No engagement data');
    updateStatCard('scheduled', '0', 'No scheduled posts');
    updateStatCard('total-reach', '0', 'No reach data');
}

function updateStatCard(statType, value, change) {
    const statCard = document.querySelector(`[data-stat="${statType}"]`);
    if (statCard) {
        const valueElement = statCard.querySelector('.stat-value');
        const changeElement = statCard.querySelector('.stat-change');
        
        if (valueElement) valueElement.textContent = value;
        if (changeElement) changeElement.textContent = change;
    }
}

function updateUpcomingPostsSection(posts) {
    const container = document.getElementById('upcomingPosts');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No upcoming posts</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => {
        const date = new Date(post.scheduleTime);
        const platforms = Array.isArray(post.platforms) ? post.platforms.join(', ') : 'Multiple platforms';
        
        return `
            <div class="scheduled-item">
                <div class="scheduled-time">${formatDateTime(date)}</div>
                <div class="scheduled-content">
                    ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}
                </div>
                <div class="scheduled-platforms">${platforms}</div>
            </div>
        `;
    }).join('');
}

function updateRecentPostsSection(posts) {
    const container = document.querySelector('.post-list');
    if (!container) return;
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No recent posts</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => {
        const status = post.status || 'draft';
        const statusClass = `status-${status}`;
        const platforms = Array.isArray(post.platforms) ? post.platforms : ['Social Media'];
        const primaryPlatform = platforms[0];
        const timeAgo = getTimeAgo(new Date(post.createdAt || post.scheduleTime));
        
        return `
            <div class="post-item">
                <div class="post-info">
                    <div class="post-title">${post.content.substring(0, 60)}${post.content.length > 60 ? '...' : ''}</div>
                    <div class="post-meta">${capitalizeFirst(primaryPlatform)} • ${timeAgo}</div>
                </div>
                <span class="post-status ${statusClass}">${capitalizeFirst(status)}</span>
            </div>
        `;
    }).join('');
}

function updateQuickStats(analytics) {
    const quickStats = document.getElementById('quickStats');
    if (!quickStats || !analytics.weeklyGrowth) return;
    
    quickStats.innerHTML = `
        <div class="scheduled-item">
            <div class="scheduled-content">Posts This Week</div>
            <div class="scheduled-time">${analytics.weeklyGrowth.posts || 0}</div>
        </div>
        <div class="scheduled-item">
            <div class="scheduled-content">Engagement Rate</div>
            <div class="scheduled-time">${analytics.weeklyGrowth.engagement || 0}%</div>
        </div>
        <div class="scheduled-item">
            <div class="scheduled-content">This Week's Reach</div>
            <div class="scheduled-time">${(analytics.totalReach / 1000).toFixed(1)}K</div>
        </div>
    `;
}

// Utility functions
function formatDateTime(date) {
    const now = new Date();
    const diff = date - now;
    
    if (diff < 0) {
        return getTimeAgo(date);
    }
    
    if (diff < 86400000) { // Less than 24 hours
        const hours = Math.floor(diff / 3600000);
        return `In ${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    if (diff < 86400000) { // Less than 24 hours
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    const days = Math.floor(diff / 86400000);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateUserProfile(user) {
    const profileElement = document.getElementById('userProfile');
    if (!profileElement || !user.email) return;
    
    // Count connected platforms
    let connectedCount = 0;
    if (user.socialPlatforms) {
        connectedCount = Object.values(user.socialPlatforms).filter(p => p.connected).length;
    }
    
    profileElement.innerHTML = `
        <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 1.125rem; font-weight: 600;">${user.company || user.brandName || 'Your Brand'}</div>
            <div style="font-size: 0.875rem; opacity: 0.9;">${user.industry || 'Industry'}</div>
        </div>
        <div style="font-size: 0.75rem; opacity: 0.85;">
            <div style="margin-bottom: 0.25rem;">📧 ${user.email}</div>
            <div style="margin-bottom: 0.25rem;">⭐ ${user.plan || 'Free'} Plan</div>
            <div>👥 ${connectedCount} Platform${connectedCount !== 1 ? 's' : ''} Connected</div>
        </div>
    `;
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadDashboardData,
        updateUpcomingPostsSection,
        updateRecentPostsSection
    };
}