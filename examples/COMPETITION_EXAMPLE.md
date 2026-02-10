# Competition Analysis Example

> **Example output from `gh odin ideate` with competition search**

## Competition Analysis

Found 8 potential competitors on GitHub:

**Top competitors:**
1. [cli/cli](https://github.com/cli/cli) - 37,245⭐ - GitHub's official command line tool
2. [charmbracelet/gum](https://github.com/charmbracelet/gum) - 18,234⭐ - A tool for glamorous shell scripts
3. [jesseduffield/lazygit](https://github.com/jesseduffield/lazygit) - 52,893⭐ - Simple terminal UI for git commands
4. [tj/git-extras](https://github.com/tj/git-extras) - 17,234⭐ - GIT utilities
5. [kamranahmedse/git-standup](https://github.com/kamranahmedse/git-standup) - 7,623⭐ - Recall what you did on the last working day

**Market insights:**

Strengths of existing solutions:
- Established market (cli/cli has 37,245 stars)
- Multiple implementations (Go, JavaScript, Shell, Python)
- Common themes: cli, github, git, automation, developer-tools

Gaps you could exploit:
- No tools combine idea validation + project planning
- Focus on code execution, not product strategy
- Missing "SHIP/PIVOT/PARK" decision framework

**Your edge:** Opportunity to fill gaps in existing solutions

---

## How Competition Data Enhances Kill Switch

**Scenario 1: Strong competitor + weak differentiation**
```
Competitor: cli/cli (37k stars)
Your differentiation score: 4/10
Result: 🛑 PARK - "cli/cli has 37,245⭐ and established user base.
                   Your wedge isn't strong enough."
```

**Scenario 2: No dominant player + clear wedge**
```
Top competitor: 800 stars
Your differentiation score: 8/10
Result: ✅ SHIP - "No dominant player. Good wedge. First mover advantage."
```

**Scenario 3: Inactive competitors + opportunity**
```
Competitors: 5 found, all inactive >6 months
Your scores: All 7+
Result: ✅ SHIP - "Market exists but underserved. Gap to exploit."
```

---

## What Gets Searched

**Keywords extracted from one-liner:**
- "GitHub CLI extension" → keywords: `github`, `extension`, `cli`
- "todo list app" → keywords: `todo`, `list`
- "developer dashboard" → keywords: `developer`, `dashboard`

**GitHub Search Query:**
```
{keywords} in:name,description,readme stars:>50 sort:stars
```

**Results:**
- Top 10 repos by stars
- Description, language, topics
- Last updated date
- Star count

---

*This data feeds into Kill Switch Mode to make smarter PARK/PIVOT/SHIP recommendations*
