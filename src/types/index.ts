export interface IdeationOptions {
  outputFile: string;
  skipCompetition: boolean;
  autoPlan: boolean;
}

export interface IdeationResult {
  recommendation: "SHIP" | "PIVOT" | "PARK";
  message: string;
  memo: string;
  competition: any;
}

export interface PlanOptions {
  source:
    | { type: "pr"; number: number }
    | { type: "file"; path: string };
  repo?: string;
  project?: string;
  dryRun?: boolean;
}

export interface PlanResult {
  issues: any[];
  labels: any[];
  project?: string;
  projectUrl: string;
  roadmapUrl: string;
}

export interface PlanSpec {
  projectName: string;
  issues: Array<{
    title: string;
    description: string;
    acceptanceCriteria: string[];
    labels: string[];
    size: "S" | "M" | "L";
    priority: "high" | "medium" | "low";
  }>;
  labels: Array<{
    name: string;
    color: string;
    description: string;
  }>;
  roadmap: Array<{
    phase: string;
    startDate: string;
    endDate: string;
    issues: number[];
  }>;
}
