# GitHub Copilot CLI Challenge Submission

## Project Information

**Project Name:** Odin CLI
**Tagline:** AI-powered idea interrogation → validated GitHub execution plans
**Repository:** https://github.com/simandebvu/odin-cli
**Demo Project:** https://github.com/users/simandebvu/projects/6
**Roadmap View:** https://github.com/users/simandebvu/projects/6?layout=roadmap

**Submitted by:** Simba Ndebvu ([@simandebvu](https://github.com/simandebvu))
**Submission Date:** February 2026

---

## Challenge Criteria

### 1. Use of Copilot CLI ✅

**How we use it:**
- Uses `gh copilot suggest` to generate structured PlanSpec JSON from idea memos
- AI-powered idea validation (SHIP/PIVOT/PARK recommendations)
- Risk analysis and assumption surfacing
- Graceful fallback when Copilot CLI unavailable

**Code references:**
- `src/lib/copilot.ts` - Copilot CLI integration
- `src/lib/ideation.ts` - AI-powered idea analysis

**Example:**
```typescript
const analysis = await getCopilotResponse({
  prompt: buildAnalysisPrompt(answers, competition),
  format: "idea-analysis",
});
// Returns: { recommendation: "SHIP", risks: [...], pitch: "..." }
```

### 2. Usability / UX ✅

**What makes it usable:**
- **Wizard-style prompts** - Fast, guided interrogation (no manual typing)
- **Preview mode** - `--dry-run` to see changes before applying
- **GitHub-native output** - No custom UI to learn, uses GitHub Projects
- **Cross-platform** - Works on old gh CLI versions (2.4.0+)
- **Graceful degradation** - Falls back when Copilot unavailable

**UX highlights:**
```bash
# Simple, intuitive commands
gh odin ideate              # Interactive wizard
gh odin plan --text file.md # Generate from file
gh odin plan --from-pr 123  # Generate from PR
```

**Visual design:**
- Clean terminal output with chalk colors
- Progress indicators for long operations
- Clear error messages with suggestions

### 3. Originality / Creativity ✅

**What makes Odin unique:**

| Feature | Others | Odin |
|---------|--------|------|
| Issue creation | ✅ | ✅ |
| Project creation | ✅ | ✅ |
| **Idea interrogation** | ❌ | ✅ |
| **Validation (SHIP/PIVOT/PARK)** | ❌ | ✅ |
| **Roadmap timeline** | ❌ | ✅ |
| **Competition awareness** | ❌ | ✅ |
| **Risk experiments** | ❌ | ✅ |

**The core innovation:**
> Most tools are **mechanical** (text → issues). Odin is **strategic** (interrogate → validate → plan).

**The viral feature:**
GitHub-native roadmap timeline with Start/Target dates. No custom UI—uses GitHub Projects v2 Roadmap view.

---

## Technical Implementation

### Architecture

```
Input (Idea/PR) → Interrogation → Copilot Analysis → GitHub API → Roadmap
```

**Key technologies:**
- TypeScript + Node.js/Bun
- GitHub GraphQL API (Projects v2)
- GitHub REST API (Issues/Labels)
- Commander.js (CLI framework)
- Inquirer (Interactive prompts)

**GraphQL Integration:**
- 400+ lines of GitHub Projects v2 GraphQL wrapper
- Creates projects, custom fields (Priority, Size, dates)
- Adds issues with metadata
- Sets roadmap timeline

**Code highlights:**
- `src/lib/graphql.ts` - Complete GraphQL wrapper
- `src/lib/project-setup.ts` - Project orchestration
- `src/lib/runtime.ts` - Cross-runtime utils (Bun/Node)

### Performance

- Bundles to 1.16 MB
- ~6 seconds to create 12 issues + project + fields
- Works offline (uses fallback when Copilot unavailable)

---

## Demo Materials

### Live Demo

1. **Test Repository:** https://github.com/simandebvu/odin-cli-test
2. **Demo Project:** https://github.com/users/simandebvu/projects/6
3. **Roadmap View:** https://github.com/users/simandebvu/projects/6?layout=roadmap

### Example Output

**Idea Memo:**
```markdown
## One-liner
Developer productivity dashboard for engineering teams

## Recommendation: ✅ SHIP
Clarity: 8/10, Differentiation: 7/10, Feasibility: 8/10

## One-line pitch
Terminal-native dev team dashboard that aggregates GitHub + deployments
```

**Generated Plan:**
- 12 issues with acceptance criteria
- 8 labels (type:*, priority:*, area:*, risk:*)
- GitHub Project with Priority, Size, Start Date, Target Date fields
- Roadmap timeline spanning 4 weeks

### Video Demo (2 minutes)

**Script:**
1. Problem (15s) - Issue generators are mechanical, not strategic
2. Ideation (30s) - Interactive interrogation, SHIP/PIVOT/PARK
3. Plan Generation (30s) - Creates issues, project, roadmap
4. Roadmap View (30s) - GitHub-native timeline
5. Differentiator (15s) - Strategic, not mechanical

---

## Comparison with Existing Tools

### vs. gh-pm
- **gh-pm:** CRUD operations for projects/issues
- **Odin:** Idea validation + execution planning + roadmap

### vs. Linear CLI
- **Linear CLI:** Create issues in Linear
- **Odin:** Interrogate first, GitHub-native, roadmap timeline

### vs. GitHub Copilot (general)
- **Copilot:** Code suggestions
- **Odin:** Product strategy + execution planning

**Odin fills a gap:** Strategic planning layer on top of GitHub's execution layer.

---

## Why This Wins

### 1. Addresses Real Pain
Developers waste time creating issues for ideas that shouldn't be built. Odin validates ideas first.

### 2. GitHub-Native
No custom UI to learn. Uses GitHub Projects Roadmap view (familiar to all GitHub users).

### 3. AI-Powered Strategy
Not just task generation—surfaces risks, assumptions, competition, and recommends SHIP/PIVOT/PARK.

### 4. Screenshot-Worthy
The roadmap timeline is the "viral" feature. Seeing your plan as a Gantt chart is satisfying.

### 5. Extensible
Built for the gh CLI extension ecosystem. Easy to install, update, and extend.

---

## Roadmap (Post-Challenge)

**Short-term (Q1 2026):**
- [ ] Competition search (GitHub API + web)
- [ ] Kill switch mode (honest "this is a feature, not a product" feedback)
- [ ] One-line pitch generator
- [ ] .ics export for external calendars

**Long-term:**
- [ ] Multi-repo support
- [ ] Team collaboration features
- [ ] Integration with Linear/Jira (import ideas)
- [ ] AI-powered sprint planning

---

## Acknowledgments

- GitHub Copilot CLI Challenge team
- GitHub Projects v2 API documentation
- The gh CLI maintainers
- The Norse god Odin (for inspiring the name)

---

## Contact

**GitHub:** [@simandebvu](https://github.com/simandebvu)
**Repository:** https://github.com/simandebvu/odin-cli
**Issues:** https://github.com/simandebvu/odin-cli/issues

---

**Built with ❤️ using GitHub Copilot CLI**

*"See the future. Plan strategically. Ship confidently."*
