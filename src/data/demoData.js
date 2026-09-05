export const initialDemoData = {
  facultyName: "Dr. Arvind Sharma",
  department: "Department of Computer Science & Engineering",
  course: "CS302: Data Structures & Algorithms (Sec-B)",
  semester: "Semester IV, 2026",

  metrics: {
    totalStudents: 42,
    attendanceAlerts: 7,
    assignmentAlerts: 3,
    aiSimilarityFlags: 4,
    classUnderstanding: 73
  },

  understandingBreakdown: {
    fullyUnderstood: 42, // %
    mostlyUnderstood: 31, // %
    needExplanation: 19, // %
    didntUnderstand: 8 // %
  },

  recentAlerts: [
    {
      id: "alert-1",
      type: "attendance",
      severity: "danger",
      title: "7 Students Below 75% Attendance",
      desc: "Rahul (68%), Vishnu (62.5%), Meera (65%) and 4 others are in attendance risk zone.",
      timestamp: "10 mins ago",
      targetTab: "attendance"
    },
    {
      id: "alert-2",
      type: "similarity",
      severity: "warning",
      title: "High Code/Text Similarity Detected (87%)",
      desc: "Rahul ↔ Akhil submissions for Assignment 3 share identical logic blocks and commentary.",
      timestamp: "35 mins ago",
      targetTab: "assignments"
    },
    {
      id: "alert-3",
      type: "ai",
      severity: "purple",
      title: "High AI-Likelihood Pattern Detected (82%)",
      desc: "Rahul's Assignment 3 answer displays uniform sentence structure and zero perplexity variation.",
      timestamp: "1 hour ago",
      targetTab: "assignments"
    },
    {
      id: "alert-4",
      type: "voice",
      severity: "info",
      title: "12 Anonymous Student Voice Submissions",
      desc: "Recent requests ask for more code walkthroughs on Linked Lists & Dynamic Programming.",
      timestamp: "2 hours ago",
      targetTab: "student-voice"
    }
  ],

  recentActivity: [
    {
      id: "act-1",
      time: "10:35 AM",
      action: "Assignment submitted late",
      student: "Rahul Verma",
      detail: "Submitted Assignment 3 (35 mins past 10:00 AM cutoff)",
      tag: "Late Submission",
      tagColor: "rose"
    },
    {
      id: "act-2",
      time: "09:55 AM",
      action: "On-time submission",
      student: "Anu Krishnan",
      detail: "Submitted Assignment 3 with full test suite",
      tag: "On Time",
      tagColor: "emerald"
    },
    {
      id: "act-3",
      time: "09:48 AM",
      action: "On-time submission",
      student: "Akhil Nair",
      detail: "Submitted Assignment 3 (Source + PDF report)",
      tag: "On Time",
      tagColor: "emerald"
    },
    {
      id: "act-4",
      time: "Yesterday",
      action: "Anonymous Student Voice Note",
      student: "Anonymous Student",
      detail: "Topic Understanding: 'Need more explanation on Graph BFS/DFS traversal'",
      tag: "Student Voice",
      tagColor: "amber"
    }
  ],

  // Module 1: Assignments Data
  assignments: {
    activeAssignment: {
      id: "asg-3",
      title: "Lab 3: Binary Search Trees & AVL Balancing",
      subject: "Data Structures & Algorithms",
      deadline: "Today, 10:00 AM",
      deadlineISO: "2026-09-05T10:00:00",
      totalMarks: 50,
      totalSubmissions: 38,
      lateCount: 3,
      flaggedCount: 4
    },
    submissions: [
      {
        id: "sub-1",
        studentName: "Rahul",
        rollNo: "CS2401",
        submitTime: "10:35 AM",
        deadlineTime: "10:00 AM",
        isLate: true,
        marks: null,
        similarityScore: 87,
        similarityWith: "Akhil",
        aiLikelihood: 82,
        aiIndicators: [
          "Highly uniform sentence and docstring structure",
          "Generic algorithmic phrasing with textbook boilerplates",
          "Low syntactic variation across explanatory paragraphs"
        ],
        status: "Flagged & Late",
        snippet: "A binary search tree maintains the invariant where every node in the left subtree contains a key strictly smaller than the parent..."
      },
      {
        id: "sub-2",
        studentName: "Akhil",
        rollNo: "CS2402",
        submitTime: "09:48 AM",
        deadlineTime: "10:00 AM",
        isLate: false,
        marks: 48,
        similarityScore: 87,
        similarityWith: "Rahul",
        aiLikelihood: 12,
        aiIndicators: ["Natural conversational phrasing", "Unique variable naming style"],
        status: "High Similarity",
        snippet: "In my BST implementation, I structured the node rotations using helper functions rotateLeft and rotateRight..."
      },
      {
        id: "sub-3",
        studentName: "Anu",
        rollNo: "CS2403",
        submitTime: "09:55 AM",
        deadlineTime: "10:00 AM",
        isLate: false,
        marks: 46,
        similarityScore: 14,
        similarityWith: "None",
        aiLikelihood: 15,
        aiIndicators: ["Varied vocabulary", "Step-by-step custom tracing"],
        status: "Clean",
        snippet: "When rebalancing AVL trees, calculating height difference between child subtrees determines the 4 standard rotation cases..."
      },
      {
        id: "sub-4",
        studentName: "Vishnu",
        rollNo: "CS2404",
        submitTime: "10:15 AM",
        deadlineTime: "10:00 AM",
        isLate: true,
        marks: 38,
        similarityScore: 22,
        similarityWith: "None",
        aiLikelihood: 74,
        aiIndicators: ["Suspiciously formal phrasing", "Generic AI commentary block"],
        status: "Late & Possible AI",
        snippet: "Furthermore, the logarithmic time complexity O(log n) guarantees optimal searching in balanced binary trees..."
      },
      {
        id: "sub-5",
        studentName: "Meera",
        rollNo: "CS2405",
        submitTime: "09:30 AM",
        deadlineTime: "10:00 AM",
        isLate: false,
        marks: 44,
        similarityScore: 9,
        similarityWith: "None",
        aiLikelihood: 8,
        aiIndicators: ["Handwritten scan and authentic notes", "Personal comments"],
        status: "Clean",
        snippet: "I tested edge cases including inserting duplicate keys and single-node rotations on deleting root."
      },
      {
        id: "sub-6",
        studentName: "Arjun",
        rollNo: "CS2406",
        submitTime: "09:50 AM",
        deadlineTime: "10:00 AM",
        isLate: false,
        marks: 42,
        similarityScore: 18,
        similarityWith: "None",
        aiLikelihood: 28,
        aiIndicators: ["Standard academic format", "Manual code comments"],
        status: "Clean",
        snippet: "To prevent recursion stack overflow during deep traversals, I used an iterative stack helper."
      }
    ]
  },

  // Module 2: Attendance Data
  attendance: {
    totalWorkingDays: 60,
    students: [
      { id: "att-1", name: "Akhil", presentDays: 57, totalDays: 60 },
      { id: "att-2", name: "Anu", presentDays: 55, totalDays: 60 },
      { id: "att-3", name: "Priya", presentDays: 58, totalDays: 60 },
      { id: "att-4", name: "Neha", presentDays: 54, totalDays: 60 },
      { id: "att-5", name: "Arjun", presentDays: 49, totalDays: 60 },
      { id: "att-6", name: "Pooja", presentDays: 48, totalDays: 60 },
      { id: "att-7", name: "Rohan", presentDays: 46, totalDays: 60 },
      { id: "att-8", name: "Rahul", presentDays: 41, totalDays: 60 }, // 68.3% -> Below 75%
      { id: "att-9", name: "Vishnu", presentDays: 37, totalDays: 60 }, // 61.6% -> Below 75%
      { id: "att-10", name: "Meera", presentDays: 39, totalDays: 60 }, // 65.0% -> Below 75%
      { id: "att-11", name: "Adithya", presentDays: 43, totalDays: 60 }, // 71.6% -> Below 75%
      { id: "att-12", name: "Dev", presentDays: 42, totalDays: 60 } // 70.0% -> Below 75%
    ]
  },

  // Module 3: Smart Seating Data
  seating: {
    defaultRows: 3,
    defaultCols: 4,
    students: [
      { id: "seat-1", name: "Akhil", marks: 92 },
      { id: "seat-2", name: "Rahul", marks: 48 },
      { id: "seat-3", name: "Anu", marks: 85 },
      { id: "seat-4", name: "Vishnu", marks: 41 },
      { id: "seat-5", name: "Meera", marks: 35 },
      { id: "seat-6", name: "Arjun", marks: 76 },
      { id: "seat-7", name: "Neha", marks: 88 },
      { id: "seat-8", name: "Adithya", marks: 54 },
      { id: "seat-9", name: "Pooja", marks: 79 },
      { id: "seat-10", name: "Rohan", marks: 62 },
      { id: "seat-11", name: "Dev", marks: 45 },
      { id: "seat-12", name: "Priya", marks: 94 }
    ]
  },

  // Module 4: Report Card Comments
  reportCards: [
    {
      id: "rep-1",
      studentName: "Rahul",
      subject: "Mathematics & Computing",
      marks: 68,
      totalMarks: 100,
      attendancePct: 68,
      answerSheetNotes: {
        strongConcepts: ["Basic algebra", "Linear equations", "Matrix arithmetic"],
        weakConcepts: ["Quadratic equations", "Graph interpretation", "Calculation accuracy"],
        commonMistakes: "Skipped intermediate simplification step in Question 4; sign error in quadratic formula discriminant.",
        missingSteps: "Did not verify boundary conditions in Q7."
      },
      comments: {
        professional: "Rahul demonstrates a solid foundational understanding of basic algebra and linear equations. Analysis of his answer sheet indicates a need for structured practice in quadratic problem-solving and graph interpretation. Focusing on step-by-step verification will directly improve his calculation precision.",
        encouraging: "Rahul shows genuine promise and strong intuition with linear equations and algebra! By dedicating a bit more time to quadratic equations and carefully checking each calculation step, he can easily elevate his score to the top tier. Keep up the determined effort!",
        concise: "Good foundation in basic algebra. Needs targeted practice in quadratic equations, graph interpretation, and step-by-step calculation precision."
      }
    },
    {
      id: "rep-2",
      studentName: "Akhil",
      subject: "Mathematics & Computing",
      marks: 92,
      totalMarks: 100,
      attendancePct: 95,
      answerSheetNotes: {
        strongConcepts: ["Calculus", "Probability distributions", "Linear algebra", "Logical proofs"],
        weakConcepts: ["Rigorous geometric proofs notation"],
        commonMistakes: "Minor notation omission in step 3 of theorem proof.",
        missingSteps: "None"
      },
      comments: {
        professional: "Akhil demonstrates exceptional mastery across advanced mathematical topics with outstanding conceptual clarity and precision.",
        encouraging: "Outstanding performance! Akhil's rigorous problem-solving approach and analytical depth set a wonderful standard. Continue exploring competitive olympiad problems!",
        concise: "Excellent mastery of calculus and linear algebra. Consistently high conceptual accuracy."
      }
    }
  ],

  // Module 5: Anonymous Student Voice
  studentVoice: {
    topic: "Module 4: Dynamic Programming & Binary Search Trees",
    classDate: "September 5, 2026",
    ratingStats: {
      fullyUnderstood: 18, // 42.8%
      mostlyUnderstood: 13, // 31.0%
      needExplanation: 8, // 19.0%
      didntUnderstand: 3, // 7.1%
      totalVotes: 42
    },
    anonymousNotes: [
      {
        id: "note-1",
        type: "note",
        message: "I think we need more live coding examples for linked lists before jumping into tree balancing.",
        understandingLevel: "Need more explanation",
        timestamp: "Today, 11:20 AM"
      },
      {
        id: "note-2",
        type: "suggestion",
        message: "Can we have one more revision session dedicated strictly to past year exam numericals?",
        understandingLevel: "Mostly understood",
        timestamp: "Today, 09:45 AM"
      },
      {
        id: "note-3",
        type: "note",
        message: "Could you explain the difference between top-down memoization and bottom-up tabulation again on the blackboard?",
        understandingLevel: "Didn't understand",
        timestamp: "Yesterday, 04:15 PM"
      },
      {
        id: "note-4",
        type: "suggestion",
        message: "The step-by-step chalk diagrams really helped today! Sharing the diagram slides on the portal would be great.",
        understandingLevel: "Fully understood",
        timestamp: "Yesterday, 02:30 PM"
      }
    ]
  }
};
