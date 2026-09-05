/**
 * Seating Arrangement Algorithms for Chalk2Tech
 * 
 * Student Classification:
 * - High Performer (Mentor): marks >= 80
 * - Intermediate: 50 <= marks < 80
 * - Needs Support (Mentee): marks < 50
 */

export function classifyStudent(student) {
  const marks = Number(student.marks) || 0;
  if (marks >= 80) {
    return { tier: 'high', label: 'Mentor', color: 'emerald', badgeClass: 'badge-emerald' };
  } else if (marks >= 50) {
    return { tier: 'mid', label: 'Intermediate', color: 'indigo', badgeClass: 'badge-indigo' };
  } else {
    return { tier: 'low', label: 'Mentee', color: 'rose', badgeClass: 'badge-rose' };
  }
}

/**
 * Peer Tutoring Pairing Algorithm:
 * Pairs every struggling student (< 50) side-by-side with a high performer (>= 80).
 * Populates pairs across classroom benches from front to back.
 */
export function generatePeerTutoringLayout(students, rows = 3, cols = 4) {
  const totalSeats = rows * cols;
  const list = [...students];

  const high = list.filter(s => s.marks >= 80).sort((a, b) => b.marks - a.marks);
  const low = list.filter(s => s.marks < 50).sort((a, b) => a.marks - b.marks);
  const mid = list.filter(s => s.marks >= 50 && s.marks < 80).sort((a, b) => b.marks - a.marks);

  const arranged = [];

  // Create Mentor-Mentee pairs first
  while (low.length > 0 && high.length > 0) {
    // Pair a high mentor with a low mentee
    const mentor = high.shift();
    const mentee = low.shift();
    arranged.push(mentor, mentee);
  }

  // If any low students remain without high mentor, pair with highest mid
  while (low.length > 0 && mid.length > 0) {
    arranged.push(mid.shift(), low.shift());
  }

  // Fill remaining seats with remaining high and mid students
  const remaining = [...high, ...mid, ...low];
  while (remaining.length > 0) {
    arranged.push(remaining.shift());
  }

  // Pad or trim to totalSeats
  return padToGrid(arranged, totalSeats);
}

/**
 * Front-Row Focus Strategy:
 * Places students needing support (< 50) in Row 1 directly facing faculty.
 * Intermediate students in middle rows, High performers in back rows.
 */
export function generateFrontRowFocusLayout(students, rows = 3, cols = 4) {
  const totalSeats = rows * cols;
  const list = [...students];

  // Ascending order of marks (lowest marks in front)
  const sortedAscending = list.sort((a, b) => a.marks - b.marks);
  return padToGrid(sortedAscending, totalSeats);
}

/**
 * Exam Dispersal Mode (Anti-Cheating):
 * Alternates high and low/moderate performers in a checkerboard distribution
 * to prevent identical capability clusters.
 */
export function generateExamDispersalLayout(students, rows = 3, cols = 4) {
  const totalSeats = rows * cols;
  const list = [...students].sort((a, b) => b.marks - a.marks);

  const half = Math.ceil(list.length / 2);
  const topHalf = list.slice(0, half);
  const bottomHalf = list.slice(half);

  const interleaved = [];
  while (topHalf.length > 0 || bottomHalf.length > 0) {
    if (topHalf.length > 0) interleaved.push(topHalf.shift());
    if (bottomHalf.length > 0) interleaved.push(bottomHalf.shift());
  }

  return padToGrid(interleaved, totalSeats);
}

/**
 * Alphabetical Roster Arrangement (Baseline)
 */
export function generateAlphabeticalLayout(students, rows = 3, cols = 4) {
  const totalSeats = rows * cols;
  const sorted = [...students].sort((a, b) => a.name.localeCompare(b.name));
  return padToGrid(sorted, totalSeats);
}

function padToGrid(list, totalSeats) {
  const result = [...list];
  while (result.length < totalSeats) {
    result.push(null); // Empty desk
  }
  return result.slice(0, totalSeats);
}

/**
 * Evaluate analytics of current seating grid:
 * - Number of peer pairs (adjacent horizontal pairs where one is >= 80 and one is < 50)
 * - Front row average marks vs back row average marks
 * - Low-scoring students in front row count
 */
export function evaluateSeatingMetrics(grid, rows = 3, cols = 4) {
  let peerPairsCount = 0;
  let totalMenteeCount = 0;
  let pairedMentees = 0;

  // Calculate pairs in each row (adjacent columns: 0-1, 2-3, 4-5...)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c += 2) {
      const seat1 = grid[r * cols + c];
      const seat2 = grid[r * cols + (c + 1)];

      if (seat1 && seat2) {
        const isPair = (seat1.marks >= 80 && seat2.marks < 50) || (seat2.marks >= 80 && seat1.marks < 50);
        if (isPair) {
          peerPairsCount++;
        }
      }
    }
  }

  // Count total mentees
  grid.forEach(s => {
    if (s && s.marks < 50) totalMenteeCount++;
  });

  // Row averages
  const rowAverages = [];
  for (let r = 0; r < rows; r++) {
    const rowStudents = grid.slice(r * cols, (r + 1) * cols).filter(Boolean);
    if (rowStudents.length > 0) {
      const avg = rowStudents.reduce((sum, s) => sum + s.marks, 0) / rowStudents.length;
      rowAverages.push(Math.round(avg * 10) / 10);
    } else {
      rowAverages.push(0);
    }
  }

  const frontRowAvg = rowAverages[0] || 0;
  const backRowAvg = rowAverages[rowAverages.length - 1] || 0;

  return {
    peerPairsCount,
    totalMenteeCount,
    frontRowAvg,
    backRowAvg,
    rowAverages
  };
}
