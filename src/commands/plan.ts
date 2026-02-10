import { Command } from "commander";
import chalk from "chalk";
import { generatePlan } from "../lib/planner.js";

export const planCommand = new Command("plan")
  .description("Generate GitHub issues, labels, and project roadmap")
  .option("--from-pr <number>", "Generate plan from PR description")
  .option("--text <file>", "Generate plan from markdown file")
  .option("--repo <owner/name>", "Target repository (defaults to current)")
  .option("--project <number|url>", "Target project (or 'auto' to create)")
  .option("--dry-run", "Preview without creating anything")
  .action(async (options) => {
    console.log(chalk.bold.cyan("\n📋 Odin Plan Generation\n"));

    if (!options.fromPr && !options.text) {
      console.error(
        chalk.red("❌ Error: Must specify --from-pr or --text\n")
      );
      console.log(
        chalk.dim("Examples:")
      );
      console.log(chalk.dim("  gh odin plan --from-pr 128"));
      console.log(chalk.dim("  gh odin plan --text IDEA_MEMO.md\n"));
      process.exit(1);
    }

    try {
      const result = await generatePlan({
        source: options.fromPr
          ? { type: "pr", number: parseInt(options.fromPr) }
          : { type: "file", path: options.text },
        repo: options.repo,
        project: options.project,
        dryRun: options.dryRun,
      });

      if (options.dryRun) {
        console.log(chalk.yellow("\n🔍 Dry run - preview:\n"));
        console.log(chalk.dim(`Issues to create: ${result.issues.length}`));
        console.log(chalk.dim(`Labels to create: ${result.labels.length}`));
        console.log(
          chalk.dim(
            `Project: ${result.project ? result.project : "auto-create"}`
          )
        );
      } else {
        console.log(chalk.green("\n✅ Plan generated successfully!\n"));
        console.log(chalk.dim(`Created ${result.issues.length} issues`));
        console.log(chalk.dim(`Created ${result.labels.length} labels`));
        console.log(
          chalk.dim(`Project: ${result.projectUrl}`)
        );
        console.log(chalk.dim(`Roadmap: ${result.roadmapUrl}\n`));
      }
    } catch (error) {
      console.error(chalk.red("\n❌ Error generating plan:"), error);
      process.exit(1);
    }
  });
