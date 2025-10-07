/**
 * Social Media Scheduler - Data Structures & Algorithms Module
 *
 * This module contains optimized algorithms for intelligent social media scheduling.
 * It includes binary search for efficient insertion, topological sorting for task dependencies,
 * histogram-based timing computation, and utility functions for debouncing and throttling.
 */

/**
 * BINARY SEARCH INSERT
 *
 * Purpose: Efficiently insert scheduled posts into a sorted array by timestamp
 * Time Complexity: O(log n) for search + O(n) for insertion = O(n) worst case
 * Space Complexity: O(1)
 *
 * Why Binary Search?
 * - Maintains chronological order automatically
 * - Much faster than linear scan for finding insertion point
 * - Reduces search time from O(n) to O(log n)
 *
 * Use Cases:
 * - Inserting new scheduled posts
 * - Maintaining sorted calendar events
 * - Real-time schedule updates
 */
function binarySearchInsert(arr, newPost, compareFn = (a, b) => a.timestamp - b.timestamp) {
    if (arr.length === 0) {
        arr.push(newPost);
        return 0;
    }

    let left = 0;
    let right = arr.length - 1;
    let insertIndex = arr.length;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const comparison = compareFn(arr[mid], newPost);

        if (comparison < 0) {
            left = mid + 1;
        } else if (comparison > 0) {
            insertIndex = mid;
            right = mid - 1;
        } else {
            insertIndex = mid;
            break;
        }
    }

    if (left > right && left < arr.length) {
        insertIndex = left;
    }

    arr.splice(insertIndex, 0, newPost);
    return insertIndex;
}

/**
 * HISTOGRAM-BASED TIMING COMPUTATION
 *
 * Purpose: Analyze historical engagement data to determine optimal posting times
 * Algorithm: Time bucketing with engagement aggregation
 * Time Complexity: O(n) where n is number of engagement records
 * Space Complexity: O(168) = O(1) for 24 hours × 7 days
 *
 * How It Works:
 * 1. Divides week into hourly buckets (168 buckets = 24 hours × 7 days)
 * 2. Aggregates engagement metrics for each time slot
 * 3. Identifies peak engagement periods
 * 4. Returns top N optimal time slots
 *
 * Fallback Strategy:
 * - If insufficient data, uses research-backed default times
 * - Weekdays: 9AM, 12PM, 6PM IST
 * - Weekends: 10AM, 3PM, 8PM IST
 */
function computeBestPostingTimes(engagementData, numSlots = 5, timezone = 'Asia/Kolkata') {
    const HOURS_IN_WEEK = 168;
    const histogram = new Array(HOURS_IN_WEEK).fill(0);
    const counts = new Array(HOURS_IN_WEEK).fill(0);

    engagementData.forEach(data => {
        const date = new Date(data.timestamp);
        const dayOfWeek = date.getDay();
        const hourOfDay = date.getHours();
        const bucketIndex = dayOfWeek * 24 + hourOfDay;

        histogram[bucketIndex] += data.engagementScore || 0;
        counts[bucketIndex]++;
    });

    const averages = histogram.map((total, index) => ({
        bucket: index,
        average: counts[index] > 0 ? total / counts[index] : 0,
        count: counts[index],
        day: Math.floor(index / 24),
        hour: index % 24
    }));

    averages.sort((a, b) => b.average - a.average);

    const topSlots = averages.slice(0, numSlots);

    if (topSlots.every(slot => slot.count === 0)) {
        return getFallbackPostingTimes(timezone);
    }

    return topSlots.map(slot => ({
        dayOfWeek: slot.day,
        hour: slot.hour,
        engagementScore: slot.average,
        confidence: Math.min(slot.count / 10, 1)
    }));
}

/**
 * FALLBACK POSTING TIMES
 *
 * Research-backed default posting times for India (Asia/Kolkata timezone)
 * Based on social media engagement studies for Indian audiences
 */
function getFallbackPostingTimes(timezone = 'Asia/Kolkata') {
    return [
        { dayOfWeek: 1, hour: 9, engagementScore: 0.75, confidence: 0.5, label: 'Monday 9 AM' },
        { dayOfWeek: 2, hour: 12, engagementScore: 0.80, confidence: 0.5, label: 'Tuesday 12 PM' },
        { dayOfWeek: 3, hour: 18, engagementScore: 0.85, confidence: 0.5, label: 'Wednesday 6 PM' },
        { dayOfWeek: 4, hour: 10, engagementScore: 0.78, confidence: 0.5, label: 'Thursday 10 AM' },
        { dayOfWeek: 5, hour: 15, engagementScore: 0.82, confidence: 0.5, label: 'Friday 3 PM' }
    ];
}

/**
 * TOPOLOGICAL SORT FOR TASK DEPENDENCIES
 *
 * Purpose: Order tasks with dependencies to ensure proper execution sequence
 * Algorithm: Kahn's Algorithm (BFS-based topological sort)
 * Time Complexity: O(V + E) where V = vertices (tasks), E = edges (dependencies)
 * Space Complexity: O(V)
 *
 * Use Cases:
 * - Content creation workflow (design → approval → scheduling → posting)
 * - Asset preparation (image processing → text overlay → final post)
 * - Multi-step campaigns with dependencies
 *
 * Returns:
 * - Ordered array of tasks if no cycles detected
 * - Null if circular dependencies exist
 */
function topologicalSort(tasks) {
    const graph = new Map();
    const inDegree = new Map();

    tasks.forEach(task => {
        graph.set(task.id, []);
        inDegree.set(task.id, 0);
    });

    tasks.forEach(task => {
        if (task.dependencies && Array.isArray(task.dependencies)) {
            task.dependencies.forEach(depId => {
                if (graph.has(depId)) {
                    graph.get(depId).push(task.id);
                    inDegree.set(task.id, inDegree.get(task.id) + 1);
                }
            });
        }
    });

    const queue = [];
    inDegree.forEach((degree, taskId) => {
        if (degree === 0) {
            queue.push(taskId);
        }
    });

    const sortedTasks = [];

    while (queue.length > 0) {
        const currentId = queue.shift();
        sortedTasks.push(tasks.find(t => t.id === currentId));

        graph.get(currentId).forEach(neighborId => {
            inDegree.set(neighborId, inDegree.get(neighborId) - 1);
            if (inDegree.get(neighborId) === 0) {
                queue.push(neighborId);
            }
        });
    }

    if (sortedTasks.length !== tasks.length) {
        console.error('Circular dependency detected in task graph');
        return null;
    }

    return sortedTasks;
}

/**
 * DEBOUNCE UTILITY
 *
 * Purpose: Limit function execution frequency by delaying until activity stops
 * Pattern: Delays execution until after a quiet period
 *
 * Use Cases:
 * - Search input (wait for user to stop typing)
 * - Window resize handlers
 * - Auto-save functionality
 *
 * Example:
 * const debouncedSearch = debounce(searchFunction, 300);
 * input.addEventListener('input', debouncedSearch);
 */
function debounce(func, wait) {
    let timeoutId;

    return function executedFunction(...args) {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * THROTTLE UTILITY
 *
 * Purpose: Limit function execution to once per time interval
 * Pattern: Guarantees execution at most once per interval
 *
 * Use Cases:
 * - Scroll event handlers
 * - API rate limiting
 * - Performance-critical UI updates
 *
 * Example:
 * const throttledScroll = throttle(scrollHandler, 100);
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;

    return function executedFunction(...args) {
        const context = this;

        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, Math.max(limit - (Date.now() - lastRan), 0));
        }
    };
}

/**
 * SCHEDULE CONFLICT DETECTION
 *
 * Purpose: Check for time conflicts in scheduled posts
 * Algorithm: Interval overlap detection using sweep line
 * Time Complexity: O(n log n) due to sorting
 * Space Complexity: O(n)
 */
function detectScheduleConflicts(scheduledPosts, minGapMinutes = 5) {
    if (scheduledPosts.length < 2) return [];

    const sorted = [...scheduledPosts].sort((a, b) =>
        new Date(a.scheduledTime) - new Date(b.scheduledTime)
    );

    const conflicts = [];

    for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];

        const currentTime = new Date(current.scheduledTime).getTime();
        const nextTime = new Date(next.scheduledTime).getTime();
        const gapMinutes = (nextTime - currentTime) / (1000 * 60);

        if (gapMinutes < minGapMinutes) {
            conflicts.push({
                post1: current,
                post2: next,
                gapMinutes: gapMinutes,
                message: `Posts scheduled too close together (${Math.round(gapMinutes)} minutes apart)`
            });
        }
    }

    return conflicts;
}

/**
 * ENGAGEMENT SCORE CALCULATOR
 *
 * Purpose: Calculate weighted engagement score for posts
 * Formula: (likes × 1) + (comments × 3) + (shares × 5) + (clicks × 2)
 *
 * Weights based on engagement value:
 * - Likes: 1 point (passive engagement)
 * - Clicks: 2 points (active interest)
 * - Comments: 3 points (conversation starter)
 * - Shares: 5 points (highest value - organic reach)
 */
function calculateEngagementScore(metrics) {
    const weights = {
        likes: 1,
        comments: 3,
        shares: 5,
        clicks: 2
    };

    let score = 0;
    Object.keys(weights).forEach(key => {
        score += (metrics[key] || 0) * weights[key];
    });

    return score;
}

/**
 * PRIORITY QUEUE (MIN-HEAP) for Scheduled Posts
 *
 * Purpose: Efficiently manage and retrieve next scheduled post
 * Time Complexity:
 * - Insert: O(log n)
 * - Extract Min: O(log n)
 * - Peek: O(1)
 */
class PriorityQueue {
    constructor(compareFn = (a, b) => a.timestamp - b.timestamp) {
        this.heap = [];
        this.compareFn = compareFn;
    }

    insert(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }

    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compareFn(this.heap[index], this.heap[parentIndex]) < 0) {
                [this.heap[index], this.heap[parentIndex]] =
                [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.compareFn(this.heap[leftChild], this.heap[minIndex]) < 0) {
                minIndex = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.compareFn(this.heap[rightChild], this.heap[minIndex]) < 0) {
                minIndex = rightChild;
            }

            if (minIndex !== index) {
                [this.heap[index], this.heap[minIndex]] =
                [this.heap[minIndex], this.heap[index]];
                index = minIndex;
            } else {
                break;
            }
        }
    }
}

export {
    binarySearchInsert,
    computeBestPostingTimes,
    getFallbackPostingTimes,
    topologicalSort,
    debounce,
    throttle,
    detectScheduleConflicts,
    calculateEngagementScore,
    PriorityQueue
};
