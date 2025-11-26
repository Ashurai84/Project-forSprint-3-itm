// Gemini AI Integration for Social Media Scheduler (Official Google API)
class GeminiAI {
    constructor() {
        // NOTE: This key is expected to be provided by you. It was present in earlier versions.
        // If you plan to deploy, move this to a server-side proxy for security.
        this.apiKey = ' gemini-api-key';
        // Using the correct model name for v1beta API
        this.model = 'gemini-2.0-flash';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.conversationHistory = [];
    }

    // Core caller using Google Generative Language API
    async callGemini(prompt, temperature = 0.7) {
        const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
        
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }]}],
                    generationConfig: { temperature }
                })
            });

            if (!res.ok) {
                const errorText = await res.text().catch(() => '');
                console.error('Gemini API Error:', errorText);
                
                // Parse error message if possible
                let errorMessage = `API error ${res.status}`;
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.error?.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch (e) {
                    // Use default error message
                }
                
                // Check for common errors
                if (res.status === 403) {
                    console.warn('\n⚠️ API Key Issue: The Generative Language API is not enabled for this key.');
                    console.warn('To fix this:');
                    console.warn('1. Go to https://console.cloud.google.com/apis/library');
                    console.warn('2. Search for "Generative Language API"');
                    console.warn('3. Enable it for your project');
                    console.warn('4. Or use a different API key\n');
                } else if (res.status === 400 && errorMessage.includes('expired')) {
                    console.warn('\n⚠️ API Key Expired!');
                    console.warn('Your API key has expired. To fix this:');
                    console.warn('1. Go to https://makersuite.google.com/app/apikey');
                    console.warn('2. Generate a new API key');
                    console.warn('3. Update it in js/gemini.js line 6\n');
                    errorMessage = 'API key expired. Please get a new key from Google AI Studio.';
                }
                
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return text.trim();
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw error;
        }
    }

    // Conversation caller using message history
    async callGeminiWithContents(contents, temperature = 0.7) {
        const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents, generationConfig: { temperature } })
        });
        if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text.trim();
    }

    // Content Generation
    async generateContent(businessType, targetAudience, platform, postTopic) {
        const prompt = `You are a social media content expert. Generate engaging content for a ${businessType} targeting ${targetAudience}.

Platform: ${platform}
Post Topic: ${postTopic}

Generate:
1. An engaging caption (2-3 sentences)
2. 5-8 relevant hashtags
3. 3 additional post ideas related to this topic

Important: Return ONLY valid JSON with keys: caption, hashtags (array), ideas (array).`;

        try {
            const content = await this.callGemini(prompt, 0.8);
            try {
                return JSON.parse(content);
            } catch (e) {
                // Fallback if JSON parsing fails
                return {
                    caption: "Exciting updates coming your way. Stay tuned for content your audience will love.",
                    hashtags: ["#SocialMedia", "#Content", "#Engagement", "#Growth", "#DigitalMarketing", "#Strategy"],
                    ideas: [
                        "Behind-the-scenes content showing your team at work",
                        "Customer testimonials and success stories",
                        "Industry tips and best practices"
                    ]
                };
            }
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }

    // Hashtag Suggestions
    async suggestHashtags(content, platform, industry) {
        const prompt = `As a social media hashtag expert, suggest 10-15 relevant hashtags for this content.\n\nContent: "${content}"\nPlatform: ${platform}\nIndustry: ${industry}\n\nProvide a mix of popular, niche, and trending hashtags.\nReturn ONLY valid JSON with keys: popular (array), niche (array), trending (array).`;

        try {
            const text = await this.callGemini(prompt, 0.7);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error suggesting hashtags:', error);
            return {
                popular: ["#viral", "#trending", "#popular"],
                niche: ["#smallbusiness", "#startup", "#entrepreneur"],
                trending: ["#trends", "#innovation", "#growth"]
            };
        }
    }

    // Sentiment Analysis
    async analyzeSentiment(comments) {
        const prompt = `You are a sentiment analysis expert. Analyze these comments/feedback:\n\n${comments}\n\nProvide overall sentiment, sentiment score (0-100), breakdown (positive/neutral/negative with colors), trends, keyTopics, and recommendations. Return ONLY JSON.`;

        try {
            const text = await this.callGemini(prompt, 0.7);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            // Fallback
            return {
                overallSentiment: 'positive',
                sentimentScore: 75,
                sentimentBreakdown: [
                    { label: 'Positive', percentage: 75, color: '#22c55e' },
                    { label: 'Neutral', percentage: 20, color: '#6b7280' },
                    { label: 'Negative', percentage: 5, color: '#ef4444' }
                ],
                trends: ['Generally positive feedback', 'Users appreciate features'],
                keyTopics: ['User Experience', 'Features', 'Quality'],
                recommendations: ['Continue current strategy', 'Monitor feedback regularly']
            };
        }
    }

    // Chatbot Assistant
    async chatWithAssistant(message, conversationHistory = []) {
        const systemText = `You are a helpful AI assistant for a social media scheduler platform called "AI Scheduler". Help users with scheduling, AI features, analytics, and best practices. Be concise and actionable.`;

        const contents = [
            { role: 'user', parts: [{ text: systemText }]},
            ...conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: message }]} 
        ];

        try {
            const reply = await this.callGeminiWithContents(contents, 0.7);
            this.conversationHistory.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
            return reply;
        } catch (error) {
            console.error('Error in chat:', error);
            return "I'm here to help you with social media scheduling, content, and analytics. What would you like to do next?";
        }
    }

    // Optimal Posting Time Prediction
    async predictOptimalTimes(platform, industry, audience, timezone = 'Asia/Kolkata') {
        const prompt = `As a social media analytics expert, predict the optimal posting times for:\n\nPlatform: ${platform}\nIndustry: ${industry}\nTarget Audience: ${audience}\nTimezone: ${timezone}\n\nConsider platform behavior, industry trends, Indian audience habits, and day-of-week variations.\nReturn ONLY JSON with keys: optimalTimes (array of {day, time, reason, engagementScore}), generalTips (array).`;

        try {
            const text = await this.callGemini(prompt, 0.6);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error predicting optimal times:', error);
            // Fallback data
            return {
                optimalTimes: [
                    { day: 'Monday', time: '9:00 AM', reason: 'Work day start - high engagement', engagementScore: 85 },
                    { day: 'Tuesday', time: '1:00 PM', reason: 'Lunch break peak time', engagementScore: 78 },
                    { day: 'Wednesday', time: '7:00 PM', reason: 'Evening commute time', engagementScore: 82 },
                    { day: 'Thursday', time: '11:00 AM', reason: 'Mid-morning productivity break', engagementScore: 75 },
                    { day: 'Friday', time: '6:00 PM', reason: 'Weekend anticipation time', engagementScore: 88 },
                    { day: 'Saturday', time: '10:00 AM', reason: 'Weekend leisure browsing', engagementScore: 80 },
                    { day: 'Sunday', time: '8:00 PM', reason: 'Sunday evening wind-down', engagementScore: 83 }
                ],
                generalTips: [
                    'Post consistently during peak hours',
                    'Avoid early morning and late night posts',
                    'Friday evenings show highest engagement',
                    'Test different times for your specific audience'
                ]
            };
        }
    }

    // Trend Analysis
    async analyzeTrends(posts, industry) {
        const prompt = `Analyze these social media posts for trends and insights.\nPosts Data: ${JSON.stringify(posts)}\nIndustry: ${industry}\nReturn ONLY JSON with keys: topThemes, engagementInsights, hashtagPerformance, frequencyRecommendations, growthOpportunities.`;

        try {
            const text = await this.callGemini(prompt, 0.7);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error analyzing trends:', error);
            return {
                topThemes: ['Educational content', 'Behind-the-scenes', 'Customer stories'],
                engagementInsights: ['Video content performs 3x better', 'Morning posts get more likes'],
                hashtagPerformance: ['#entrepreneur shows high engagement', '#smallbusiness reaches target audience'],
                frequencyRecommendations: ['Post 3-4 times per week for optimal engagement'],
                growthOpportunities: ['Increase video content', 'Engage more with audience comments', 'Use trending hashtags']
            };
        }
    }

    // Content Ideas Generator
    async generateContentIdeas(businessType, industry, currentTrends = []) {
        const prompt = `Generate 10 creative content ideas for a ${businessType} in the ${industry} industry.\nCurrent trends: ${currentTrends.join(', ')}\nIdeas should be engaging, platform-agnostic, relevant to an Indian audience, and a mix of educational, entertaining, and promotional content.\nReturn ONLY JSON: ideas (array of {title, description, type, platforms, hashtags}).`;

        try {
            const text = await this.callGemini(prompt, 0.8);
            return JSON.parse(text);
        } catch (error) {
            console.error('Error generating content ideas:', error);
            return {
                ideas: [
                    {
                        title: "Behind the Scenes: A Day in Our Office",
                        description: "Show your team at work, the processes, and company culture",
                        type: "Educational",
                        platforms: ["Instagram", "LinkedIn", "Facebook"],
                        hashtags: ["#BehindTheScenes", "#TeamWork", "#CompanyCulture"]
                    },
                    {
                        title: "Customer Success Story Spotlight",
                        description: "Feature a customer's journey and success using your product/service",
                        type: "Promotional",
                        platforms: ["LinkedIn", "Facebook", "Twitter"],
                        hashtags: ["#CustomerSuccess", "#Testimonial", "#Success"]
                    }
                ]
            };
        }
    }
}

// Initialize Gemini AI instance
const geminiAI = new GeminiAI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAI;
} else {
    window.GeminiAI = GeminiAI;
    window.geminiAI = geminiAI;
}
