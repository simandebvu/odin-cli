# Day 2 Testing Script

Complete test suite to validate all features before demo recording.

**Time estimate:** 3-4 hours
**Goal:** Find and fix bugs before judges see them

---

## Setup

```bash
cd ~/Code/odin-cli

# Ensure latest build
~/.bun/bin/bun run build

# Verify gh CLI auth with project scope
gh auth status
# If needed: gh auth refresh -h github.com -s project

# Clean up previous test outputs
rm -f TEST_*.md IDEA_MEMO.md
```

---

## Test Suite 1: Kill Switch Mode (PARK Path)

**Goal:** Verify Kill Switch correctly rejects weak ideas

### Test 1.1: Generic Todo App (Should PARK)

```bash
node dist/index.js ideate --output TEST_PARK_TODO.md
```

**Input:**
- What: `A simple, beautiful todo list app`
- User: `Anyone who needs to organize tasks`
- Pain: `Existing todo apps are too complicated`
- Trigger: `When they feel overwhelmed`
- Alternatives: `Todoist, Things, Notion`
- Wedge: `Better UX and simpler`
- NOT included: `Mobile app, collaboration`
- Proof: `Get 10 users to try it`
- Risks: `Distribution`, `Feasibility`

**Expected:**
- 🛑 Recommendation: **PARK**
- Message: "This is a feature, not a product"
- Reasoning mentions: saturated market, low differentiation
- Alternatives provided (3+)
- Competition found (Todoist, etc. if search works)

**Verify:**
```bash
cat TEST_PARK_TODO.md | grep "PARK"
cat TEST_PARK_TODO.md | grep "feature, not a product"
```

### Test 1.2: Generic Social Network (Should PARK)

```bash
node dist/index.js ideate --output TEST_PARK_SOCIAL.md
```

**Input:**
- What: `A social network for sharing photos`
- User: `Everyone`
- Pain: `Instagram is confusing`
- Trigger: `When they want to share photos`
- Alternatives: `Instagram, Facebook, Snapchat`
- Wedge: `Easier to use`
- NOT included: `Stories, reels`
- Proof: `Get 100 users`
- Risks: `Distribution`, `Trust`

**Expected:**
- 🛑 Recommendation: **PARK** or **PIVOT**
- Vague user detected ("Everyone")
- Weak wedge ("Easier to use")
- Strong competitors mentioned

**Verify:**
```bash
cat TEST_PARK_SOCIAL.md | grep -E "PARK|PIVOT"
cat TEST_PARK_SOCIAL.md | grep -i "instagram"
```

---

## Test Suite 2: Kill Switch Mode (PIVOT Path)

**Goal:** Verify Kill Switch suggests refinement for medium ideas

### Test 2.1: Developer Tool (Needs Refinement)

```bash
node dist/index.js ideate --output TEST_PIVOT_DEVTOOL.md
```

**Input:**
- What: `A developer dashboard for metrics`
- User: `Software developers`
- Pain: `Hard to track code metrics`
- Trigger: `Sprint planning meetings`
- Alternatives: `GitHub Insights, SonarQube`
- Wedge: `Better visualizations`
- NOT included: `Jira integration`
- Proof: `5 teams use it weekly`
- Risks: `Distribution`, `Adoption`

**Expected:**
- ⚠️ Recommendation: **PIVOT** or **SHIP** (depending on Copilot)
- If PIVOT: alternatives provided
- Vague user might be flagged ("Software developers" is broad)

**Verify:**
```bash
cat TEST_PIVOT_DEVTOOL.md | grep -E "PIVOT|SHIP"
```

---

## Test Suite 3: Kill Switch Mode (SHIP Path)

**Goal:** Verify Kill Switch approves strong ideas

### Test 3.1: Odin Itself (Should SHIP)

```bash
node dist/index.js ideate --output TEST_SHIP_ODIN.md
```

**Input:**
- What: `GitHub CLI extension for validated execution plans with roadmap timelines`
- User: `Solo developers and small teams building products (10-50 people)`
- Pain: `Turning vague ideas into structured work, validating assumptions before building, wasting time on bad ideas`
- Trigger: `Starting a new project, sprint planning, idea validation phase`
- Alternatives: `Manual planning, Linear, Jira, gh-pm, notion`
- Wedge: `GitHub-native roadmap (no custom UI), Kill Switch (brutally honest PARK/PIVOT), Real-time competition search, AI-powered validation, Terminal-first`
- NOT included: `Jira/Linear integration, Multi-org support, Mobile app, Predictive analytics`
- Proof: `3 teams create 5+ validated projects each, reduce bad ideas by 50%`
- Risks: `Distribution`, `Copilot CLI adoption`

**Expected:**
- ✅ Recommendation: **SHIP**
- High scores (7+)
- Clear wedge acknowledged
- Risks provided with experiments
- One-line pitch generated
- Competition found (gh-pm, etc.)

**Verify:**
```bash
cat TEST_SHIP_ODIN.md | grep "SHIP"
cat TEST_SHIP_ODIN.md | grep -E "Clarity.*[7-9]"
cat TEST_SHIP_ODIN.md | grep "gh-pm"
```

---

## Test Suite 4: Competition Search

**Goal:** Verify GitHub API search works correctly

### Test 4.1: CLI Tools (Should Find Many)

```bash
node dist/index.js ideate --output TEST_COMP_CLI.md
```

**Input:**
- What: `A command line tool for GitHub`
- User: `Developers`
- Pain: `GitHub web UI is slow`
- Trigger: `Daily work`
- Alternatives: `GitHub web, GitHub Desktop`
- Wedge: `Terminal native`
- NOT included: `GUI`
- Proof: `100 stars`
- Risks: `Distribution`, `Adoption`

**Expected:**
- Competition found: cli/cli, lazygit, etc.
- Star counts displayed
- Market insights provided
- Integration with Kill Switch (if scores low)

**Verify:**
```bash
cat TEST_COMP_CLI.md | grep "cli/cli"
cat TEST_COMP_CLI.md | grep "⭐"
cat TEST_COMP_CLI.md | grep "Competition Analysis"
```

### Test 4.2: Niche Tool (Should Find Few/None)

```bash
node dist/index.js ideate --output TEST_COMP_NICHE.md
```

**Input:**
- What: `CLI tool for managing quantum computing experiments`
- User: `Quantum computing researchers`
- Pain: `No good CLI tools for quantum workflows`
- Trigger: `Running quantum algorithms`
- Alternatives: `Manual scripts`
- Wedge: `First CLI tool for quantum workflows`
- NOT included: `Visualization`
- Proof: `10 researchers use it`
- Risks: `Small market`, `Feasibility`

**Expected:**
- Few/no competitors found
- "First mover advantage" or "New space" mentioned
- Positive spin on lack of competition

**Verify:**
```bash
cat TEST_COMP_NICHE.md | grep -E "No direct competitors|First mover"
```

### Test 4.3: Skip Competition Flag

```bash
node dist/index.js ideate --skip-competition --output TEST_SKIP_COMP.md
```

**Input:** (any idea)

**Expected:**
- No competition search performed
- Spinner should not appear for competition
- Analysis still completes
- IDEA_MEMO.md has no competition section

**Verify:**
```bash
# Should have no competition section
cat TEST_SKIP_COMP.md | grep -c "Competition Analysis"
# Should return 0
```

---

## Test Suite 5: Plan Generation

**Goal:** Verify plan generation creates GitHub resources

### Test 5.1: Dry Run (Preview Only)

```bash
node dist/index.js plan --text TEST_SHIP_ODIN.md --repo simandebvu/odin-cli-test --dry-run
```

**Expected:**
- Shows preview of what will be created
- Issue count displayed
- Label count displayed
- No actual GitHub resources created

**Verify:**
```bash
# Check dry run output appears
# Should say "Dry run - preview:"
```

### Test 5.2: Full Plan Generation

**⚠️ IMPORTANT:** This creates real GitHub resources!

```bash
node dist/index.js plan --text TEST_SHIP_ODIN.md --repo simandebvu/odin-cli-test
```

**Expected:**
- ✓ Ora spinners show progress
- ✓ Plan generated (X issues, Y labels)
- ✓ Labels created (count matches)
- ✓ Issues created (count matches)
- ✓ Project created (URL provided)
- ✓ Roadmap URL provided

**Verify:**
```bash
# 1. Check issues were created
gh issue list --repo simandebvu/odin-cli-test --limit 20

# 2. Check labels were created
gh label list --repo simandebvu/odin-cli-test

# 3. Open project URL (copy from output)
# Should see:
# - All issues added
# - Custom fields (Priority, Size, Start Date, Target Date)
# - Roadmap view available
```

**Manual verification (in browser):**
1. Open project URL
2. Check all issues are there
3. Click view dropdown → "Roadmap"
4. Verify timeline appears
5. Check Start Date and Target Date fields exist
6. Take screenshots for README

---

## Test Suite 6: Error Handling

**Goal:** Verify graceful failures

### Test 6.1: Invalid Repository

```bash
node dist/index.js plan --text TEST_SHIP_ODIN.md --repo nonexistent/repo-404
```

**Expected:**
- Clear error message
- Suggests checking repo name
- Does not crash

### Test 6.2: No Auth Token

```bash
# Temporarily break auth (don't actually do this if you're not sure!)
# gh auth logout
# node dist/index.js plan --text TEST_SHIP_ODIN.md --repo simandebvu/odin-cli-test
# gh auth login

# Instead, just note: error handling should be clear if auth fails
```

**Expected:**
- Clear message about authentication
- Suggests running `gh auth login`

### Test 6.3: Missing File

```bash
node dist/index.js plan --text NONEXISTENT_FILE.md --repo simandebvu/odin-cli-test
```

**Expected:**
- Clear error: file not found
- Does not crash

---

## Test Suite 7: Edge Cases

### Test 7.1: Very Short Inputs

Test with minimal inputs (1-2 words per answer).

**Expected:**
- Should work (might score low)
- Kill Switch might flag vague answers

### Test 7.2: Very Long Inputs

Test with paragraph-length inputs.

**Expected:**
- Should work
- Keywords still extracted
- Output still readable

### Test 7.3: Special Characters

Test with idea containing special characters: `"Task management: A 'new' approach (v2.0)"`

**Expected:**
- Handles gracefully
- No GraphQL errors
- No escaping issues

---

## Bug Tracking Template

**File:** `BUGS_FOUND.md`

For each bug found, document:

```markdown
## Bug #X: [Brief Description]

**Severity:** Critical / High / Medium / Low

**Steps to reproduce:**
1.
2.
3.

**Expected:**


**Actual:**


**Workaround:**


**Fix priority:** Day 2 / Day 3 / Post-submission
```

---

## Success Criteria

After completing all tests:

- [ ] PARK path works (rejects weak ideas)
- [ ] PIVOT path works (suggests refinement)
- [ ] SHIP path works (approves strong ideas)
- [ ] Competition search finds competitors
- [ ] Competition search handles no results
- [ ] Plan generation creates issues
- [ ] Plan generation creates labels
- [ ] Plan generation creates project
- [ ] Project has custom fields
- [ ] Roadmap view displays correctly
- [ ] Progress spinners appear
- [ ] Error messages are clear
- [ ] No crashes on invalid input

**If all checked:** ✅ Ready for demo recording!

---

## Post-Testing Tasks

1. **Document bugs** in `BUGS_FOUND.md`
2. **Prioritize fixes** (critical bugs = Day 2, nice-to-haves = post-submission)
3. **Update CHANGELOG** with any fixes
4. **Take screenshots** of successful runs
5. **Save example outputs** for documentation

---

## Time Allocation

- Test Suite 1-3 (Kill Switch): 1 hour
- Test Suite 4 (Competition): 30 mins
- Test Suite 5 (Plan Generation): 1 hour
- Test Suite 6-7 (Edge Cases): 30 mins
- Bug documentation: 30 mins
- Fixes (if needed): 1-2 hours

**Total:** 3.5-4.5 hours

---

## Tomorrow Morning Checklist

```bash
# 1. Pull latest
cd ~/Code/odin-cli
git pull origin main

# 2. Fresh build
~/.bun/bin/bun run build

# 3. Start testing
# Follow this script top to bottom

# 4. Document results
# Use BUGS_FOUND.md template

# 5. Take screenshots
# Save to screenshots/ directory

# 6. Commit fixes
git add -A
git commit -m "fix: [description]"
git push origin main
```

---

**Good luck! You got this.** 🚀

*If you find zero bugs, that's suspicious. Test harder.* 😄
