import inquirer from "inquirer";
import chalk from "chalk";
import { getCopilotResponse } from "./copilot.js";
import { searchCompetitors } from "./competition.js";
import { applyKillSwitch } from "./kill-switch.js";
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
    console.log(chalk.dim("\n🏆 Competition Analysis\n"));
    competition = await searchCompetitors(answers.oneLiner);

    if (competition.competitors.length > 0) {
      console.log(chalk.dim(`   Found ${competition.competitors.length} competitors`));
      console.log(chalk.dim(`   Top: ${competition.competitors[0].name} (${competition.competitors[0].stars}⭐)`));
    }
  }

  // Step 3: Send to Copilot for analysis
  console.log(chalk.dim("\n🤖 Analyzing with Copilot (Kill Switch Mode)...\n"));
  const analysis = await getCopilotResponse({
    prompt: buildAnalysisPrompt(answers, competition),
    format: "idea-analysis",
  });

  // Step 3.5: Apply Kill Switch logic (stricter local validation)
  const killSwitchAnalysis = applyKillSwitch(analysis, answers, competition);

  // Step 4: Generate idea memo
  const memo = buildIdeaMemo(answers, competition, killSwitchAnalysis);
  const { writeFile } = await import("fs/promises");
  await writeFile(options.outputFile, memo, "utf-8");

  return {
    recommendation: killSwitchAnalysis.recommendation,
    message: killSwitchAnalysis.message,
    memo,
    competition,
  };
}

function buildAnalysisPrompt(answers: any, competition: any): string {
  return `You are a brutally honest product strategist. Your job is to save founders from wasting time on weak ideas.

Analyze this idea with STRICT criteria:
- Clarity: Is the problem and solution crystal clear?
- Differentiation: Is there a genuine unfair advantage? (not just "better UX")
- Feasibility: Can a small team actually build and ship this?

RECOMMENDATION THRESHOLDS:
- SHIP: All scores >= 7, clear wedge, specific user
- PIVOT: Scores 5-6, idea has potential but needs refinement
- PARK: Any score < 5, OR saturated market with no wedge, OR "nice to have" problem

Be HARSH. Most ideas should PIVOT or PARK.

If PARK: Say "This is a feature, not a product" or "This is a vitamin, not a painkiller" and explain why.
If PIVOT: Suggest 2-3 concrete sharper angles (be specific, not generic).
If SHIP: Still point out the top 2 risks.

Idea:
${JSON.stringify(answers, null, 2)}

Competition:
${competition ? JSON.stringify(competition, null, 2) : "No competition analysis"}

Respond in JSON format:
{
  "scores": { "clarity": 0-10, "differentiation": 0-10, "feasibility": 0-10 },
  "recommendation": "SHIP" | "PIVOT" | "PARK",
  "message": "explanation (be brutal but constructive)",
  "reasoning": "why this score? what's the fatal flaw?",
  "alternatives": ["concrete pivot 1", "concrete pivot 2", "concrete pivot 3"] (only if PIVOT/PARK),
  "risks": [{ "risk": "...", "experiment": "tiny test (<1 week)" }],
  "pitch": "one-line pitch (only if SHIP/PIVOT)"
}`;
}

function buildIdeaMemo(answers: any, competition: any, analysis: any): string {
  const recommendationEmoji = {
    SHIP: "✅",
    PIVOT: "⚠️",
    PARK: "🛑",
  };

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
  competition && competition.competitors.length > 0
    ? `## Competition Analysis

${competition.summary}

${
  competition.competitors.length > 0
    ? `### Competitors Found

${competition.competitors
  .map(
    (c: any) =>
      `- **[${c.name}](${c.url})** (${c.stars.toLocaleString()}⭐) - ${c.description}`
  )
  .join("\n")}
`
    : ""
}
`
    : competition
    ? `## Competition Analysis

${competition.summary}
`
    : ""
}

## Analysis (Kill Switch Mode)

**Scores**:
- Clarity: ${analysis.scores?.clarity || "N/A"}/10
- Differentiation: ${analysis.scores?.differentiation || "N/A"}/10
- Feasibility: ${analysis.scores?.feasibility || "N/A"}/10

---

${recommendationEmoji[analysis.recommendation as keyof typeof recommendationEmoji] || "❓"} **Recommendation: ${analysis.recommendation}**

### ${analysis.recommendation === "PARK" ? "Why You Should Not Build This" : analysis.recommendation === "PIVOT" ? "Why This Needs Work" : "Why This Could Work"}

${analysis.message}

${analysis.reasoning ? `\n**The Fatal Flaw:** ${analysis.reasoning}\n` : ""}

${
  analysis.alternatives && analysis.alternatives.length > 0
    ? `### Consider Instead

${analysis.alternatives.map((alt: string, i: number) => `${i + 1}. ${alt}`).join("\n")}
`
    : ""
}

${
  analysis.risks && analysis.risks.length > 0
    ? `### Top Risks

${analysis.risks.map((r: any) => `**${r.risk}**\n→ Experiment: ${r.experiment}`).join("\n\n")}
`
    : ""
}

${analysis.pitch ? `### One-Line Pitch\n> ${analysis.pitch}\n` : ""}

---

## Next Steps
${
  analysis.recommendation === "SHIP"
    ? "✅ **PROCEED:** Run `gh odin plan --text IDEA_MEMO.md`"
    : analysis.recommendation === "PIVOT"
    ? "⚠️ **REFINE:** Address the issues above, then run ideation again"
    : "🛑 **STOP:** Park this idea. Try one of the alternatives above instead."
}

---

*Generated with [Odin CLI](https://github.com/simandebvu/odin-cli) - Brutally honest idea validation*
`;
}
