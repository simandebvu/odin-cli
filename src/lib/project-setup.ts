import chalk from "chalk";
import ora from "ora";
import type { CreatedIssue } from "./github.js";
import type { PlanSpec } from "../types/index.js";

/**
 * Enhanced project setup with priority and size field mapping
 */
export async function setupProjectWithMetadata(
  repo: string,
  projectName: string,
  issues: CreatedIssue[],
  planSpec: PlanSpec
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

  const setupSpinner = ora("Setting up project structure...").start();

  // Step 1: Get repository owner ID
  const { ownerId } = await getRepositoryOwner(repo);

  // Step 2: Create project
  const project = await createProjectV2(ownerId, projectName);
  setupSpinner.text = "Project created, adding custom fields...";

  // Step 3: Setup custom fields
  let fields = await getProjectFields(project.projectId);

  const requiredFields = [
    { name: "Priority", dataType: "SINGLE_SELECT" as const, options: ["High", "Medium", "Low"] },
    { name: "Size", dataType: "SINGLE_SELECT" as const, options: ["S", "M", "L", "XL"] },
    { name: "Start Date", dataType: "DATE" as const },
    { name: "Target Date", dataType: "DATE" as const },
  ];

  for (const required of requiredFields) {
    const existing = fields.find((f) => f.name === required.name);
    if (!existing) {
      setupSpinner.text = `Creating field: ${required.name}...`;
      await createProjectField(
        project.projectId,
        required.name,
        required.dataType,
        required.options
      );
    }
  }

  // Refresh fields after creation
  fields = await getProjectFields(project.projectId);
  setupSpinner.succeed("Custom fields configured (Priority, Size, Start/Target Date)");

  // Step 4: Build roadmap mapping
  const issueMetadata = new Map<number, any>();
  for (const phase of planSpec.roadmap) {
    for (const issueIndex of phase.issues) {
      if (issueIndex < planSpec.issues.length) {
        const issueNumber = issues[issueIndex]?.number;
        if (issueNumber) {
          issueMetadata.set(issueNumber, {
            startDate: phase.startDate,
            endDate: phase.endDate,
            phase: phase.phase,
            priority: planSpec.issues[issueIndex].priority,
            size: planSpec.issues[issueIndex].size,
          });
        }
      }
    }
  }

  // Step 5: Add issues with metadata
  const addIssuesSpinner = ora(`Adding ${issues.length} issues to project...`).start();
  let addedCount = 0;

  for (const issue of issues) {
    try {
      const issueId = await getIssueNodeId(repo, issue.number);
      const itemId = await addIssueToProject(project.projectId, issueId);

      const metadata = issueMetadata.get(issue.number);
      if (metadata) {
        // Set Priority
        const priorityField = fields.find((f) => f.name === "Priority");
        if (priorityField && metadata.priority) {
          const priorityValue = metadata.priority.charAt(0).toUpperCase() + metadata.priority.slice(1);
          const optionId = findOrCreateOption(priorityField, priorityValue);
          if (optionId) {
            await setProjectItemFieldValue(project.projectId, itemId, priorityField.id, {
              singleSelectOptionId: optionId,
            });
          }
        }

        // Set Size
        const sizeField = fields.find((f) => f.name === "Size");
        if (sizeField && metadata.size) {
          const optionId = findOrCreateOption(sizeField, metadata.size);
          if (optionId) {
            await setProjectItemFieldValue(project.projectId, itemId, sizeField.id, {
              singleSelectOptionId: optionId,
            });
          }
        }

        // Set Start Date
        const startDateField = fields.find((f) => f.name === "Start Date");
        if (startDateField && metadata.startDate) {
          await setProjectItemFieldValue(project.projectId, itemId, startDateField.id, {
            date: metadata.startDate,
          });
        }

        // Set Target Date
        const targetDateField = fields.find((f) => f.name === "Target Date");
        if (targetDateField && metadata.endDate) {
          await setProjectItemFieldValue(project.projectId, itemId, targetDateField.id, {
            date: metadata.endDate,
          });
        }
      }

      addedCount++;
      addIssuesSpinner.text = `Adding issues to project... (${addedCount}/${issues.length})`;
    } catch (error) {
      // Silent fail, continue with other issues
    }
  }

  addIssuesSpinner.succeed(`Added ${addedCount} issues with metadata to project`);
  return project.projectUrl;
}
