# GitHub Projects v2 Implementation Guide

## What I Just Built

Full GitHub Projects (v2) integration using GraphQL API. This is the **differentiator** for Odin — the roadmap/calendar view.

## Files Added/Modified

### New Files

1. **`src/lib/graphql.ts`** - Complete GraphQL wrapper for Projects v2
   - `createProjectV2()` - Create new project
   - `getProjectFields()` - Get custom fields
   - `createProjectField()` - Create Priority, Size, Start/Target Date fields
   - `addIssueToProject()` - Add issues to project
   - `setProjectItemFieldValue()` - Set field values (dates, priority, size)
   - `getIssueNodeId()` - Get GitHub node IDs for issues

2. **`src/lib/project-setup.ts`** - High-level project setup orchestration
   - `setupProjectWithMetadata()` - Create project + add issues + set all metadata

### Modified Files

1. **`src/lib/github.ts:108-131`** - Replaced stub with real implementation
2. **`src/lib/planner.ts:46-52`** - Use enhanced project setup

## How It Works

### Project Creation Flow

```typescript
1. Get repository owner ID (required for project creation)
2. Create Project v2 via GraphQL mutation
3. Create custom fields:
   - Priority (Single Select: High/Medium/Low)
   - Size (Single Select: S/M/L/XL)
   - Start Date (Date)
   - Target Date (Date)
4. For each issue:
   - Get issue node ID (GraphQL requires global IDs, not issue numbers)
   - Add issue to project
   - Set Priority field
   - Set Size field
   - Set Start Date (from roadmap phase)
   - Set Target Date (from roadmap phase)
```

### GraphQL Operations Used

All operations go through `gh api graphql` for authentication:

```bash
gh api graphql -f query="..." -FownerId=... -Ftitle=...
```

Key mutations:
- `createProjectV2` - Create project
- `createProjectV2Field` - Create custom fields
- `addProjectV2ItemById` - Add issue to project
- `updateProjectV2ItemFieldValue` - Set field values

## Testing It

### Prerequisites

1. **GitHub CLI authenticated**:
   ```bash
   gh auth status
   gh auth login  # if needed
   ```

2. **Test repository** (create a test repo if needed):
   ```bash
   gh repo create odin-test --public
   cd odin-test
   git init && git commit --allow-empty -m "init"
   git push
   ```

### Full Test Flow

```bash
# 1. Build the CLI
cd ~/Code/odin-cli
~/.bun/bin/bun run build

# 2. Run ideation (creates IDEA_MEMO.md)
node dist/index.js ideate

# 3. Generate plan (DRY RUN first)
node dist/index.js plan \
  --text IDEA_MEMO.md \
  --repo yourusername/odin-test \
  --dry-run

# 4. Actually create issues + project
node dist/index.js plan \
  --text IDEA_MEMO.md \
  --repo yourusername/odin-test
```

### What You'll See

Terminal output:
```
📋 Odin Plan Generation

🤖 Generating plan with Copilot...

📦 Creating GitHub resources...

  ✓ Created 8 labels
  ✓ Created 12 issues
  📊 Creating GitHub Project v2 with full metadata...
     ✓ Project created: https://github.com/you/odin-test/projects/1
  📝 Setting up custom fields...
     ✓ Custom fields ready
  🔗 Adding issues to project with metadata...
     ✓ Added issue #1 with metadata
     ✓ Added issue #2 with metadata
     ...
  ✅ Project setup complete!

✅ Plan generated successfully!

Created 12 issues
Created 8 labels
Project: https://github.com/you/odin-test/projects/1
Roadmap: https://github.com/you/odin-test/projects/1?layout=roadmap
```

### View the Roadmap

Open the Project URL and:
1. Click the view dropdown (top right)
2. Select **"Roadmap"**
3. You'll see a **timeline view** with Start Date → Target Date for each issue

**This is the viral feature** — a GitHub-native calendar plan.

## Troubleshooting

### Error: "Resource not accessible by integration"

**Cause**: GitHub CLI doesn't have `project` scope.

**Fix**:
```bash
gh auth refresh -s project
```

### Error: "Field not found"

**Cause**: Custom field names are case-sensitive.

**Fix**: The code already handles this, but if you manually created fields, ensure they match:
- `Priority` (not `priority`)
- `Size` (not `size`)
- `Start Date` (not `start_date`)
- `Target Date` (not `target_date`)

### Error: "Could not resolve to a node with the global id"

**Cause**: Issue doesn't exist or issue number is wrong.

**Fix**: Check that issues were created successfully. The code logs issue numbers during creation.

## Next Steps

### Polish (High Priority)

1. **Error handling**: Add retries for transient GraphQL failures
2. **Batch operations**: Add issues in parallel (currently sequential)
3. **Progress bar**: Use `ora` spinner for long operations

### Features (Medium Priority)

1. **Update existing project**: Support `--project <number>` to add to existing project
2. **Milestones**: Create GitHub milestones for each roadmap phase
3. **Dependencies**: Use "Tracked by" / "Tracks" issue links for blockers

### Demo (Before Submission)

1. **Record screencast**: Show ideation → plan → roadmap in 2 minutes
2. **Create demo repo**: Pre-populated with example project
3. **Add screenshots**: Roadmap view screenshot in README

## Architecture Notes

### Why GraphQL?

GitHub Projects v2 **only** supports GraphQL. The `gh` CLI has limited Projects support:
- ❌ No `gh project create`
- ❌ No `gh project add-item`
- ✅ Can use `gh api graphql` for full control

### Why Not REST API?

Projects v2 is GraphQL-only. Projects Classic (v1) had REST but is deprecated.

### Performance

Current implementation is sequential:
- ~500ms per issue (add + set 4 fields)
- 12 issues = ~6 seconds

Could be parallelized, but GitHub rate limits apply (5000 req/hour).

## References

- [GitHub Projects v2 API Docs](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)
- [GraphQL API Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [GitHub CLI GraphQL Guide](https://cli.github.com/manual/gh_api)
