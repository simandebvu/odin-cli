# Test Cases for Kill Switch Mode

## Test 1: Generic Todo App (Should PARK)
```bash
gh odin ideate
```

**Input:**
- What: "A simple todo list app"
- User: "Anyone who needs to organize tasks"
- Pain: "Existing todo apps are too complicated"
- Wedge: "Better UX"
- Not included: "Mobile app"
- Proof: "Get 10 users"
- Risks: Distribution, Feasibility

**Expected:** 🛑 PARK - "This is a feature, not a product"

---

## Test 2: Vague Social Network (Should PIVOT)
```bash
gh odin ideate
```

**Input:**
- What: "A social network for developers"
- User: "Developers"
- Pain: "Twitter is noisy"
- Wedge: "Better for tech discussions"
- Not included: "DMs"
- Proof: "100 weekly users"
- Risks: Distribution, Network effects

**Expected:** ⚠️ PIVOT - "No clear wedge, user too broad"

---

## Test 3: Strong Idea (Should SHIP)
```bash
gh odin ideate
```

**Input:**
- What: "GitHub CLI extension for validated execution plans with roadmap timeline"
- User: "Solo developers and small teams building products"
- Pain: "Turning vague ideas into structured work, validating assumptions before building"
- Wedge: "GitHub-native roadmap view (no custom UI), AI-powered validation (SHIP/PIVOT/PARK), works with gh CLI"
- Not included: "Jira integration, multi-org support"
- Proof: "3 teams use it for real projects, create 5+ projects each"
- Risks: Distribution, Copilot CLI adoption

**Expected:** ✅ SHIP - Strong scores, clear wedge
