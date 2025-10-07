// Demo Authentication and Data Handler
const DEMO_EMAIL = 'abc@gmail.com';
const DEMO_PASSWORD = 'abc123';

// Initialize demo data in localStorage
function initializeDemoData() {
    // User profile data
    const demoUser = {
        email: DEMO_EMAIL,
        name: 'Demo User',
        company: 'TechStart Solutions',
        brandName: 'TechStart',
        industry: 'Technology / SaaS',
        businessType: 'B2B Software',
        teamSize: '10-50 employees',
        targetAudience: 'Small to medium businesses, startup founders, tech professionals',
        socialPlatforms: {
            facebook: { connected: true, handle: '@techstart', followers: 5200 },
            instagram: { connected: true, handle: '@techstart_official', followers: 8900 },
            twitter: { connected: true, handle: '@techstart', followers: 3400 },
            linkedin: { connected: true, handle: 'techstart-solutions', followers: 2100 },
            youtube: { connected: false, handle: '', followers: 0 }
        },
        contentThemes: ['Product Updates', 'Industry News', 'Tips & Tutorials', 'Company Culture'],
        postingFrequency: 'Daily',
        timezone: 'America/New_York',
        joinDate: '2024-01-15',
        plan: 'Premium',
        isDemo: true
    };
    
    // Demo posts across past and future to showcase all features
    const platformsPool = ['facebook', 'instagram', 'twitter', 'linkedin'];

    function pickPlatforms() {
        const shuffled = [...platformsPool].sort(() => Math.random() - 0.5);
        const count = 1 + Math.floor(Math.random() * 3); // 1 to 3 platforms
        return shuffled.slice(0, count);
    }

    function sampleContent(idx) {
        const samples = [
            'Excited to announce our new product launch! 🚀',
            'Top 5 productivity tips for remote teams 💼',
            'Behind the scenes of our creative process 🎬',
            'Customer story: 200% growth in 3 months 📈',
            'Join our webinar on 2025 social trends 📣',
            'Feature spotlight: Smart Scheduling ⏰',
            'Pro tip: Boost engagement with carousels 📸',
            'Weekly round-up: What’s new at TechStart 📰',
            'Sneak peek: Upcoming features 🔍',
            'Community highlight: Thank you for 10k 🎉'
        ];
        return samples[idx % samples.length];
    }

    const now = Date.now();

    // Future scheduled posts: next 60 days
    const futurePosts = Array.from({ length: 12 }, (_, i) => {
        const daysAhead = 1 + Math.floor(Math.random() * 60);
        const dt = new Date(now + daysAhead * 86400000);
        dt.setHours(10 + Math.floor(Math.random() * 9), [0, 15, 30, 45][Math.floor(Math.random()*4)], 0, 0);
        return {
            id: i + 1,
            content: sampleContent(i) + ' #SocialSetu #Demo',
            platforms: pickPlatforms(),
            scheduleTime: dt.toISOString(),
            status: 'scheduled',
            createdAt: new Date().toISOString()
        };
    });

    // Recent published posts: last 30 days
    const pastPosts = Array.from({ length: 8 }, (_, i) => {
        const daysBack = 1 + Math.floor(Math.random() * 30);
        const dt = new Date(now - daysBack * 86400000);
        dt.setHours(9 + Math.floor(Math.random() * 10), [0, 20, 40][Math.floor(Math.random()*3)], 0, 0);
        return {
            id: futurePosts.length + i + 1,
            content: sampleContent(i + 5),
            platforms: pickPlatforms(),
            scheduleTime: dt.toISOString(),
            status: 'published',
            createdAt: new Date(now - (daysBack + 1) * 86400000).toISOString()
        };
    });

    const demoPosts = [...futurePosts, ...pastPosts].sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime));
    
    // Demo analytics data
    const demoAnalytics = {
        totalPosts: 145,
        totalEngagement: 45600,
        totalReach: 125000,
        followers: {
            facebook: 5200,
            instagram: 8900,
            twitter: 3400,
            linkedin: 2100
        },
        weeklyGrowth: {
            posts: 12,
            engagement: 8.5,
            reach: 15.2,
            followers: 3.7
        },
        topPosts: [
            {
                content: 'Our biggest sale of the year starts now! 50% off everything',
                engagement: 3500,
                platform: 'instagram'
            },
            {
                content: 'New blog post: The future of AI in social media',
                engagement: 2100,
                platform: 'linkedin'
            }
        ]
    };
    
    // Store demo data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    localStorage.setItem('socialSetuPosts', JSON.stringify(demoPosts));
    localStorage.setItem('socialSetuAnalytics', JSON.stringify(demoAnalytics));
    localStorage.setItem('isLoggedIn', 'true');
    // Mark demo session so Firebase onAuthState doesn't redirect away
    localStorage.setItem('isDemo', 'true');
}

// Check demo login credentials
function checkDemoLogin(email, password) {
    return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}

// Handle demo login
function handleDemoLogin() {
    initializeDemoData();
    return true;
}

// Clear demo data on logout
function clearDemoData() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('socialSetuPosts');
    localStorage.removeItem('socialSetuAnalytics');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('generatedIdeas');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkDemoLogin,
        handleDemoLogin,
        clearDemoData,
        DEMO_EMAIL,
        DEMO_PASSWORD
    };
}