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
2. **🛑 Kill Switch Mode** - Brutally honest SHIP/PIVOT/PARK recommendations
3. **🏆 Competition Search** - Real-time GitHub API analysis of competitors
4. **✅ Reality Check** - Surfaces risks, assumptions, proof tests, differentiation
5. **📊 GitHub-Native Roadmap** - Timeline view with Start/Target dates

**Result:** Validated ideas + GitHub Projects with roadmap dates, not just issue confetti.

---

## 🛑 Kill Switch Mode (Brutally Honest)

**The Problem:** Most founders waste months building products no one wants.

**Odin's Solution:** Kill Switch Mode applies strict validation rules *before* you write any code.

### How It Works

Odin analyzes your idea with **harsh criteria**:
- **Clarity:** Is the problem and solution crystal clear?
- **Differentiation:** Is there a genuine unfair advantage? (not just "better UX")
- **Feasibility:** Can a small team actually build and ship this?

### Recommendation Thresholds

- ✅ **SHIP:** All scores >= 7, clear wedge, specific user
- ⚠️ **PIVOT:** Scores 5-6, idea has potential but needs refinement
- 🛑 **PARK:** Any score < 5, OR saturated market, OR "nice to have" problem

### Examples

**PARK Example:**
```
💡 Idea: "A simple, beautiful todo list app"
🛑 Recommendation: PARK

Why: This is a feature, not a product. Saturated market with
10,000+ competitors. "Simpler and more beautiful" can be copied
in 2 weeks.

Consider instead:
1. Niche down: "Todo list for ADHD developers"
2. Bundle as feature in existing product
3. Solve adjacent, less crowded problem
```

**SHIP Example:**
```
💡 Idea: "GitHub CLI for validated execution plans"
✅ Recommendation: SHIP

Scores: Clarity 8/10, Differentiation 8/10, Feasibility 9/10

Why: Clear problem, strong wedge (GitHub-native), specific user.
Build this.
```

### What Makes This Unique

**Most tools say "yes" to everything.** They'll generate issues for any idea, no matter how weak.

**Odin says "no" to bad ideas.** It saves you from wasting months on products that won't work.

**The Kill Switch catches:**
- Generic problems with no wedge (todo, notes, calendar apps)
- Vague user definitions ("everyone", "anyone")
- Saturated markets with weak differentiation
- Features masquerading as products
- "Nice to have" problems (vitamins, not painkillers)

---

## 🏆 Competition Search (Real GitHub Data)

**The Problem:** You don't know what competitors exist until you've already built.

**Odin's Solution:** Real-time GitHub API search that finds and analyzes competitors *during ideation*.

### How It Works

1. **Extract keywords** from your idea one-liner
2. **Search GitHub** for similar repos (stars >50, top 10 by stars)
3. **Analyze** stars, activity, language, topics, last update
4. **Identify** market strengths and gaps
5. **Integrate** with Kill Switch for smarter recommendations

### What You Get

```
Competition Analysis:

Found 8 potential competitors on GitHub:

Top competitors:
1. cli/cli - 37,245⭐ - GitHub's official command line tool
2. jesseduffield/lazygit - 52,893⭐ - Simple terminal UI for git
3. charmbracelet/gum - 18,234⭐ - Tool for glamorous shell scripts

Market insights:
- Established market (cli/cli has 37k stars)
- Common themes: cli, github, automation, developer-tools
- Gap: No tools combine idea validation + project planning

Your edge: Opportunity to fill gaps in existing solutions
```

### Kill Switch Integration

Competition data makes recommendations smarter:

**Scenario 1: Strong competitor + weak differentiation**
```
Competitor: cli/cli (37k stars)
Your differentiation score: 4/10
Result: 🛑 PARK - "cli/cli has 37,245⭐ and established user base.
                   Your wedge isn't strong enough."
```

**Scenario 2: No dominant player**
```
Top competitor: 800 stars
Your differentiation score: 8/10
Result: ✅ SHIP - "No dominant player. Good wedge. First mover advantage."
```

**Scenario 3: Inactive competitors**
```
Competitors: 5 found, all inactive >6 months
Your scores: All 7+
Result: ✅ SHIP - "Market exists but underserved. Gap to exploit."
```

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

**Output:** `IDEA_MEMO.md` with:
- **SHIP / PIVOT / PARK** recommendation
- Competition analysis (real GitHub data)
- Risk experiments
- Pivot alternatives (if needed)
- One-line pitch (if SHIP)

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
| **Idea interrogation** | ❌ | ❌ | ✅ |
| **Kill Switch (PARK bad ideas)** | ❌ | ❌ | ✅ |
| **Real-time competition search** | ❌ | ❌ | ✅ |
| **Validation/risks** | ❌ | ❌ | ✅ |
| **Roadmap timeline** | ❌ | ❌ | ✅ |
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

1. **Kill Switch Mode** - Brutally honest validation that rejects weak ideas
2. **Real-time competition search** - GitHub API analysis during ideation
3. **GitHub-native timeline** - roadmap view, no custom UI
4. **AI-powered strategic analysis** - SHIP/PIVOT/PARK with reasoning
5. **Concrete alternatives** - Not just "no", but "try this instead"

### Live Demo

- **Demo Project:** https://github.com/users/simandebvu/projects/6
- **Roadmap View:** https://github.com/users/simandebvu/projects/6?layout=roadmap
- **Test Repo:** https://github.com/simandebvu/odin-cli-test

---

## 🗺️ Roadmap

**Completed:**
- [x] GraphQL Projects v2 integration
- [x] Custom fields (Priority, Size, dates)
- [x] Roadmap timeline view
- [x] Cross-runtime support (Bun/Node)
- [x] **Kill Switch Mode** (brutally honest PARK/PIVOT/SHIP)
- [x] **Competition Search** (real-time GitHub API)

**Planned:**
- [ ] One-line pitch generator
- [ ] .ics export for external calendars
- [ ] Batch operations (parallel issue creation)
- [ ] Update existing projects
- [ ] Web search integration (beyond GitHub)

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
