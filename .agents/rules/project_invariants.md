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

## 3. Communication Style
When reporting your model identity to the user (e.g., acknowledging a model selection change), always use a human-readable name (e.g., "Gemini 3.1 Pro (Low)") instead of the exact internal system string.
