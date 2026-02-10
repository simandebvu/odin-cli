import chalk from "chalk";

/**
 * GitHub Projects v2 GraphQL operations
 * Docs: https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects
 */

export interface ProjectField {
  id: string;
  name: string;
  dataType: "TEXT" | "SINGLE_SELECT" | "DATE" | "NUMBER";
  options?: Array<{ id: string; name: string }>;
}

export interface CreateProjectResult {
  projectId: string;
  projectNumber: number;
  projectUrl: string;
}

/**
 * Execute GraphQL query via gh CLI
 */
async function graphql(query: string, variables: Record<string, any> = {}): Promise<any> {
  const { spawnCommand } = await import("./runtime.js");
  const { writeFile, unlink } = await import("fs/promises");
  const { tmpdir } = await import("os");
  const { join } = await import("path");

  // For complex variables, write to a temp file and use --input
  const tempFile = join(tmpdir(), `graphql-${Date.now()}.json`);
  await writeFile(tempFile, JSON.stringify({ query, variables }), "utf-8");

  try {
    const result = await spawnCommand(
      ["gh", "api", "graphql", "--input", tempFile],
      { stdout: "pipe", stderr: "pipe" }
    );

    if (result.stderr && !result.stdout) {
      throw new Error(`GraphQL error: ${result.stderr}`);
    }

    const parsed = JSON.parse(result.stdout);
    return parsed;
  } catch (error) {
    console.error(chalk.red("Failed to execute GraphQL:"), error);
    throw error;
  } finally {
    // Clean up temp file
    try {
      await unlink(tempFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Get repository owner ID (required for project creation)
 */
export async function getRepositoryOwner(repo: string): Promise<{ ownerId: string; ownerType: "USER" | "ORGANIZATION" }> {
  const [owner, name] = repo.split("/");

  const query = `
    query($owner: String!) {
      repositoryOwner(login: $owner) {
        ... on User {
          id
          __typename
        }
        ... on Organization {
          id
          __typename
        }
      }
    }
  `;

  const result = await graphql(query, { owner });
  return {
    ownerId: result.data.repositoryOwner.id,
    ownerType: result.data.repositoryOwner.__typename === "Organization" ? "ORGANIZATION" : "USER",
  };
}

/**
 * Create a new Project (v2)
 */
export async function createProjectV2(
  ownerId: string,
  projectName: string
): Promise<CreateProjectResult> {
  const mutation = `
    mutation($ownerId: ID!, $title: String!) {
      createProjectV2(input: { ownerId: $ownerId, title: $title }) {
        projectV2 {
          id
          number
          url
        }
      }
    }
  `;

  const result = await graphql(mutation, { ownerId, title: projectName });
  const project = result.data.createProjectV2.projectV2;

  return {
    projectId: project.id,
    projectNumber: project.number,
    projectUrl: project.url,
  };
}

/**
 * Get project fields (for setting custom field values)
 */
export async function getProjectFields(projectId: string): Promise<ProjectField[]> {
  const query = `
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
                dataType
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                dataType
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await graphql(query, { projectId });
  return result.data.node.fields.nodes;
}

/**
 * Create custom field in project
 */
export async function createProjectField(
  projectId: string,
  fieldName: string,
  dataType: "TEXT" | "SINGLE_SELECT" | "DATE" | "NUMBER",
  options?: string[]
): Promise<string> {
  const colors = ["GRAY", "BLUE", "GREEN", "YELLOW", "ORANGE", "RED", "PINK", "PURPLE"];

  const mutation = `
    mutation($projectId: ID!, $name: String!, $dataType: ProjectV2CustomFieldType!, $options: [ProjectV2SingleSelectFieldOptionInput!]) {
      createProjectV2Field(input: {
        projectId: $projectId
        dataType: $dataType
        name: $name
        singleSelectOptions: $options
      }) {
        projectV2Field {
          ... on ProjectV2Field {
            id
          }
          ... on ProjectV2SingleSelectField {
            id
          }
        }
      }
    }
  `;

  const singleSelectOptions = options?.map((name, index) => ({
    name,
    color: colors[index % colors.length],
    description: name,
  }));

  const result = await graphql(mutation, {
    projectId,
    name: fieldName,
    dataType,
    options: singleSelectOptions || null,
  });

  if (!result?.data?.createProjectV2Field?.projectV2Field?.id) {
    throw new Error(`Failed to create field ${fieldName}: ${JSON.stringify(result)}`);
  }

  return result.data.createProjectV2Field.projectV2Field.id;
}

/**
 * Add issue to project
 */
export async function addIssueToProject(
  projectId: string,
  issueId: string
): Promise<string> {
  const mutation = `
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item {
          id
        }
      }
    }
  `;

  const result = await graphql(mutation, { projectId, contentId: issueId });
  return result.data.addProjectV2ItemById.item.id;
}

/**
 * Get issue node ID from issue number
 */
export async function getIssueNodeId(repo: string, issueNumber: number): Promise<string> {
  const [owner, name] = repo.split("/");

  const query = `
    query($owner: String!, $name: String!, $issueNumber: Int!) {
      repository(owner: $owner, name: $name) {
        issue(number: $issueNumber) {
          id
        }
      }
    }
  `;

  const result = await graphql(query, { owner, name, issueNumber });
  return result.data.repository.issue.id;
}

/**
 * Set field value for project item
 */
export async function setProjectItemFieldValue(
  projectId: string,
  itemId: string,
  fieldId: string,
  value: string | { date?: string; singleSelectOptionId?: string; number?: number }
): Promise<void> {
  let mutation: string;
  let variables: any = { projectId, itemId, fieldId };

  if (typeof value === "string") {
    // Text field
    mutation = `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: String!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { text: $value }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `;
    variables.value = value;
  } else if (value.date) {
    // Date field
    mutation = `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { date: $date }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `;
    variables.date = value.date;
  } else if (value.singleSelectOptionId) {
    // Single select field
    mutation = `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { singleSelectOptionId: $optionId }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `;
    variables.optionId = value.singleSelectOptionId;
  } else if (value.number !== undefined) {
    // Number field
    mutation = `
      mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $number: Float!) {
        updateProjectV2ItemFieldValue(input: {
          projectId: $projectId
          itemId: $itemId
          fieldId: $fieldId
          value: { number: $number }
        }) {
          projectV2Item {
            id
          }
        }
      }
    `;
    variables.number = value.number;
  } else {
    throw new Error("Invalid field value type");
  }

  await graphql(mutation, variables);
}

/**
 * Find or create a single-select option
 */
export function findOrCreateOption(
  field: ProjectField,
  optionName: string
): string | null {
  if (!field.options) return null;
  const option = field.options.find((opt) => opt.name.toLowerCase() === optionName.toLowerCase());
  return option?.id || null;
}
