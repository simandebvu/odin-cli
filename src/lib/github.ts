import chalk from "chalk";

export interface Label {
  name: string;
  color: string;
  description: string;
}

export interface Issue {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  labels: string[];
  size: "S" | "M" | "L";
  priority: "high" | "medium" | "low";
}

export interface CreatedIssue {
  number: number;
  url: string;
}

export async function createGitHubLabels(
  repo: string,
  labels: Label[]
): Promise<Label[]> {
  const { spawnCommand } = await import("./runtime.js");
  const created: Label[] = [];

  for (const label of labels) {
    try {
      // Use REST API (works with older gh versions)
      const payload = JSON.stringify({
        name: label.name,
        color: label.color,
        description: label.description,
      });

      await spawnCommand([
        "gh",
        "api",
        `repos/${repo}/labels`,
        "--method",
        "POST",
        "--input",
        "-",
      ], { stdout: "pipe", stderr: "pipe" });

      created.push(label);
    } catch (error) {
      // Label might already exist, try to update it
      try {
        await spawnCommand([
          "gh",
          "api",
          `repos/${repo}/labels/${encodeURIComponent(label.name)}`,
          "--method",
          "PATCH",
          "-f",
          `color=${label.color}`,
          "-f",
          `description=${label.description}`,
        ]);
        created.push(label);
      } catch (updateError) {
        console.log(chalk.dim(`  ⚠️  Label ${label.name} failed to create/update`));
      }
    }
  }

  return created;
}

export async function createGitHubIssues(
  repo: string,
  issues: Issue[]
): Promise<CreatedIssue[]> {
  const { spawnCommand } = await import("./runtime.js");
  const created: CreatedIssue[] = [];

  for (const issue of issues) {
    const body = `${issue.description}

## Acceptance Criteria
${issue.acceptanceCriteria.map((c) => `- [ ] ${c}`).join("\n")}

## Size: ${issue.size}
## Priority: ${issue.priority}
`;

    try {
      const result = await spawnCommand(
        [
          "gh",
          "issue",
          "create",
          "--repo",
          repo,
          "--title",
          issue.title,
          "--body",
          body,
          "--label",
          issue.labels.join(","),
        ],
        { stdout: "pipe" }
      );

      // Extract issue number from URL (output is the issue URL)
      const urlMatch = result.stdout.match(/\/issues\/(\d+)/);
      if (urlMatch) {
        created.push({
          number: parseInt(urlMatch[1]),
          url: result.stdout.trim(),
        });
      }
    } catch (error) {
      console.error(chalk.red(`  ❌ Failed to create issue: ${issue.title}`), error);
    }
  }

  return created;
}

export async function createProject(
  repo: string,
  options: {
    name: string;
    issues: number[];
    roadmap: any[];
  }
): Promise<string> {
  const {
    getRepositoryOwner,
    createProjectV2,
    getProjectFields,
    createProjectField,
    addIssueToProject,
    getIssueNodeId,
    setProjectItemFieldValue,
    findOrCreateOption,
  } = await import("./graphql.js");

  console.log(chalk.dim("  📊 Creating GitHub Project v2..."));

  // Step 1: Get repository owner ID
  const { ownerId } = await getRepositoryOwner(repo);

  // Step 2: Create project
  const project = await createProjectV2(ownerId, options.name);
  console.log(chalk.dim(`     ✓ Project created: ${project.projectUrl}`));

  // Step 3: Get or create custom fields
  console.log(chalk.dim("  📝 Setting up custom fields..."));
  let fields = await getProjectFields(project.projectId);

  // Create fields if they don't exist
  const requiredFields = [
    { name: "Priority", dataType: "SINGLE_SELECT" as const, options: ["High", "Medium", "Low"] },
    { name: "Size", dataType: "SINGLE_SELECT" as const, options: ["S", "M", "L"] },
    { name: "Start Date", dataType: "DATE" as const },
    { name: "Target Date", dataType: "DATE" as const },
  ];

  for (const required of requiredFields) {
    const existing = fields.find((f) => f.name === required.name);
    if (!existing) {
      console.log(chalk.dim(`     Creating field: ${required.name}`));
      const fieldId = await createProjectField(
        project.projectId,
        required.name,
        required.dataType,
        required.options
      );
      // Refresh fields
      fields = await getProjectFields(project.projectId);
    }
  }

  console.log(chalk.dim(`     ✓ Custom fields ready`));

  // Step 4: Add issues to project and set field values
  console.log(chalk.dim("  🔗 Adding issues to project..."));

  // Build a map of issue numbers to roadmap data
  const issueRoadmapData = new Map<number, any>();
  for (const phase of options.roadmap) {
    for (const issueIndex of phase.issues) {
      if (issueIndex < options.issues.length) {
        const issueNumber = options.issues[issueIndex];
        issueRoadmapData.set(issueNumber, {
          startDate: phase.startDate,
          endDate: phase.endDate,
          phase: phase.phase,
        });
      }
    }
  }

  for (const issueNumber of options.issues) {
    try {
      // Get issue node ID
      const issueId = await getIssueNodeId(repo, issueNumber);

      // Add to project
      const itemId = await addIssueToProject(project.projectId, issueId);

      // Set field values (if we have roadmap data)
      const roadmapData = issueRoadmapData.get(issueNumber);
      if (roadmapData) {
        // Set Start Date
        const startDateField = fields.find((f) => f.name === "Start Date");
        if (startDateField) {
          await setProjectItemFieldValue(project.projectId, itemId, startDateField.id, {
            date: roadmapData.startDate,
          });
        }

        // Set Target Date
        const targetDateField = fields.find((f) => f.name === "Target Date");
        if (targetDateField) {
          await setProjectItemFieldValue(project.projectId, itemId, targetDateField.id, {
            date: roadmapData.endDate,
          });
        }
      }

      console.log(chalk.dim(`     ✓ Added issue #${issueNumber}`));
    } catch (error) {
      console.log(chalk.yellow(`     ⚠️  Failed to add issue #${issueNumber}: ${error}`));
    }
  }

  console.log(chalk.dim(`     ✓ All issues added to project`));

  return project.projectUrl;
}
