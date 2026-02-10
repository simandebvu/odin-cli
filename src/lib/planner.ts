import chalk from "chalk";
import ora from "ora";
import { getCopilotResponse } from "./copilot.js";
import { createGitHubIssues, createGitHubLabels, createProject } from "./github.js";
import type { PlanOptions, PlanResult, PlanSpec } from "../types/index.js";

export async function generatePlan(
  options: PlanOptions
): Promise<PlanResult> {
  // Step 1: Read input source
  const inputText = await readInputSource(options.source);

  // Step 2: Generate PlanSpec with Copilot
  const planSpinner = ora("Generating plan with Copilot...").start();
  const planSpec = await getCopilotResponse<PlanSpec>({
    prompt: buildPlanPrompt(inputText),
    format: "plan-spec",
  });
  planSpinner.succeed(`Plan generated: ${planSpec.issues.length} issues, ${planSpec.labels.length} labels`);

  if (options.dryRun) {
    return {
      issues: planSpec.issues,
      labels: planSpec.labels,
      project: options.project,
      projectUrl: "",
      roadmapUrl: "",
    };
  }

  // Step 3: Create GitHub resources
  console.log(); // Blank line
  const repo = options.repo || await getCurrentRepo();

  // Create labels
  const labelSpinner = ora(`Creating labels in ${repo}...`).start();
  const labels = await createGitHubLabels(repo, planSpec.labels);
  labelSpinner.succeed(`Created ${labels.length} labels`);

  // Create issues
  const issueSpinner = ora(`Creating ${planSpec.issues.length} issues...`).start();
  const issues = await createGitHubIssues(repo, planSpec.issues);
  issueSpinner.succeed(`Created ${issues.length} issues`);

  // Create or update project with full metadata
  const projectSpinner = ora("Creating GitHub Project with roadmap...").start();
  const { setupProjectWithMetadata } = await import("./project-setup.js");
  const projectUrl = await setupProjectWithMetadata(
    repo,
    planSpec.projectName || "Execution Plan",
    issues,
    planSpec
  );
  projectSpinner.succeed("Project created with roadmap timeline");

  return {
    issues: issues,
    labels: labels,
    project: options.project,
    projectUrl,
    roadmapUrl: `${projectUrl}?layout=roadmap`,
  };
}

async function readInputSource(
  source: PlanOptions["source"]
): Promise<string> {
  const { spawnCommand, readTextFile } = await import("./runtime.js");

  if (source.type === "pr") {
    // Fetch PR description via gh CLI
    const result = await spawnCommand(["gh", "pr", "view", source.number.toString(), "--json", "body"], {
      stdout: "pipe",
    });
    return JSON.parse(result.stdout).body;
  } else {
    return await readTextFile(source.path);
  }
}

async function getCurrentRepo(): Promise<string> {
  const { spawnCommand } = await import("./runtime.js");

  const result = await spawnCommand(["gh", "repo", "view", "--json", "nameWithOwner"], {
    stdout: "pipe",
  });
  return JSON.parse(result.stdout).nameWithOwner;
}

function buildPlanPrompt(inputText: string): string {
  return `You are a product planner. Convert this idea/description into a structured execution plan.

Input:
${inputText}

Generate a PlanSpec with:
1. Issues (8-15): each with title, description, acceptance criteria, labels, size (S/M/L), priority
2. Labels: type:*, area:*, priority:*, risk:*
3. Roadmap: sequence of phases with start/end dates (relative to today)
4. Project name

Respond in JSON format matching this schema:
{
  "projectName": "string",
  "issues": [
    {
      "title": "Verb + object",
      "description": "Why + what",
      "acceptanceCriteria": ["criterion 1", "criterion 2"],
      "labels": ["type:feature", "priority:high"],
      "size": "S" | "M" | "L",
      "priority": "high" | "medium" | "low"
    }
  ],
  "labels": [
    { "name": "type:feature", "color": "0E8A16", "description": "New feature" }
  ],
  "roadmap": [
    {
      "phase": "Foundation",
      "startDate": "2026-02-10",
      "endDate": "2026-02-17",
      "issues": [0, 1, 2]
    }
  ]
}`;
}
