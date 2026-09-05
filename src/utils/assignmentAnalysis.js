/**
 * Assignment Similarity & AI-Detection Heuristics Engine for Chalk2Tech
 */

export const demoDetailedSubmissions = {
  "sub-1": {
    studentName: "Rahul",
    rollNo: "CS2401",
    codeSnippet: `// Rahul's BST Implementation (Submitted 10:35 AM)
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// AVL Tree Helper Rotations
function rotateRight(y) {
  let x = y.left;
  let T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  return x;
}

function rotateLeft(x) {
  let y = x.right;
  let T2 = y.left;
  y.left = x;
  x.right = T2;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  return y;
}`,
    explanation: `A binary search tree maintains the invariant where every node in the left subtree contains a key strictly smaller than the parent node, and every node in the right subtree contains a key strictly greater. In an AVL self-balancing tree, after every insertion or deletion operation, the balance factor is computed as the height difference between the left and right subtrees. If the balance factor deviates outside the range [-1, 1], four specific rotation cases are executed to restore logarithmic height.`
  },

  "sub-2": {
    studentName: "Akhil",
    rollNo: "CS2402",
    codeSnippet: `// Akhil's BST Implementation (Submitted 09:48 AM)
class AVLNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

// Rotations for AVL self-balancing
function rightRotate(rootNode) {
  let pivot = rootNode.left;
  let subTree = pivot.right;
  pivot.right = rootNode;
  rootNode.left = subTree;
  rootNode.height = Math.max(nodeHeight(rootNode.left), nodeHeight(rootNode.right)) + 1;
  pivot.height = Math.max(nodeHeight(pivot.left), nodeHeight(pivot.right)) + 1;
  return pivot;
}

function leftRotate(rootNode) {
  let pivot = rootNode.right;
  let subTree = pivot.left;
  pivot.left = rootNode;
  rootNode.right = subTree;
  rootNode.height = Math.max(nodeHeight(rootNode.left), nodeHeight(rootNode.right)) + 1;
  pivot.height = Math.max(nodeHeight(pivot.left), nodeHeight(pivot.right)) + 1;
  return pivot;
}`,
    explanation: `In my BST implementation, I structured the node rotations using helper functions leftRotate and rightRotate. When rebalancing an AVL node, if the balance factor is greater than 1 and the new key is inserted in the left child, a single right rotation rebalances the branch. Notice that the rotation pointer reassignment is symmetric.`
  }
};

export const crossSimilarityMatrix = [
  { studentA: "Rahul", studentB: "Akhil", score: 87, flag: "high" },
  { studentA: "Rahul", studentB: "Vishnu", score: 24, flag: "clean" },
  { studentA: "Rahul", studentB: "Anu", score: 14, flag: "clean" },
  { studentA: "Rahul", studentB: "Meera", score: 11, flag: "clean" },
  { studentA: "Akhil", studentB: "Anu", score: 18, flag: "clean" },
  { studentA: "Vishnu", studentB: "Arjun", score: 22, flag: "clean" },
  { studentA: "Anu", studentB: "Meera", score: 9, flag: "clean" }
];

export function getAiAnalysisDetails(aiScore) {
  if (aiScore >= 75) {
    return {
      riskLevel: "High AI Likelihood",
      badgeClass: "badge-purple",
      burstiness: "Low (18/100) — Very uniform sentence cadence",
      perplexity: "Low (22/100) — Highly predictable word sequence",
      structuralConsistency: "High (94/100) — Matches standard ChatGPT docstrings",
      recommendedAction: "Schedule 5-minute oral viva to test student comprehension."
    };
  } else if (aiScore >= 40) {
    return {
      riskLevel: "Moderate AI Patterns",
      badgeClass: "badge-amber",
      burstiness: "Medium (45/100) — Some personal styling with boilerplate",
      perplexity: "Moderate (52/100) — Balanced phrasing",
      structuralConsistency: "Medium (58/100) — Standard textbook examples",
      recommendedAction: "Review code comments during routine evaluation."
    };
  } else {
    return {
      riskLevel: "Authentic Student Work",
      badgeClass: "badge-emerald",
      burstiness: "High (82/100) — Natural colloquial variation",
      perplexity: "High (88/100) — Unique problem-solving traces",
      structuralConsistency: "Authentic (32/100) — Non-standard bespoke comments",
      recommendedAction: "Verified authentic submission."
    };
  }
}
