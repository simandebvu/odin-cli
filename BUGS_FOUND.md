# Bugs Found During Testing

Template for tracking bugs found during Day 2 testing.

---

## Bug #1: [Example - Delete this]

**Severity:** Medium

**Steps to reproduce:**
1. Run `gh odin ideate`
2. Enter special characters in one-liner: `Todo app (v2.0) - "the best"`
3. Complete wizard

**Expected:**
Special characters handled gracefully

**Actual:**
GraphQL error due to unescaped quotes

**Workaround:**
Avoid quotes in one-liner

**Fix priority:** Day 2

**Status:** ❌ Not fixed / ✅ Fixed in commit [hash]

---

## Bug Template (Copy for each bug)

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

**Status:** ❌ Not fixed / ✅ Fixed in commit [hash]

---

## Testing Notes

### Date: [YYYY-MM-DD]

**Tester:**

**Test suites completed:**
- [ ] Test Suite 1: Kill Switch PARK
- [ ] Test Suite 2: Kill Switch PIVOT
- [ ] Test Suite 3: Kill Switch SHIP
- [ ] Test Suite 4: Competition Search
- [ ] Test Suite 5: Plan Generation
- [ ] Test Suite 6: Error Handling
- [ ] Test Suite 7: Edge Cases

**Total bugs found:** 0

**Critical bugs:** 0

**Bugs fixed:** 0

**Bugs deferred:** 0

**Overall status:** ✅ Ready for demo / ⚠️ Needs fixes / ❌ Blocked

---

## Bug Priority Definitions

**Critical:** Blocks core functionality, must fix before submission
- Example: Crashes on basic input, fails to create project

**High:** Major feature doesn't work as expected, should fix Day 2
- Example: Competition search always fails, wrong recommendation

**Medium:** Minor feature issue, annoying but not blocking
- Example: Poor error messages, formatting issues

**Low:** Polish items, nice to have
- Example: Typos, spinner text improvements

---

## Quick Fixes Log

Small fixes that don't warrant a full bug entry:

- `[timestamp]` - Fixed typo in README
- `[timestamp]` - Improved error message for missing file
- `[timestamp]` - Added better validation for empty inputs

---

*Update this file as you test. Commit after each fix.*
