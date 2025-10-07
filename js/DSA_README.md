# Scheduling Intelligence - Data Structures & Algorithms

## Overview

This module provides optimized algorithms for intelligent social media content scheduling. It implements industry-standard data structures and algorithms to solve common scheduling challenges efficiently.

---

## Table of Contents

1. [Binary Search Insert](#binary-search-insert)
2. [Histogram-Based Timing](#histogram-based-timing-computation)
3. [Topological Sort](#topological-sort-for-task-dependencies)
4. [Priority Queue](#priority-queue-min-heap)
5. [Utility Functions](#utility-functions)
6. [Real-World Applications](#real-world-applications)
7. [Performance Considerations](#performance-considerations)

---

## Binary Search Insert

### What It Does

Maintains a chronologically sorted array of scheduled posts by efficiently finding the correct insertion position using binary search.

### Algorithm Explanation

1. **Empty Array Check**: If array is empty, insert at position 0
2. **Binary Search**: Divide array in half repeatedly to find insertion point
3. **Comparison**: Compare timestamps to decide which half to search
4. **Insertion**: Insert at found position using splice()

### Time Complexity

- **Search**: O(log n) - Binary search through sorted array
- **Insertion**: O(n) - Shifting elements (JavaScript splice)
- **Overall**: O(n) dominated by insertion, but search is optimized

### Space Complexity

- **O(1)** - Only uses a few variables, no additional data structures

### Why This Algorithm?

**Alternatives Considered:**

| Algorithm | Search Time | Insert Time | When to Use |
|-----------|-------------|-------------|-------------|
| Linear Search | O(n) | O(n) | Very small arrays (<10 items) |
| Binary Search | O(log n) | O(n) | Medium arrays (10-10,000 items) |
| Balanced Tree | O(log n) | O(log n) | Large arrays (>10,000 items) |

**Our Choice**: Binary Search is optimal for typical scheduling scenarios (10-1000 posts) where:
- Search speed matters for finding insertion point
- JavaScript's splice() handles insertion efficiently for moderate sizes
- Implementation is simple and maintainable

### Code Example

```javascript
import { binarySearchInsert } from './dsa.js';

const scheduledPosts = [
    { id: 1, timestamp: 1609459200000, content: 'Post 1' },
    { id: 2, timestamp: 1609545600000, content: 'Post 2' }
];

const newPost = { id: 3, timestamp: 1609502400000, content: 'New Post' };

const insertIndex = binarySearchInsert(scheduledPosts, newPost);
console.log(`Inserted at index: ${insertIndex}`);
```

### When to Use

- Maintaining sorted schedule of posts
- Calendar event insertion
- Real-time schedule updates
- Any scenario requiring sorted chronological data

### Limitations

- Not efficient for very large datasets (>10,000 items)
- JavaScript splice() can be slow for very large arrays
- Consider using a balanced tree (Red-Black Tree) for >10,000 items

---

## Histogram-Based Timing Computation

### What It Does

Analyzes historical engagement data to identify optimal posting times by creating a histogram of engagement across all hours of the week.

### Algorithm Explanation

1. **Time Bucketing**: Divide week into 168 hourly buckets (24 hours × 7 days)
2. **Data Aggregation**: Sum engagement scores for each time slot
3. **Average Calculation**: Calculate average engagement per bucket
4. **Ranking**: Sort buckets by average engagement
5. **Top Selection**: Return top N time slots with highest engagement

### Visual Representation

```
Histogram Example (engagement scores by hour):
Hour  | Mon | Tue | Wed | Thu | Fri | Sat | Sun
------|-----|-----|-----|-----|-----|-----|-----
00:00 |  20 |  15 |  18 |  22 |  25 |  30 |  28
01:00 |  10 |  12 |   9 |  11 |  15 |  20 |  18
...
09:00 |  85 |  90 |  88 |  92 |  80 |  60 |  55  ← High engagement!
12:00 |  95 |  88 |  90 |  87 |  92 |  70 |  65  ← Peak time!
...
```

### Time Complexity

- **O(n)** where n is number of engagement records
- Single pass through data for aggregation
- Sorting is O(168 log 168) = O(1) since bucket count is constant

### Space Complexity

- **O(168) = O(1)** - Fixed size histogram (24 hours × 7 days)
- Constant space regardless of input size

### Why This Algorithm?

**Alternatives Considered:**

| Approach | Accuracy | Speed | Memory |
|----------|----------|-------|--------|
| Simple Average | Low | Fast | Low |
| Histogram (Ours) | High | Fast | Low |
| Machine Learning | Highest | Slow | High |
| Moving Average | Medium | Medium | Medium |

**Our Choice**: Histogram strikes the best balance:
- Fast computation (single pass)
- Accurate results for typical usage
- Low memory footprint
- Easy to understand and debug

### Fallback Strategy

When insufficient data is available, the system uses research-backed default times for Indian audiences:

**Weekdays (Mon-Fri):**
- 9:00 AM - Morning commute
- 12:00 PM - Lunch break
- 6:00 PM - Evening commute

**Weekends (Sat-Sun):**
- 10:00 AM - Late morning
- 3:00 PM - Afternoon
- 8:00 PM - Evening

### Code Example

```javascript
import { computeBestPostingTimes } from './dsa.js';

const engagementData = [
    { timestamp: '2025-01-13T09:00:00Z', engagementScore: 85 },
    { timestamp: '2025-01-13T12:00:00Z', engagementScore: 95 },
    { timestamp: '2025-01-13T18:00:00Z', engagementScore: 88 }
];

const bestTimes = computeBestPostingTimes(engagementData, 5);
console.log('Best posting times:', bestTimes);
```

### When to Use

- Determining optimal posting schedule
- A/B testing different time slots
- Personalizing schedules per audience
- Quarterly schedule optimization

### Limitations

- Requires sufficient historical data (minimum 50-100 posts)
- Doesn't account for trending topics or viral events
- Past performance doesn't guarantee future results
- Timezone-dependent (configured for Asia/Kolkata)

---

## Topological Sort for Task Dependencies

### What It Does

Orders tasks with dependencies to ensure each task executes only after its prerequisites are complete. Detects circular dependencies.

### Algorithm: Kahn's Algorithm (BFS-based)

1. **Build Graph**: Create adjacency list of task dependencies
2. **Calculate In-Degree**: Count incoming edges for each task
3. **Find Starting Points**: Identify tasks with no dependencies (in-degree = 0)
4. **Process Queue**:
   - Remove task with no dependencies
   - Add to sorted output
   - Decrease in-degree of dependent tasks
   - Add newly freed tasks to queue
5. **Cycle Detection**: If output length ≠ input length, cycle exists

### Visual Example

```
Content Creation Workflow:

Write Content → Review → Approval → Design → Schedule → Publish
      ↓           ↓         ↓         ↓         ↓          ↓
   (Task 1)   (Task 2)  (Task 3)  (Task 4)  (Task 5)  (Task 6)

Dependency Graph:
Task 2 depends on Task 1
Task 3 depends on Task 2
Task 4 depends on Task 1
Task 5 depends on Task 3 AND Task 4
Task 6 depends on Task 5

Topological Order: [1, 2, 4, 3, 5, 6]
```

### Time Complexity

- **O(V + E)** where V = tasks, E = dependencies
- Each task processed once: O(V)
- Each dependency examined once: O(E)
- Optimal for dependency resolution

### Space Complexity

- **O(V + E)** for graph representation
- O(V) for queue and in-degree map

### Why This Algorithm?

**Alternatives Considered:**

| Algorithm | Time | Space | Cycle Detection |
|-----------|------|-------|-----------------|
| DFS-based | O(V+E) | O(V+E) | Yes |
| Kahn's (BFS) | O(V+E) | O(V+E) | Yes |
| Naive | O(V²) | O(V) | No |

**Our Choice**: Kahn's algorithm because:
- Same efficiency as DFS-based approach
- More intuitive (level-by-level processing)
- Natural cycle detection
- Queue-based = easier to understand

### Code Example

```javascript
import { topologicalSort } from './dsa.js';

const tasks = [
    { id: 1, name: 'Write Content', dependencies: [] },
    { id: 2, name: 'Review', dependencies: [1] },
    { id: 3, name: 'Design Graphics', dependencies: [1] },
    { id: 4, name: 'Final Approval', dependencies: [2, 3] },
    { id: 5, name: 'Schedule Post', dependencies: [4] }
];

const sortedTasks = topologicalSort(tasks);

if (sortedTasks) {
    console.log('Execution order:', sortedTasks.map(t => t.name));
} else {
    console.error('Circular dependency detected!');
}
```

### When to Use

- Content creation workflows
- Multi-step approval processes
- Asset preparation pipelines
- Campaign scheduling with prerequisites

### Limitations

- Cannot handle circular dependencies (returns null)
- All dependencies must be known upfront
- Doesn't optimize for parallelization
- Single execution order (may have multiple valid orders)

---

## Priority Queue (Min-Heap)

### What It Does

Efficiently manages scheduled posts as a min-heap, allowing fast retrieval of the next post to be published.

### Algorithm: Binary Heap

1. **Insert**: Add item at end, bubble up to maintain heap property
2. **Extract Min**: Remove root (minimum), replace with last item, bubble down
3. **Peek**: Return root without removing (O(1))

### Heap Property

```
Min-Heap Structure:
         10:00 AM (root)
        /          \
    12:00 PM     11:00 AM
    /     \       /     \
 2:00 PM 1:00 PM 3:00 PM 4:00 PM

Property: Parent ≤ Children
```

### Time Complexity

| Operation | Complexity | Explanation |
|-----------|------------|-------------|
| Insert | O(log n) | Bubble up through tree height |
| Extract Min | O(log n) | Bubble down through tree height |
| Peek | O(1) | Just read root |
| Build Heap | O(n) | Heapify from bottom up |

### Space Complexity

- **O(n)** where n is number of scheduled posts

### Why This Data Structure?

**Alternatives Considered:**

| Structure | Insert | Get Min | Extract Min |
|-----------|--------|---------|-------------|
| Unsorted Array | O(1) | O(n) | O(n) |
| Sorted Array | O(n) | O(1) | O(1)* |
| Binary Heap | O(log n) | O(1) | O(log n) |
| Balanced BST | O(log n) | O(log n) | O(log n) |

*Sorted array extract requires shifting elements

**Our Choice**: Binary Heap because:
- Balanced performance for all operations
- O(1) peek for checking next post
- Efficient inserts when adding new posts
- Simple array-based implementation

### Code Example

```javascript
import { PriorityQueue } from './dsa.js';

const postQueue = new PriorityQueue((a, b) =>
    new Date(a.scheduledTime) - new Date(b.scheduledTime)
);

postQueue.insert({ id: 1, scheduledTime: '2025-01-15T12:00:00Z', content: 'Post 1' });
postQueue.insert({ id: 2, scheduledTime: '2025-01-15T09:00:00Z', content: 'Post 2' });
postQueue.insert({ id: 3, scheduledTime: '2025-01-15T15:00:00Z', content: 'Post 3' });

console.log('Next post to publish:', postQueue.peek());

while (postQueue.size() > 0) {
    const nextPost = postQueue.extractMin();
    console.log('Publishing:', nextPost.content);
}
```

### When to Use

- Managing scheduled posts queue
- Real-time publish scheduling
- Priority-based task execution
- Event scheduling systems

### Limitations

- Does not maintain insertion order for equal priorities
- Random access to middle elements is O(n)
- Cannot efficiently remove arbitrary elements
- Parent-child relationships are implicit (not pointer-based)

---

## Utility Functions

### Debounce

**Purpose**: Delays function execution until activity stops

```javascript
import { debounce } from './dsa.js';

const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

**Use Cases**:
- Search input (wait for user to finish typing)
- Auto-save (save after user stops editing)
- Window resize handlers

### Throttle

**Purpose**: Limits function execution to once per time interval

```javascript
import { throttle } from './dsa.js';

const throttledScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);
```

**Use Cases**:
- Scroll event handlers
- API rate limiting
- Performance-critical UI updates

---

## Real-World Applications

### 1. Smart Scheduling

```javascript
import { computeBestPostingTimes, binarySearchInsert } from './dsa.js';

// Analyze engagement history
const engagementHistory = getUserEngagementData();
const bestTimes = computeBestPostingTimes(engagementHistory, 5);

// Schedule new post at optimal time
const newPost = createPost(content);
const optimalTime = bestTimes[0];
newPost.scheduledTime = getNextDateTime(optimalTime);

// Insert into schedule
binarySearchInsert(scheduleArray, newPost);
```

### 2. Content Pipeline

```javascript
import { topologicalSort } from './dsa.js';

// Define content workflow
const workflow = [
    { id: 'write', name: 'Write Content', dependencies: [] },
    { id: 'images', name: 'Create Images', dependencies: ['write'] },
    { id: 'review', name: 'Review', dependencies: ['write', 'images'] },
    { id: 'approve', name: 'Approve', dependencies: ['review'] },
    { id: 'schedule', name: 'Schedule', dependencies: ['approve'] }
];

// Get execution order
const executionOrder = topologicalSort(workflow);
executionOrder.forEach(task => executeTask(task));
```

### 3. Publish Queue Management

```javascript
import { PriorityQueue } from './dsa.js';

// Create publishing queue
const publishQueue = new PriorityQueue();

// Add scheduled posts
scheduledPosts.forEach(post => publishQueue.insert(post));

// Publish posts as their time comes
setInterval(() => {
    const nextPost = publishQueue.peek();
    if (nextPost && isTimeToPublish(nextPost)) {
        const post = publishQueue.extractMin();
        publishToSocialMedia(post);
    }
}, 60000); // Check every minute
```

---

## Performance Considerations

### Memory Usage

| Feature | Memory | Notes |
|---------|--------|-------|
| Binary Search | O(1) | In-place algorithm |
| Histogram | O(1) | Fixed 168 buckets |
| Topological Sort | O(V+E) | Scales with tasks |
| Priority Queue | O(n) | Grows with posts |

### Optimization Tips

1. **Batch Operations**: Insert multiple posts together to minimize rebalancing
2. **Lazy Evaluation**: Compute best times only when needed
3. **Caching**: Store histogram results for frequently accessed time ranges
4. **Pagination**: Load scheduled posts in chunks, not all at once

### Scaling Considerations

| Posts Count | Recommendation |
|-------------|----------------|
| < 100 | All algorithms work efficiently |
| 100 - 1,000 | Current implementation optimal |
| 1,000 - 10,000 | Consider indexing and caching |
| > 10,000 | Move to database-backed solutions |

---

## Learning Resources

### Binary Search
- [Khan Academy - Binary Search](https://www.khanacademy.org/computing/computer-science/algorithms/binary-search)
- [VisuAlgo - Binary Search Visualization](https://visualgo.net/en/bst)

### Topological Sort
- [GeeksforGeeks - Topological Sorting](https://www.geeksforgeeks.org/topological-sorting/)
- [USFCA Visualization](https://www.cs.usfca.edu/~galles/visualization/TopoSortDFS.html)

### Priority Queues & Heaps
- [CS Dojo - Heap Implementation](https://www.youtube.com/watch?v=t0Cq6tVNRBA)
- [VisuAlgo - Heap Visualization](https://visualgo.net/en/heap)

### Time Complexity Analysis
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- [MIT OpenCourseWare - Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)

---

## Contributing

To add new algorithms:

1. Implement in `dsa.js`
2. Add comprehensive documentation here
3. Include time/space complexity analysis
4. Provide code examples
5. Explain when to use vs alternatives

---

## Questions?

If you have questions about these algorithms or need help implementing custom scheduling logic, please open an issue in the repository.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintainer**: Scheduler Team
