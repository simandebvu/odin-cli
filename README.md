# 🔱 Odin CLI

> **AI-powered idea interrogation → validated GitHub execution plans**

GitHub CLI extension for the [GitHub Copilot CLI Challenge](https://dev.to/github/github-copilot-cli-challenge-5fio) that turns fuzzy intent into structured, validated GitHub Projects with roadmap timelines.

[![Demo](https://img.shields.io/badge/Demo-Live-green)](https://github.com/users/simandebvu/projects/6?layout=roadmap)
[![GitHub CLI](https://img.shields.io/badge/gh-extension-purple)](https://cli.github.com/)

## 🎯 The Problem

Most "issue generator" tools are **mechanical**: dump text → create issues → done.

But shipping software isn't just about task lists—it's about **validating ideas**, **understanding risks**, and **creating executable roadmaps**.

## 💡 The Odin Difference

**Odin is strategic, not mechanical.**

### The Flow

```
Idea → Interrogation → Validation → GitHub-Native Execution Plan
```

### The Hook

1. **🔍 Interrogation Mode** - Fast "founder interview" before creating anything
2. **✅ Reality Check** - Surfaces risks, assumptions, proof tests, differentiation
3. **🏆 Competition Sniff** - Grounded analysis of similar tools
4. **📊 GitHub-Native Roadmap** - Timeline view with Start/Target dates
5. **🛑 Kill Switch Honesty** - "This is a feature, not a product" when needed

**Result:** GitHub Project with roadmap dates, not just issue confetti.

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repo
git clone https://github.com/simandebvu/odin-cli.git
cd odin-cli

# Install dependencies (requires Bun or Node.js)
npm install
# or
bun install

# Build
npm run build
# or
bun run build

# Install as gh extension
gh extension install .
```

### Prerequisites

- GitHub CLI (`gh`) authenticated with `project` scope
- Node.js 18+ or Bun 1.0+

```bash
# Grant project scope
gh auth refresh -h github.com -s project
```

---

## 🎬 Demo

### 1. Interrogate Your Idea

```bash
gh odin ideate
```

**Interactive wizard asks:**
- What are we building? (one-liner)
- Who's the user and what pain are they escaping?
- What's your unfair advantage?
- What's explicitly NOT in MVP?
- What's the smallest proof test?
- Top 2 risks?

**Output:** `IDEA_MEMO.md` with recommendation: **SHIP / PIVOT / PARK**

### 2. Generate Execution Plan

```bash
gh odin plan --text IDEA_MEMO.md --repo owner/name
```

**Creates:**
- ✅ 8-15 GitHub Issues with acceptance criteria
- ✅ Labels (type:*, priority:*, area:*, risk:*)
- ✅ GitHub Project v2 with custom fields
- ✅ **Roadmap Timeline** (Start Date → Target Date)

### 3. View the Roadmap (The Viral Feature)

Open your project → View dropdown → **"Roadmap"**

**You'll see:** GitHub-native Gantt chart with your execution timeline.

![Roadmap Example](https://github.com/users/simandebvu/projects/6?layout=roadmap)

---

## 🏗️ Architecture

```
odin-cli/
├── src/
│   ├── commands/
│   │   ├── ideate.ts       # Interactive interrogation wizard
│   │   └── plan.ts         # Plan generation from text/PR
│   ├── lib/
│   │   ├── graphql.ts      # GitHub Projects v2 GraphQL API
│   │   ├── github.ts       # REST API for issues/labels
│   │   ├── copilot.ts      # Copilot CLI integration
│   │   ├── ideation.ts     # Core ideation logic
│   │   ├── planner.ts      # Plan generation
│   │   ├── project-setup.ts # Project orchestration
│   │   └── runtime.ts      # Cross-runtime utils (Bun/Node)
│   └── types/
│       └── index.ts        # TypeScript types
└── dist/
    └── index.js            # Bundled CLI (1.16 MB)
```

### Tech Stack

- **Runtime:** Node.js / Bun
- **Language:** TypeScript
- **CLI Framework:** Commander.js
- **Prompts:** Inquirer
- **GitHub Integration:**
  - `gh` CLI for issues/labels
  - GraphQL API for Projects v2
- **AI:** GitHub Copilot CLI (optional, has fallback)

---

## 🎯 Why This Wins the Challenge

### 1. **Use of Copilot CLI** ✅
- Uses `gh copilot suggest` to generate PlanSpec JSON
- Graceful fallback when Copilot unavailable
- AI-powered idea validation and risk analysis

### 2. **Usability/UX** ✅
- Wizard-style prompts (fast, clear)
- Preview mode (`--dry-run`)
- GitHub-native output (no custom UI to learn)
- Works with old gh CLI versions (2.4.0+)

### 3. **Originality** ✅
- **Interrogation before execution** - validates ideas first
- **Roadmap timeline** - GitHub Projects with dates, not just issues
- **Kill switch honesty** - tells you when to pivot
- **Competition awareness** - surfaces similar tools

### Comparison

| Feature | gh-pm | Linear CLI | Odin |
|---------|-------|------------|------|
| Create issues | ✅ | ✅ | ✅ |
| Create project | ✅ | ✅ | ✅ |
| Idea interrogation | ❌ | ❌ | ✅ |
| Validation/risks | ❌ | ❌ | ✅ |
| Roadmap timeline | ❌ | ❌ | ✅ |
| Competition analysis | ❌ | ❌ | ✅ |
| AI-powered | ❌ | ❌ | ✅ |

---

## 📖 Commands

### `gh odin ideate`

Interrogate your idea before generating anything.

**Options:**
- `-o, --output <file>` - Output file (default: `IDEA_MEMO.md`)
- `--skip-competition` - Skip competition analysis
- `--auto-plan` - Auto-generate plan if idea passes

**Example:**
```bash
gh odin ideate --output my-idea.md
```

### `gh odin plan`

Generate GitHub issues, labels, and project roadmap.

**Options:**
- `--from-pr <number>` - Generate from PR description
- `--text <file>` - Generate from markdown file
- `--repo <owner/name>` - Target repository (default: current)
- `--project <number>` - Target project (default: auto-create)
- `--dry-run` - Preview without creating

**Examples:**
```bash
# From idea memo
gh odin plan --text IDEA_MEMO.md --repo owner/name

# From PR description
gh odin plan --from-pr 128 --repo owner/name

# Dry run (preview)
gh odin plan --text IDEA_MEMO.md --dry-run
```

---

## 🔧 Development

### Setup

```bash
git clone https://github.com/simandebvu/odin-cli.git
cd odin-cli
bun install  # or npm install
```

### Build

```bash
bun run build  # or npm run build
```

### Test Locally

```bash
# Run without installing
node dist/index.js ideate
node dist/index.js plan --text TEST_IDEA.md --repo your/repo

# Install as gh extension (dev mode)
gh extension install .
gh odin --help
```

### Project Structure

- `src/lib/graphql.ts` - GitHub Projects v2 GraphQL wrapper (400+ lines)
- `src/lib/github.ts` - REST API for issues/labels
- `src/lib/runtime.ts` - Cross-runtime utilities (Bun/Node compatible)
- `IMPLEMENTATION.md` - Full implementation guide

---

## 🎥 Video Demo Script (2 minutes)

**0:00 - Problem (15s)**
"Most issue generators just dump tasks. But great products need validation first."

**0:15 - Ideation (30s)**
```bash
gh odin ideate
# Show interactive prompts
# Show IDEA_MEMO.md output with SHIP/PIVOT/PARK
```

**0:45 - Plan Generation (30s)**
```bash
gh odin plan --text IDEA_MEMO.md --repo demo/repo
# Show terminal output:
# - Creating issues
# - Creating project
# - Setting up roadmap
```

**1:15 - Roadmap View (30s)**
- Open GitHub Project
- Switch to Roadmap view
- Show timeline with Start/Target dates
- "This is GitHub-native—no custom tools to learn"

**1:45 - Differentiator (15s)**
"Odin doesn't just create issues—it interrogates ideas, validates assumptions, and creates executable roadmaps. That's the difference."

---

## 🏆 Challenge Submission

**Submitted by:** [@simandebvu](https://github.com/simandebvu)
**Submission Date:** February 2026
**Challenge:** [GitHub Copilot CLI Challenge](https://dev.to/github/github-copilot-cli-challenge-5fio)

### What Makes This Unique

1. **Idea validation comes first** - interrogation before execution
2. **GitHub-native timeline** - roadmap view is the viral feature
3. **AI-powered risk analysis** - surfaces assumptions and experiments
4. **Kill switch honesty** - recommends PIVOT/PARK when needed

### Live Demo

- **Demo Project:** https://github.com/users/simandebvu/projects/6
- **Roadmap View:** https://github.com/users/simandebvu/projects/6?layout=roadmap
- **Test Repo:** https://github.com/simandebvu/odin-cli-test

---

## 🗺️ Roadmap

- [x] GraphQL Projects v2 integration
- [x] Custom fields (Priority, Size, dates)
- [x] Roadmap timeline view
- [x] Cross-runtime support (Bun/Node)
- [ ] Competition search (GitHub API + web)
- [ ] Kill switch mode (honest feedback)
- [ ] One-line pitch generator
- [ ] .ics export for external calendars
- [ ] Batch operations (parallel issue creation)
- [ ] Update existing projects

---

## 🤝 Contributing

This is a GitHub Copilot CLI Challenge entry. Contributions welcome after February 15, 2026.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- GitHub Copilot CLI Challenge
- GitHub Projects v2 API
- The Norse god Odin (for the name inspiration—all-seeing, strategic planning)

---

**Built with ❤️ using GitHub Copilot CLI**

*"See the future. Plan strategically. Ship confidently."*
