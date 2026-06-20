Scan Jira for stories updated since the last docs sync, identify doc-relevant changes, present a suggested update plan for approval, then apply changes on a new branch.

---

## Phase 1: Load last sync state

Read the file `/Users/arthurav/.claude/projects/-Users-arthurav-DevProjects-docs/memory/project_last_jira_sync.md` to get `last_sync_date` and `last_sprint`. If the file does not exist, use `last_sync_date: 2026-06-20` and `last_sprint: 32` as defaults.

---

## Phase 2: Query Jira

Load the Atlassian MCP tool schemas (ToolSearch: `select:mcp__claude_ai_Atlassian__searchJiraIssuesUsingJql,mcp__claude_ai_Atlassian__getAccessibleAtlassianResources`) if not already loaded.

Search Jira using:
- **cloudId:** `7f1fc68a-8904-4f7d-8c50-a308f314171d`
- **JQL:** `project = CORE AND status in ("In Review", "In Test", "Done") AND updated >= "LAST_SYNC_DATE" ORDER BY updated ASC`
  (replace `LAST_SYNC_DATE` with the date read from memory, format `YYYY-MM-DD`)
- **fields:** `summary, description, status, issuetype, labels`
- **maxResults:** 100
- **responseContentFormat:** `markdown`

If the result exceeds context (saved to a file), spawn a subagent to parse the file. Give the subagent this exact instruction:

> Parse the Jira result file at `<path>`. It is JSON with schema `{ issues: { nodes: [...] } }`. For each issue extract: key, summary, status, issuetype, and first 400 chars of description. Filter OUT purely internal issues (infra, CI, ops, monitoring, linter, internal refactor, internal bug with no user-visible effect). Return ALL remaining issues as a structured list with: issue key, type, status, summary, description excerpt, and a one-sentence note on why it may be docs-relevant.

---

## Phase 3: Assess and suggest

Review each returned issue against the existing docs under `docs/` in this repo. For each docs-relevant issue, produce a suggestion with:
- **Issue:** key and summary
- **File(s):** specific file paths under `docs/` that need updating (or "new file needed")
- **Change:** one short paragraph describing exactly what to add, update, or remove

Group suggestions by docs area (e.g. Cloud Providers, Quick Start, Core Concepts, Supported Platforms).

For issues that clearly have no docs impact, list them briefly in a separate "No docs action needed" section so the user can see they were considered.

**Stop here.** Present the full plan and end your message with:

> Review the suggestions above. Reply **approve** to apply all changes, tell me which ones to skip, or give feedback to adjust before proceeding.

---

## Phase 4: Apply changes (only after explicit user approval)

Do not start this phase until the user explicitly approves.

1. Ensure you are on `develop` and it is up to date:
   ```bash
   git checkout develop && git pull origin develop
   ```

2. Create a new branch named with today's date:
   ```bash
   git checkout -b docs-update-YYYY-MM-DD
   ```
   (replace with actual date, e.g. `docs-update-2026-06-20`)

3. Apply each approved change to the relevant docs files. Follow all writing conventions in `CLAUDE.md` exactly (no em/en dashes, colon after bold terms in lists, "to" not "–" for ranges, mandatory `## Connect your account {#credentials}` structure on provider pages, etc.).

4. After all changes are made, update the memory file at `/Users/arthurav/.claude/projects/-Users-arthurav-DevProjects-docs/memory/project_last_jira_sync.md`:
   - Set `last_sync_date` to today's date
   - Set `last_sprint` to the highest sprint number seen in this batch (or the current sprint name)
   - Add a one-line note summarising what was updated

5. Confirm to the user which files were changed and that the branch is ready to push or review.
