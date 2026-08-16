---
name: Breakthrough Administration Project Invariants
description: Mandatory rules for workspace synchronization, git workflow, and communication.
always_on: true
---

# Project Invariants & Workflows

## 1. Multi-Workspace Synchronization
You must always keep the following three directories synchronized. Whenever you make code changes in the primary directory, you must run a command to mirror those changes to the other two:
- **Primary**: `C:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration-main\`
- **Mirror 1**: `C:\Users\shiva\OneDrive\Desktop\Breakthrough-Administration--main\Breakthrough-Administration--main\`
- **Mirror 2**: `C:\Users\shiva\Documents\antigravity\Breakthrough-Administration\`

## 2. Mandatory GitHub Push
When you finish a task or complete an implementation phase, you MUST unconditionally stage, commit, and push all changes to the remote repository (`origin main`) using git. Ensure the git status is clean before concluding your work.

### Commit Message Format
Use Conventional Commits format: `feat(scope): concise description of what was built`
- `feat` for new features, `fix` for bug fixes, `refactor` for restructuring
- `scope` should identify the module or feature area (e.g., `bsp-auditor`, `guided-tour`, `fhir`)
- Description should be specific and meaningful, not generic

### Workspace Sync Before Push
Always run the 3-directory mirror sync BEFORE staging and committing, so all workspaces are consistent at the point of the commit.

## 3. Communication Style
When reporting your model identity to the user (e.g., acknowledging a model selection change), always use a human-readable name (e.g., "Gemini 3.1 Pro (Low)") instead of the exact internal system string.

## 4. Teamwork Multi-Agent Delegation Workflow
When the user invokes `/teamwork-preview` (with or without `/grill-me`):
1. **Design Interview**: Walk through the 9-step grill-me process to align on requirements, scope, integrity mode, and acceptance criteria.
2. **Prompt Draft**: Maintain a `prompt_draft.md` artifact throughout the design process, updating it after each step.
3. **User Approval**: Present the finalized prompt and wait for explicit user approval before delegation.
4. **Delegation**: Invoke the `teamwork_preview` subagent with the full prompt text (not a file path reference).
5. **Monitoring**: Receive progress updates reactively (no polling). Report milestone completions to the user.
6. **Post-Victory**: Upon `VICTORY CONFIRMED` from the independent auditor:
   a. Clean up any build artifacts (dist-test, dist-tests, tsconfig.tsbuildinfo)
   b. Run 3-directory workspace mirroring
   c. Stage, commit (conventional format), and push to `origin main`
   d. Update `walkthrough.md` with the new capabilities
