import chalk from "chalk";

interface CopilotOptions {
  prompt: string;
  format: "idea-analysis" | "plan-spec";
}

export async function getCopilotResponse<T = any>(
  options: CopilotOptions
): Promise<T> {
  // For now, we'll use gh copilot suggest with a structured prompt
  // In the future, we can use the Copilot CLI API directly

  const fullPrompt = `${options.prompt}

IMPORTANT: Respond with ONLY valid JSON, no other text.`;

  try {
    // Use gh copilot suggest and capture output
    const { spawnCommand } = await import("./runtime.js");

    const result = await spawnCommand(
      ["gh", "copilot", "suggest", fullPrompt],
      {
        stdout: "pipe",
        stderr: "pipe",
      }
    );

    if (result.stderr) {
      console.log(chalk.dim(`Copilot stderr: ${result.stderr}`));
    }

    // Try to extract JSON from the output
    const jsonMatch = result.stdout.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(chalk.yellow("⚠️  Copilot didn't return JSON, using fallback"));
      return getFallbackResponse(options.format) as T;
    }

    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    console.error(chalk.red("Error calling Copilot CLI:"), error);
    return getFallbackResponse(options.format) as T;
  }
}

function getFallbackResponse(format: string): any {
  if (format === "idea-analysis") {
    return {
      scores: { clarity: 7, differentiation: 6, feasibility: 8 },
      recommendation: "SHIP",
      message: "Copilot analysis unavailable. Manual review recommended.",
      risks: [
        {
          risk: "Distribution",
          experiment: "Create demo video and share in relevant communities",
        },
        {
          risk: "Feasibility",
          experiment: "Build core MVP in 1 week to validate technical approach",
        },
      ],
      pitch: "Your one-line pitch here",
    };
  } else if (format === "plan-spec") {
    return {
      projectName: "Execution Plan",
      issues: [
        {
          title: "Set up project structure",
          description: "Initialize repository with basic structure and configuration",
          acceptanceCriteria: [
            "Repository created with README",
            "CI/CD pipeline configured",
            "Development environment documented",
          ],
          labels: ["type:setup", "priority:high"],
          size: "M",
          priority: "high",
        },
      ],
      labels: [
        { name: "type:setup", color: "D4C5F9", description: "Setup and configuration" },
        { name: "priority:high", color: "D93F0B", description: "High priority" },
      ],
      roadmap: [
        {
          phase: "Foundation",
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          issues: [0],
        },
      ],
    };
  }
  return {};
}
