export type TicketColumn = "backlog" | "in-progress" | "done";

export type Ticket = {
  slug: string;
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  column: TicketColumn;
  hours: number;
};

export const TICKETS: Ticket[] = 
[
  {
    "slug": "dsa-01-repeated-dns-sequence",
    "id": "dsa-01",
    "title": "Repeated Dns Sequence",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 5.3
  },
  {
    "slug": "dsa-02-find-maximum-in-a-sliding-window",
    "id": "dsa-02",
    "title": "Find Maximum In A Sliding Window",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.5
  },
  {
    "slug": "dsa-3-longest-repeating-character-replacement",
    "id": "dsa-3",
    "title": "Longest Repeating Character Replacement",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.8
  },
  {
    "slug": "dsa-04-minimum-window-substring",
    "id": "dsa-04",
    "title": "Minimum Window Substring",
    "topic": "Algorithms",
    "difficulty": "Hard" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.8
  },
  {
    "slug": "dsa-05-longest-substring-without-repeating-characters",
    "id": "dsa-05",
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.9
  },
  {
    "slug": "dsa-06-minimum-size-subarray-sum",
    "id": "dsa-06",
    "title": "Minimum Size Subarray Sum",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.0
  },
  {
    "slug": "dsa-07-best-time-to-buy-and-sell-stock",
    "id": "dsa-07",
    "title": "Best Time To Buy And Sell Stock",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.1
  },
  {
    "slug": "dsa-08-minimum-window-subsequence",
    "id": "dsa-08",
    "title": "Minimum Window Subsequence",
    "topic": "Algorithms",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 3.4
  },
  {
    "slug": "dsa-09-valid-palindrome",
    "id": "dsa-09",
    "title": "Valid Palindrome",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.7
  },
  {
    "slug": "dsa-10-sum-of-three-values",
    "id": "dsa-10",
    "title": "Sum Of Three Values",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.8
  },
  {
    "slug": "dsa-11-remove-nth-node-from-end-of-list",
    "id": "dsa-11",
    "title": "Remove Nth Node From End Of List",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.8
  },
  {
    "slug": "dsa-12-sort-colors",
    "id": "dsa-12",
    "title": "Sort Colors",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 0.7
  },
  {
    "slug": "dsa-14-reverse-words-in-a-string",
    "id": "dsa-14",
    "title": "Reverse Words In A String",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.1
  },
  {
    "slug": "dsa-15-valid-palindrome-ii",
    "id": "dsa-15",
    "title": "Valid Palindrome Ii",
    "topic": "Algorithms",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 2.2
  },
  {
    "slug": "dsa-backtracking-01-n-queens",
    "id": "dsa-backtracking-01",
    "title": "N Queens",
    "topic": "Backtracking",
    "difficulty": "Hard" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 5.2
  },
  {
    "slug": "dsa-backtracking-02-word-search",
    "id": "dsa-backtracking-02",
    "title": "Word Search",
    "topic": "Backtracking",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.8
  },
  {
    "slug": "dsa-backtracking-03-house-robber-iii",
    "id": "dsa-backtracking-03",
    "title": "House Robber Iii",
    "topic": "Backtracking",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.2
  },
  {
    "slug": "dsa-backtracking-04-restore-ip-addresses",
    "id": "dsa-backtracking-04",
    "title": "Restore Ip Addresses",
    "topic": "Backtracking",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 4.3
  },
  {
    "slug": "dsa-backtracking-05-flood-fill",
    "id": "dsa-backtracking-05",
    "title": "Flood Fill",
    "topic": "Backtracking",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.8
  },
  {
    "slug": "dsa-backtracking-06-sudoku-solver",
    "id": "dsa-backtracking-06",
    "title": "Sudoku Solver",
    "topic": "Backtracking",
    "difficulty": "Hard" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.3
  },
  {
    "slug": "dsa-backtracking-07-matchsticks-to-square",
    "id": "dsa-backtracking-07",
    "title": "Matchsticks To Square",
    "topic": "Backtracking",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 2.3
  },
  {
    "slug": "dsa-binary-search-01-binary-search-introduction",
    "id": "dsa-binary-search-01",
    "title": "Binary Search Introduction",
    "topic": "Binary Search",
    "difficulty": "Easy" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.0
  },
  {
    "slug": "dsa-binary-search-02-search-in-rotated-sorted-array",
    "id": "dsa-binary-search-02",
    "title": "Search In Rotated Sorted Array",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.6
  },
  {
    "slug": "dsa-binary-search-03-first-bad-version",
    "id": "dsa-binary-search-03",
    "title": "First Bad Version",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.9
  },
  {
    "slug": "dsa-binary-search-04-find-peak",
    "id": "dsa-binary-search-04",
    "title": "Find Peak",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 5.1
  },
  {
    "slug": "dsa-binary-search-05-single-element-in-a-sorted-array",
    "id": "dsa-binary-search-05",
    "title": "Single Element In A Sorted Array",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.6
  },
  {
    "slug": "dsa-binary-search-06-random-pick-with-weight",
    "id": "dsa-binary-search-06",
    "title": "Random Pick With Weight",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 0.5
  },
  {
    "slug": "dsa-binary-search-07-find-k-closest-elements",
    "id": "dsa-binary-search-07",
    "title": "Find K Closest Elements",
    "topic": "Binary Search",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.6
  },
  {
    "slug": "dsa-dynamic-programming-01-dynamic-programming-introduction",
    "id": "dsa-dynamic-programming-01",
    "title": "Dynamic Programming Introduction",
    "topic": "Dynamic Programming",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.3
  },
  {
    "slug": "dsa-dynamic-programming-02-climbing-stairs",
    "id": "dsa-dynamic-programming-02",
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.7
  },
  {
    "slug": "dsa-dynamic-programming-03-frog-jump",
    "id": "dsa-dynamic-programming-03",
    "title": "Frog Jump",
    "topic": "Dynamic Programming",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.2
  },
  {
    "slug": "dsa-fast-and-slow-pointer-01-happy-numbers",
    "id": "dsa-fast-and-slow-pointer-01",
    "title": "Happy Numbers",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-fast-and-slow-pointer-02-linked-list-cycle",
    "id": "dsa-fast-and-slow-pointer-02",
    "title": "Linked List Cycle",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.7
  },
  {
    "slug": "dsa-fast-and-slow-pointer-03-middle-of-the-linked-list",
    "id": "dsa-fast-and-slow-pointer-03",
    "title": "Middle Of The Linked List",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.5
  },
  {
    "slug": "dsa-fast-and-slow-pointer-04-circular-array-loop",
    "id": "dsa-fast-and-slow-pointer-04",
    "title": "Circular Array Loop",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 5.3
  },
  {
    "slug": "dsa-fast-and-slow-pointer-05-find-the-duplicate-number",
    "id": "dsa-fast-and-slow-pointer-05",
    "title": "Find The Duplicate Number",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.5
  },
  {
    "slug": "dsa-fast-and-slow-pointer-06-palindrome-linked-list",
    "id": "dsa-fast-and-slow-pointer-06",
    "title": "Palindrome Linked List",
    "topic": "Fast And Slow Pointer",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.3
  },
  {
    "slug": "dsa-greedy-technique-01-jump-game",
    "id": "dsa-greedy-technique-01",
    "title": "Jump Game",
    "topic": "Greedy Technique",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.3
  },
  {
    "slug": "dsa-greedy-technique-02-boats-to-save-people",
    "id": "dsa-greedy-technique-02",
    "title": "Boats To Save People",
    "topic": "Greedy Technique",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 4.3
  },
  {
    "slug": "dsa-greedy-technique-03-gas-station",
    "id": "dsa-greedy-technique-03",
    "title": "Gas Station",
    "topic": "Greedy Technique",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 2.2
  },
  {
    "slug": "dsa-greedy-technique-04-two-city-scheduling",
    "id": "dsa-greedy-technique-04",
    "title": "Two City Scheduling",
    "topic": "Greedy Technique",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-greedy-technique-05-minimum-number-of-refueling-stops",
    "id": "dsa-greedy-technique-05",
    "title": "Minimum Number Of Refueling Stops",
    "topic": "Greedy Technique",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 4.4
  },
  {
    "slug": "dsa-greedy-technique-06-jump-game-ii",
    "id": "dsa-greedy-technique-06",
    "title": "Jump Game Ii",
    "topic": "Greedy Technique",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 1.3
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-01-reverse-linked-list",
    "id": "dsa-in-place-reversal-linkedlist-01",
    "title": "Reverse Linked List",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-02-reverse-nodes-in-k-group",
    "id": "dsa-in-place-reversal-linkedlist-02",
    "title": "Reverse Nodes In K Group",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.5
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-03-reverse-linked-list-ii",
    "id": "dsa-in-place-reversal-linkedlist-03",
    "title": "Reverse Linked List Ii",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.0
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-04-reorder-list-ii",
    "id": "dsa-in-place-reversal-linkedlist-04",
    "title": "Reorder List Ii",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 2.3
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-05-swapping-nodes-in-a-linked-list",
    "id": "dsa-in-place-reversal-linkedlist-05",
    "title": "Swapping Nodes In A Linked List",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.7
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-06-reverse-nodes-in-even-length-groups",
    "id": "dsa-in-place-reversal-linkedlist-06",
    "title": "Reverse Nodes In Even Length Groups",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.3
  },
  {
    "slug": "dsa-in-place-reversal-linkedlist-07-swap-nodes-in-pair",
    "id": "dsa-in-place-reversal-linkedlist-07",
    "title": "Swap Nodes In Pair",
    "topic": "In Place Reversal Linkedlist",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.6
  },
  {
    "slug": "dsa-k-way-merge-01-merge-sorted-arrays",
    "id": "dsa-k-way-merge-01",
    "title": "Merge Sorted Arrays",
    "topic": "K Way Merge",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.1
  },
  {
    "slug": "dsa-k-way-merge-02-kth-smallest-number-in-m-sorted-lists",
    "id": "dsa-k-way-merge-02",
    "title": "Kth Smallest Number In M Sorted Lists",
    "topic": "K Way Merge",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.6
  },
  {
    "slug": "dsa-k-way-merge-03-find-k-pairs-with-smallest-sums",
    "id": "dsa-k-way-merge-03",
    "title": "Find K Pairs With Smallest Sums",
    "topic": "K Way Merge",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.1
  },
  {
    "slug": "dsa-k-way-merge-04-merge-k-sorted-lists",
    "id": "dsa-k-way-merge-04",
    "title": "Merge K Sorted Lists",
    "topic": "K Way Merge",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.5
  },
  {
    "slug": "dsa-k-way-merge-05-kth-smallest-element-in-a-sorted-matrix",
    "id": "dsa-k-way-merge-05",
    "title": "Kth Smallest Element In A Sorted Matrix",
    "topic": "K Way Merge",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.5
  },
  {
    "slug": "dsa-merge-intervel-01-merge-intervals",
    "id": "dsa-merge-intervel-01",
    "title": "Merge Intervals",
    "topic": "Merge Intervel",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.2
  },
  {
    "slug": "dsa-merge-intervel-02-insert-interval",
    "id": "dsa-merge-intervel-02",
    "title": "Insert Interval",
    "topic": "Merge Intervel",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.6
  },
  {
    "slug": "dsa-merge-intervel-03-interval-list-intersections",
    "id": "dsa-merge-intervel-03",
    "title": "Interval List Intersections",
    "topic": "Merge Intervel",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 2.2
  },
  {
    "slug": "dsa-merge-intervel-04-employee-free-time",
    "id": "dsa-merge-intervel-04",
    "title": "Employee Free Time",
    "topic": "Merge Intervel",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 2.4
  },
  {
    "slug": "dsa-merge-intervel-05-task-scheduler",
    "id": "dsa-merge-intervel-05",
    "title": "Task Scheduler",
    "topic": "Merge Intervel",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-merge-intervel-06-meeting-rooms-ii",
    "id": "dsa-merge-intervel-06",
    "title": "Meeting Rooms Ii",
    "topic": "Merge Intervel",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.1
  },
  {
    "slug": "dsa-sliding-window-01-permutation-in-string",
    "id": "dsa-sliding-window-01",
    "title": "Permutation In String",
    "topic": "Sliding Window",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.8
  },
  {
    "slug": "dsa-sliding-window-02-fruit-into-baskets",
    "id": "dsa-sliding-window-02",
    "title": "Fruit Into Baskets",
    "topic": "Sliding Window",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.6
  },
  {
    "slug": "dsa-subsets-01-subsets",
    "id": "dsa-subsets-01",
    "title": "Subsets",
    "topic": "Subsets",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.0
  },
  {
    "slug": "dsa-subsets-02-permutation",
    "id": "dsa-subsets-02",
    "title": "Permutation",
    "topic": "Subsets",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.8
  },
  {
    "slug": "dsa-subsets-03-letter-combinations-of-a-phone-number",
    "id": "dsa-subsets-03",
    "title": "Letter Combinations Of A Phone Number",
    "topic": "Subsets",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 3.4
  },
  {
    "slug": "dsa-subsets-04-generate-parentheses",
    "id": "dsa-subsets-04",
    "title": "Generate Parentheses",
    "topic": "Subsets",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.1
  },
  {
    "slug": "dsa-subsets-05-find-k-sum-subsets",
    "id": "dsa-subsets-05",
    "title": "Find K Sum Subsets",
    "topic": "Subsets",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.7
  },
  {
    "slug": "dsa-top-k-elements-01-kth-largest-element-in-an-array",
    "id": "dsa-top-k-elements-01",
    "title": "Kth Largest Element In An Array",
    "topic": "Top K Elements",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-top-k-elements-02-kth-largest-element-in-a-stream",
    "id": "dsa-top-k-elements-02",
    "title": "Kth Largest Element In A Stream",
    "topic": "Top K Elements",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.9
  },
  {
    "slug": "dsa-top-k-elements-03-reorganize-string",
    "id": "dsa-top-k-elements-03",
    "title": "Reorganize String",
    "topic": "Top K Elements",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 1.5
  },
  {
    "slug": "dsa-top-k-elements-04-k-closest-points-to-origin",
    "id": "dsa-top-k-elements-04",
    "title": "K Closest Points To Origin",
    "topic": "Top K Elements",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.7
  },
  {
    "slug": "dsa-top-k-elements-05-top-k-frequent-words",
    "id": "dsa-top-k-elements-05",
    "title": "Top K Frequent Words",
    "topic": "Top K Elements",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 2.4
  },
  {
    "slug": "dsa-two-heap-01-heap-introduction",
    "id": "dsa-two-heap-01",
    "title": "Heap Introduction",
    "topic": "Two Heap",
    "difficulty": "Easy" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.5
  },
  {
    "slug": "dsa-two-heap-02-maximize-capital",
    "id": "dsa-two-heap-02",
    "title": "Maximize Capital",
    "topic": "Two Heap",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 4.4
  },
  {
    "slug": "dsa-two-heap-03-largest-number-after-digit-swaps-by-parity",
    "id": "dsa-two-heap-03",
    "title": "Largest Number After Digit Swaps By Parity",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.6
  },
  {
    "slug": "dsa-two-heap-04-longest-happy-string",
    "id": "dsa-two-heap-04",
    "title": "Longest Happy String",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 4.0
  },
  {
    "slug": "dsa-two-heap-05-find-median-from-a-data-stream",
    "id": "dsa-two-heap-05",
    "title": "Find Median From A Data Stream",
    "topic": "Two Heap",
    "difficulty": "Hard" as const,
    "status": "Queued",
    "column": "backlog" as const,
    "hours": 1.4
  },
  {
    "slug": "dsa-two-heap-06-the-number-of-smallest-unoccupied-chair",
    "id": "dsa-two-heap-06",
    "title": "The Number Of Smallest Unoccupied Chair",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 1.2
  },
  {
    "slug": "dsa-two-heap-07-meeting-rooms-iii",
    "id": "dsa-two-heap-07",
    "title": "Meeting Rooms Iii",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 3.6
  },
  {
    "slug": "dsa-two-heap-08-sliding-window-median",
    "id": "dsa-two-heap-08",
    "title": "Sliding Window Median",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Active",
    "column": "in-progress" as const,
    "hours": 3.3
  },
  {
    "slug": "dsa-two-heap-09-schedule-tasks-on-minimum-machines",
    "id": "dsa-two-heap-09",
    "title": "Schedule Tasks On Minimum Machines",
    "topic": "Two Heap",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 5.0
  },
  {
    "slug": "js-engine-01-javascript-engine-concept",
    "id": "js-engine-01-javascript-engine-concept",
    "title": "Javascript Engine Concept",
    "topic": "Upskilling",
    "difficulty": "Medium" as const,
    "status": "Solved",
    "column": "done" as const,
    "hours": 2.0
  }
];

export function getTicket(slug: string) {
  return TICKETS.find((t) => t.slug === slug);
}