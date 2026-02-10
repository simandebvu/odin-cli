import { Command } from "commander";
import chalk from "chalk";
import { runIdeation } from "../lib/ideation.js";

export const ideateCommand = new Command("ideate")
  .description("Interrogate your idea before generating a plan")
  .option("-o, --output <file>", "Output file for idea memo", "IDEA_MEMO.md")
  .option("--skip-competition", "Skip competition analysis")
  .option("--auto-plan", "Automatically generate plan if idea passes validation")
  .action(async (options) => {
    console.log(chalk.bold.cyan("\n🔍 Odin Ideation Mode\n"));
    console.log(
      chalk.dim("Let's interrogate this idea before we build anything.\n")
    );

    try {
      const result = await runIdeation({
        outputFile: options.output,
        skipCompetition: options.skipCompetition,
        autoPlan: options.autoPlan,
      });

      if (result.recommendation === "SHIP") {
        console.log(
          chalk.bold.green(
            `\n✅ Recommendation: ${result.recommendation}\n`
          )
        );
        console.log(chalk.green("This idea is worth building."));
        console.log(chalk.dim(`\nIdea memo saved to: ${options.output}\n`));

        if (options.autoPlan) {
          console.log(chalk.yellow("→ Proceeding to plan generation...\n"));
          // TODO: Auto-trigger plan command
        } else {
          console.log(
            chalk.dim(`Next step: ${chalk.bold("gh odin plan --text " + options.output)}\n`)
          );
        }
      } else if (result.recommendation === "PIVOT") {
        console.log(
          chalk.bold.yellow(
            `\n⚠️  Recommendation: ${result.recommendation}\n`
          )
        );
        console.log(chalk.yellow("This idea needs work before you build it.\n"));
        console.log(chalk.dim(result.message));
        console.log(chalk.dim(`\nSee ${options.output} for pivot suggestions.\n`));
      } else {
        console.log(
          chalk.bold.red(
            `\n🛑 Recommendation: ${result.recommendation}\n`
          )
        );
        console.log(chalk.red("Do NOT build this. Save your time.\n"));
        console.log(chalk.dim(result.message));
        console.log(chalk.dim(`\nSee ${options.output} for better alternatives.\n`));
      }
    } catch (error) {
      console.error(chalk.red("\n❌ Error during ideation:"), error);
      process.exit(1);
    }
  });
