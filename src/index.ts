#!/usr/bin/env node

import { Command } from "commander";
import { ideateCommand } from "./commands/ideate.js";
import { planCommand } from "./commands/plan.js";

const program = new Command();

program
  .name("gh odin")
  .description(
    "Turn fuzzy intent into validated GitHub execution plans\n" +
    "Interrogate ideas, validate assumptions, generate roadmaps"
  )
  .version("0.1.0");

// gh odin ideate
program.addCommand(ideateCommand);

// gh odin plan
program.addCommand(planCommand);

program.parse();
