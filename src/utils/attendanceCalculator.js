/**
 * Attendance Calculation Utility for Chalk2Tech
 * 
 * Mathematical Equations:
 * 1. Current Percentage:
 *    Pct = (P / W) * 100
 * 
 * 2. Minimum Consecutive Classes (x) to reach >= 75%:
 *    (P + x) / (W + x) >= 0.75
 *    4P + 4x >= 3W + 3x
 *    x >= 3W - 4P
 *    => x = max(0, ceil(3W - 4P))
 * 
 * 3. Safe Margin of Absences (y) while remaining >= 75%:
 *    P / (W + y) >= 0.75
 *    4P >= 3W + 3y
 *    3y <= 4P - 3W
 *    => y = max(0, floor((4P - 3W) / 3))
 */

export function calculateStudentAttendance(presentDays, totalDays) {
  const p = Math.max(0, parseInt(presentDays, 10) || 0);
  const w = Math.max(1, parseInt(totalDays, 10) || 1); // Avoid div by zero

  const rawPct = (p / w) * 100;
  const pct = Math.min(100, Math.round(rawPct * 10) / 10);

  let status = 'safe'; // >= 80%
  let statusLabel = 'Safe';
  let badgeClass = 'badge-emerald';

  if (pct < 75.0) {
    status = 'danger';
    statusLabel = 'Below 75%';
    badgeClass = 'badge-rose';
  } else if (pct < 80.0) {
    status = 'warning';
    statusLabel = 'Monitor Zone';
    badgeClass = 'badge-amber';
  }

  // Minimum consecutive classes to reach 75%
  let minConsecutiveNeeded = 0;
  if (pct < 75.0) {
    minConsecutiveNeeded = Math.max(0, Math.ceil(3 * w - 4 * p));
  }

  // Safe margin of classes student can miss
  let safeMarginAbsences = 0;
  if (pct >= 75.0) {
    safeMarginAbsences = Math.max(0, Math.floor((4 * p - 3 * w) / 3));
  }

  return {
    present: p,
    total: w,
    pct,
    status,
    statusLabel,
    badgeClass,
    minConsecutiveNeeded,
    safeMarginAbsences
  };
}

/**
 * Predict projected attendance if a student attends 'attendCount' out of 'remainingClasses'
 */
export function simulateProjectedAttendance(present, total, remainingClasses, willAttendCount) {
  const p = Math.max(0, parseInt(present, 10) || 0);
  const w = Math.max(1, parseInt(total, 10) || 1);
  const r = Math.max(0, parseInt(remainingClasses, 10) || 0);
  const a = Math.min(r, Math.max(0, parseInt(willAttendCount, 10) || 0));

  const newPresent = p + a;
  const newTotal = w + r;
  const projectedPct = Math.min(100, Math.round(((newPresent / newTotal) * 100) * 10) / 10);
  const isEligible = projectedPct >= 75.0;

  return {
    newPresent,
    newTotal,
    projectedPct,
    isEligible
  };
}
