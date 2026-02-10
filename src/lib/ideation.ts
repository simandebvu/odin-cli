import inquirer from "inquirer";
import chalk from "chalk";
import { getCopilotResponse } from "./copilot.js";
import { searchCompetitors } from "./competition.js";
import type { IdeationResult, IdeationOptions } from "../types/index.js";

export async function runIdeation(
  options: IdeationOptions
): Promise<IdeationResult> {
  // Step 1: Ask the core questions
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "oneLiner",
      message: "What are we building? (one-liner)",
      validate: (input) => input.length > 0 || "Required",
    },
    {
      type: "input",
      name: "user",
      message: "Who's the user?",
      validate: (input) => input.length > 0 || "Required",
    },
    {
      type: "input",
      name: "pain",
      message: "What pain are they escaping?",
      validate: (input) => input.length > 0 || "Required",
    },
    {
      type: "input",
      name: "trigger",
      message: "When do they feel it? (trigger moment)",
    },
    {
      type: "input",
      name: "alternatives",
      message: "What do they use today (even if messy)?",
    },
    {
      type: "input",
      name: "wedge",
      message: "What's your unfair advantage or unique hook?",
    },
    {
      type: "input",
      name: "notIncluded",
      message: "What is explicitly NOT included in MVP?",
    },
    {
      type: "input",
      name: "proofTest",
      message: "Smallest demo that proves value in 10 minutes?",
    },
    {
      type: "checkbox",
      name: "risks",
      message: "Top risks (select up to 2):",
      choices: [
        { name: "Feasibility (can we build it?)", value: "feasibility" },
        { name: "Distribution (can we reach users?)", value: "distribution" },
        { name: "Trust (will they trust us?)", value: "trust" },
        { name: "Cost (can we afford it?)", value: "cost" },
        { name: "Timing (is now the right time?)", value: "timing" },
      ],
      validate: (input) => input.length <= 2 || "Select max 2 risks",
    },
  ]);

  // Step 2: Competition analysis (optional)
  let competition = null;
  if (!options.skipCompetition) {
    console.log(chalk.dim("\n🔍 Searching for competitors...\n"));
    competition = await searchCompetitors(answers.oneLiner);
  }

  // Step 3: Send to Copilot for analysis
  console.log(chalk.dim("\n🤖 Analyzing with Copilot...\n"));
  const analysis = await getCopilotResponse({
    prompt: buildAnalysisPrompt(answers, competition),
    format: "idea-analysis",
  });

  // Step 4: Generate idea memo
  const memo = buildIdeaMemo(answers, competition, analysis);
  const { writeFile } = await import("fs/promises");
  await writeFile(options.outputFile, memo, "utf-8");

  return {
    recommendation: analysis.recommendation,
    message: analysis.message,
    memo,
    competition,
  };
}

function buildAnalysisPrompt(answers: any, competition: any): string {
  return `You are a brutally honest product strategist. Analyze this idea and provide:

1. Score (0-10) on: clarity, differentiation, feasibility
2. Recommendation: SHIP / PIVOT / PARK
3. If PIVOT: suggest 2-3 sharper angles
4. Top 2 risks and tiny experiments to test them
5. One-line pitch

Idea:
${JSON.stringify(answers, null, 2)}

Competition:
${competition ? JSON.stringify(competition, null, 2) : "No competition analysis"}

Respond in JSON format:
{
  "scores": { "clarity": 0-10, "differentiation": 0-10, "feasibility": 0-10 },
  "recommendation": "SHIP" | "PIVOT" | "PARK",
  "message": "explanation",
  "risks": [{ "risk": "...", "experiment": "..." }],
  "pitch": "one-line pitch"
}`;
}

function buildIdeaMemo(answers: any, competition: any, analysis: any): string {
  return `# Idea Memo

## One-liner
${answers.oneLiner}

## User & Pain
**User**: ${answers.user}
**Pain**: ${answers.pain}
**Trigger**: ${answers.trigger || "N/A"}

## Alternatives & Wedge
**Current alternatives**: ${answers.alternatives || "N/A"}
**Our wedge**: ${answers.wedge || "TBD"}

## MVP Scope
**Included**: ${answers.oneLiner}
**Explicitly NOT included**: ${answers.notIncluded || "TBD"}
**Proof test**: ${answers.proofTest || "TBD"}

## Risks
${answers.risks.map((r: string) => `- ${r}`).join("\n")}

${
  competition
    ? `## Competition
${competition.summary || "N/A"}
`
    : ""
}

## Analysis (Copilot)

**Scores**:
- Clarity: ${analysis.scores?.clarity || "N/A"}/10
- Differentiation: ${analysis.scores?.differentiation || "N/A"}/10
- Feasibility: ${analysis.scores?.feasibility || "N/A"}/10

**Recommendation**: ${analysis.recommendation}

${analysis.message}

**One-line pitch**: ${analysis.pitch || "TBD"}

## Next Steps
${
  analysis.recommendation === "SHIP"
    ? "Run: `gh odin plan --text IDEA_MEMO.md`"
    : analysis.recommendation === "PIVOT"
    ? "Consider pivoting based on analysis above"
    : "Park this idea for now"
}
`;
}
