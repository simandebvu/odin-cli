# Changelog

All notable changes to Odin CLI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- One-line pitch generator
- .ics export for external calendars
- Batch operations (parallel issue creation)
- Update existing projects
- Web search integration (beyond GitHub)

## [0.1.0] - 2026-02-10

### Added - Day 1 Implementation

#### Core Features
- **Interactive ideation wizard** (`gh odin ideate`)
  - 8 strategic questions
  - Outputs IDEA_MEMO.md with recommendation
  - Skip competition with `--skip-competition`

- **Kill Switch Mode** - Brutally honest validation
  - Strict scoring thresholds (SHIP: 7+, PIVOT: 5-6, PARK: <5)
  - Detects: generic problems, vague users, weak wedges, saturated markets
  - 6 validation rules applied on top of Copilot analysis
  - Provides concrete alternatives for PIVOT/PARK
  - Example outputs: "This is a feature, not a product"

- **Competition Search** - Real-time GitHub API
  - Extracts keywords from idea one-liner
  - Searches GitHub repos (stars >50, top 10 by stars)
  - Analyzes: stars, activity, language, topics, last update
  - Identifies market strengths and gaps
  - Integrates with Kill Switch for smarter recommendations
  - Example: "cli/cli has 37k⭐, your wedge isn't strong enough"

- **Plan generation** (`gh odin plan`)
  - Generates PlanSpec via Copilot CLI
  - Creates 8-15 GitHub Issues with acceptance criteria
  - Creates labels (type:*, priority:*, area:*, risk:*)
  - `--from-pr <number>` to generate from PR description
  - `--text <file>` to generate from markdown file
  - `--dry-run` to preview without creating

- **GitHub Projects v2 integration**
  - Full GraphQL API wrapper (400+ lines)
  - Creates projects with custom fields
  - Custom fields: Priority (High/Med/Low), Size (S/M/L/XL), Start Date, Target Date
  - Adds issues to project with metadata
  - Sets roadmap dates for timeline view
  - Roadmap view: `?layout=roadmap`

#### Technical
- **Cross-runtime support** - Works with Bun and Node.js
- **Old gh CLI compatibility** - Works with gh 2.4.0+ (from 2022)
- **Graceful fallbacks** - Copilot CLI and competition search fallback
- **GraphQL error handling** - Robust error recovery
- **TypeScript** - Full type safety
- **ESM modules** - Modern module system

#### Documentation
- Comprehensive README with examples
- `docs/FEATURES.md` - Complete feature reference
- `IMPLEMENTATION.md` - Technical implementation guide
- `SUBMISSION.md` - Challenge submission details
- `examples/` directory with:
  - `PARK_EXAMPLE.md` - Rejected idea (todo app)
  - `PIVOT_EXAMPLE.md` - Needs work (social network)
  - `COMPETITION_EXAMPLE.md` - Competitor analysis output
  - `EXAMPLE_IDEA_MEMO.md` - Strong idea (SHIP)

### Technical Details

**Dependencies:**
- commander: ^12.0.0
- chalk: ^5.3.0
- inquirer: ^9.2.15
- zod: ^3.22.4
- ora: ^8.0.1

**Bundle size:** 1.17 MB

**Performance:**
- ~6 seconds to create 12 issues + project + fields
- Sequential operations (can be parallelized)

### Known Issues

- Label creation requires newer gh CLI or manual API workaround
- Copilot CLI not available by default (graceful fallback provided)
- Project creation requires `project` scope (use `gh auth refresh -s project`)

### Compatibility

- **Node.js:** 18+
- **Bun:** 1.0+
- **gh CLI:** 2.4.0+ (older versions supported with limited features)
- **OS:** Linux, macOS, Windows (WSL)

---

## Development Log

### 2026-02-10 - Day 1: Foundation + Kill Switch + Competition

**Time invested:** ~8 hours

**Commits:**
1. `fd50486` - Initial release with core features
2. `6aada4b` - Kill Switch Mode implementation
3. `f7d16bd` - Competition Search via GitHub API
4. `6dca59b` - README overhaul

**Lines added:** ~1,500+

**What worked well:**
- GraphQL integration cleaner than expected
- Kill Switch rules easy to implement
- GitHub API search straightforward
- Examples provide clear value demonstration

**What was challenging:**
- Old gh CLI compatibility (no `gh label create`, no `gh auth token`)
- Bun vs Node runtime differences
- Interactive prompts with piped input
- GraphQL variable passing (needed temp file approach)

**Key learnings:**
- Always test with old CLI versions
- Use temp files for complex GraphQL variables
- Graceful fallbacks > perfect features
- Examples are as important as code

---

## Submission Timeline

- **Day 1 (Feb 10):** Core features + Kill Switch + Competition
- **Day 2 (Feb 11):** Testing, polish, progress bars
- **Day 3 (Feb 12):** Demo video + screenshots
- **Day 4 (Feb 13):** Submission prep + DEV.to post
- **Day 5 (Feb 14):** Final review
- **Deadline (Feb 15, 23:59 PT):** Submit!

---

[Unreleased]: https://github.com/simandebvu/odin-cli/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/simandebvu/odin-cli/releases/tag/v0.1.0
