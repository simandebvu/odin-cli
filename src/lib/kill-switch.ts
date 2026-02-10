/**
 * Kill Switch Mode - Brutally honest idea validation
 *
 * Applies strict local rules to catch common mistakes:
 * - Generic solutions with no wedge
 * - Saturated markets
 * - "Nice to have" problems
 * - Features masquerading as products
 */

interface Analysis {
  scores: {
    clarity: number;
    differentiation: number;
    feasibility: number;
  };
  recommendation: "SHIP" | "PIVOT" | "PARK";
  message: string;
  reasoning?: string;
  alternatives?: string[];
  risks?: Array<{ risk: string; experiment: string }>;
  pitch?: string;
}

interface IdeaAnswers {
  oneLiner: string;
  user: string;
  pain: string;
  wedge?: string;
  alternatives?: string;
}

/**
 * Apply Kill Switch logic - stricter than Copilot alone
 */
export function applyKillSwitch(
  copilotAnalysis: Analysis,
  answers: IdeaAnswers,
  competition: any
): Analysis {
  const { scores } = copilotAnalysis;

  // Rule 1: Low scores = PARK
  if (scores.clarity < 5 || scores.differentiation < 5 || scores.feasibility < 5) {
    return {
      ...copilotAnalysis,
      recommendation: "PARK",
      message: determineParkerReason(scores, answers),
      reasoning: "One or more scores below threshold (5/10). This needs fundamental rework.",
      alternatives: generateAlternatives(answers),
    };
  }

  // Rule 2: No clear wedge = PIVOT
  if (!answers.wedge || answers.wedge.length < 10 || answers.wedge.toLowerCase().includes("tbd")) {
    return {
      ...copilotAnalysis,
      recommendation: "PIVOT",
      message: "No clear differentiation. Every competitor can copy your approach.",
      reasoning: "Missing unfair advantage. 'Better UX' or 'easier to use' aren't wedges.",
      alternatives: [
        "Find a specific niche with unique needs (e.g., 'for X industry')",
        "Identify a technical advantage (e.g., proprietary data, network effects)",
        "Target underserved segment competitors ignore",
      ],
    };
  }

  // Rule 3: Vague user = PIVOT
  if (
    !answers.user ||
    answers.user.toLowerCase().includes("everyone") ||
    answers.user.toLowerCase().includes("anyone") ||
    answers.user.length < 15
  ) {
    return {
      ...copilotAnalysis,
      recommendation: "PIVOT",
      message: "User is too broad. 'Everyone' means no one.",
      reasoning: "Vague targeting leads to weak positioning and diluted messaging.",
      alternatives: [
        "Narrow to a specific job title or role",
        "Define by behavior, not demographics (e.g., 'developers who deploy daily')",
        "Start with smallest viable audience (100-1000 people)",
      ],
    };
  }

  // Rule 4: Generic problem patterns = PARK
  const genericProblems = [
    "todo",
    "task management",
    "note taking",
    "calendar",
    "scheduling",
    "email",
    "communication",
  ];

  const isGeneric = genericProblems.some((term) =>
    answers.oneLiner.toLowerCase().includes(term)
  );

  if (isGeneric && scores.differentiation < 7) {
    return {
      ...copilotAnalysis,
      recommendation: "PARK",
      message: "This is a feature, not a product.",
      reasoning: "Saturated market with low differentiation. You'll burn time and money competing with giants.",
      alternatives: [
        "Niche down dramatically (e.g., 'todo list for ADHD developers')",
        "Bundle this as a feature in a larger product",
        "Find an adjacent problem with less competition",
      ],
    };
  }

  // Rule 5: Medium scores = PIVOT (be stricter than Copilot)
  if (
    (scores.clarity >= 5 && scores.clarity < 7) ||
    (scores.differentiation >= 5 && scores.differentiation < 7)
  ) {
    return {
      ...copilotAnalysis,
      recommendation: "PIVOT",
      message: copilotAnalysis.message || "Scores are medium. This needs sharpening before you build.",
      reasoning: "Not fatally flawed, but not strong enough to ship. Refine first.",
      alternatives: copilotAnalysis.alternatives || generateAlternatives(answers),
    };
  }

  // Otherwise, trust Copilot's analysis
  return copilotAnalysis;
}

function determineParkerReason(
  scores: { clarity: number; differentiation: number; feasibility: number },
  answers: IdeaAnswers
): string {
  if (scores.clarity < 5) {
    return "The problem and solution are unclear. You can't build what you can't articulate.";
  }
  if (scores.differentiation < 5) {
    return "No meaningful differentiation. Why would anyone switch from existing solutions?";
  }
  if (scores.feasibility < 5) {
    return "Feasibility is too low. This requires resources/expertise you likely don't have.";
  }
  return "Multiple scores below threshold. Fundamental issues need resolution.";
}

function generateAlternatives(answers: IdeaAnswers): string[] {
  const alternatives = [];

  // Niche down
  alternatives.push(`Niche down: "${answers.oneLiner} for [specific industry/role]"`);

  // Feature, not product
  alternatives.push("Add this as a feature to an existing product you use daily");

  // Adjacent problem
  alternatives.push("Solve a related but less crowded problem in the same space");

  return alternatives;
}
