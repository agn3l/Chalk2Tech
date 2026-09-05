/**
 * Report Card Comment Generator Engine for Chalk2Tech
 * Synthesizes personalized comments across 3 distinct pedagogical tones:
 * 1. Professional (Formal, objective academic summary)
 * 2. Encouraging (Growth-mindset, motivating, highlights strengths)
 * 3. Concise (High-impact bulleted summary for tight character limits)
 */

export function generateReportComment(studentData, tone = 'professional') {
  const {
    name = "Student",
    marks = 70,
    totalMarks = 100,
    attendancePct = 75,
    strongConcepts = [],
    weakConcepts = [],
    customNote = ""
  } = studentData;

  const scorePct = Math.round((marks / totalMarks) * 100);
  const strongStr = strongConcepts.length > 0 ? strongConcepts.join(", ") : "core syllabus topics";
  const weakStr = weakConcepts.length > 0 ? weakConcepts.join(", ") : "applied problem-solving";

  // Tier categorization
  const isHighScorer = scorePct >= 80;
  const isStruggling = scorePct < 50;
  const isLowAttendance = attendancePct < 75;

  if (tone === 'encouraging') {
    if (isHighScorer) {
      return `${name} has shown phenomenal dedication and intellectual curiosity this semester, scoring ${scorePct}%! Their mastery of ${strongStr} is truly exemplary. By continuing to explore advanced algorithmic challenges and assisting peers, ${name} will continue to excel. Outstanding effort and attitude!`;
    } else if (isStruggling) {
      return `${name} brings genuine enthusiasm to class discussions and demonstrates encouraging intuition with ${strongStr}. While current exam results (${scorePct}%) highlight difficulties in ${weakStr}, with targeted practice and consistent classroom attendance${isLowAttendance ? ` (currently ${attendancePct}%)` : ''}, ${name} has all the potential to make a remarkable leap forward. Believe in your capability and keep pushing!`;
    } else {
      return `${name} is making steady, admirable progress across Data Structures, earning a solid ${scorePct}%. They demonstrate solid competence in ${strongStr}. By dedicating a bit more focused revision to ${weakStr}, ${name} can comfortably reach the highest academic band. We are very proud of their persistent effort!`;
    }
  }

  if (tone === 'concise') {
    let comment = `Score: ${scorePct}%. Demonstrates strong grasp of ${strongStr}.`;
    if (weakConcepts.length > 0) {
      comment += ` Needs targeted reinforcement in ${weakStr}.`;
    }
    if (isLowAttendance) {
      comment += ` Attendance (${attendancePct}%) requires urgent improvement for exam eligibility.`;
    }
    if (customNote) {
      comment += ` Note: ${customNote}`;
    }
    return comment;
  }

  // Professional (Default)
  if (isHighScorer) {
    return `${name} demonstrates exceptional analytical rigor and conceptual clarity, achieving ${scorePct}% in examinations. Their work in ${strongStr} exhibits advanced comprehension and methodical execution. Maintaining this standard of precision will ensure continued academic excellence in upcoming terms.`;
  } else if (isStruggling) {
    return `${name} demonstrates foundational familiarity with ${strongStr} but requires structured intervention in ${weakStr}, as reflected in an examination score of ${scorePct}%. Detailed answer-sheet analysis indicates a need for systematic step-by-step verification and numerical problem-solving.${isLowAttendance ? ` Furthermore, mandatory attendance compliance (${attendancePct}% vs 75% threshold) must be restored immediately.` : ''}`;
  } else {
    return `${name} displays consistent academic engagement with a satisfactory examination performance of ${scorePct}%. Good proficiency is evident in ${strongStr}. To elevate overall assessment outcomes, focused revision in ${weakStr} is recommended before final semester evaluations.`;
  }
}
