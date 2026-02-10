# Odin CLI Features

## Core Features

### 1. Interactive Ideation (`gh odin ideate`)

**What it does:**
- Runs an interactive "founder interview"
- Asks 8 strategic questions
- Analyzes with Copilot CLI
- Applies Kill Switch logic
- Searches GitHub for competitors
- Outputs IDEA_MEMO.md with recommendation

**Questions asked:**
1. What are we building? (one-liner)
2. Who's the user?
3. What pain are they escaping?
4. When do they feel it? (trigger moment)
5. What do they use today?
6. What's your unfair advantage?
7. What's explicitly NOT in MVP?
8. Smallest demo that proves value?
9. Top 2 risks?

**Output:** IDEA_MEMO.md with SHIP/PIVOT/PARK recommendation

---

### 2. Kill Switch Mode

**What it does:**
- Applies strict validation rules
- Detects common founder mistakes
- Recommends PARK for weak ideas
- Provides concrete alternatives

**Rules applied:**
1. **Low scores = PARK** (any score < 5)
2. **No clear wedge = PIVOT** (missing unfair advantage)
3. **Vague user = PIVOT** ("everyone" means no one)
4. **Generic problem + low diff = PARK** (e.g., todo apps)
5. **Strong competitors + weak diff = PARK** (5k+ star repos)

**Example rejections:**
- "This is a feature, not a product"
- "Saturated market with low differentiation"
- "cli/cli has 37k⭐ and your wedge isn't strong enough"

---

### 3. Competition Search

**What it does:**
- Extracts keywords from one-liner
- Searches GitHub repos (stars >50)
- Analyzes top 10 competitors
- Identifies strengths and gaps
- Integrates with Kill Switch

**Data collected:**
- Repository name and URL
- Star count
- Description
- Last updated date
- Programming language
- Topics/tags

**Analysis provided:**
- Market insights (established vs. new)
- Common themes
- Gaps to exploit
- Your competitive edge

**Example output:**
```
Found 8 potential competitors:
1. cli/cli - 37,245⭐
2. jesseduffield/lazygit - 52,893⭐

Insights:
- Established market
- Gap: No tools combine validation + planning
- Your edge: Fill gaps in existing solutions
```

---

### 4. Plan Generation (`gh odin plan`)

**What it does:**
- Reads idea memo or PR description
- Generates PlanSpec via Copilot
- Creates 8-15 GitHub Issues
- Creates labels (type, priority, area, risk)
- Creates GitHub Project v2
- Sets up custom fields
- Adds issues with metadata
- Creates roadmap timeline

**Created resources:**
- Issues with acceptance criteria
- Labels (type:*, priority:*, area:*, risk:*)
- Project with custom fields:
  - Priority (High/Medium/Low)
  - Size (S/M/L/XL)
  - Start Date
  - Target Date
- Roadmap view (GitHub-native timeline)

---

### 5. GitHub Projects v2 Integration

**GraphQL operations:**
- Create project
- Create custom fields (single-select, date)
- Add issues to project
- Set field values
- Get project details

**Custom fields:**
- **Priority** (Single Select): High, Medium, Low
- **Size** (Single Select): S, M, L, XL
- **Start Date** (Date): Roadmap start
- **Target Date** (Date): Roadmap end

**Roadmap view:**
- Open project → View dropdown → "Roadmap"
- Shows Gantt-chart-style timeline
- Start Date → Target Date for each issue
- GitHub-native, no custom UI

---

### 6. Copilot CLI Integration

**How it's used:**
1. **Idea analysis** - Generate SHIP/PIVOT/PARK recommendation
2. **Plan generation** - Create PlanSpec JSON from idea memo
3. **Risk analysis** - Surface assumptions and experiments
4. **Fallback** - Graceful degradation when unavailable

**Prompts:**
- Brutally honest product strategist persona
- Strict scoring criteria (SHIP: 7+, PIVOT: 5-6, PARK: <5)
- JSON output for structured data
- Context-aware (includes competition data)

---

## Feature Comparison

### vs. gh-pm
**gh-pm:**
- CRUD operations for projects/issues
- Manual project setup
- No validation

**Odin:**
- Idea validation first (SHIP/PIVOT/PARK)
- Auto-generates plan with roadmap
- Competition analysis
- Kill Switch rejects weak ideas

### vs. Linear CLI
**Linear CLI:**
- Create issues in Linear
- Import/export
- No ideation

**Odin:**
- Interrogate first
- GitHub-native
- Roadmap timeline
- AI-powered validation

### vs. GitHub Copilot (general)
**Copilot:**
- Code suggestions
- Chat
- PR summaries

**Odin:**
- Product strategy layer
- Execution planning
- Project management
- Idea validation

---

## Technical Features

### Cross-Runtime Support
- Works with Node.js 18+
- Works with Bun 1.0+
- Shared runtime abstraction layer
- No runtime-specific APIs in application code

### Old gh CLI Support
- Works with gh CLI 2.4.0+ (from 2022)
- Uses REST API where CLI commands unavailable
- Graceful fallback for missing features
- Tested on Ubuntu with old gh version

### Error Handling
- Graceful Copilot CLI fallback
- Competition search fallback
- GraphQL error recovery
- Clear error messages with suggestions

### Performance
- Bundles to 1.17 MB
- ~6 seconds to create 12 issues + project
- Sequential operations (can be parallelized)
- GitHub rate limits respected

---

## Coming Soon

### One-Line Pitch Generator
- Auto-generate compelling pitches
- Uses Copilot to craft messages
- Multiple pitch styles (technical, business, casual)

### ICS Export
- Export roadmap as calendar file
- Import into Google Calendar, Outlook, etc.
- Keep GitHub as source of truth

### Batch Operations
- Parallel issue creation
- Faster plan generation
- Progress bars for long operations

### Web Search Integration
- Search beyond GitHub
- Find competitors on Product Hunt, HN, etc.
- More comprehensive market analysis

---

*For usage examples, see the `examples/` directory*
