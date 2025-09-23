---
name: "🐛 Bug Report"
about: Report a reproducible bug in Gentleduck
title: "[BUG] "
labels: bug
assignees: ""
---

## Bug Description
A clear and concise description of the bug.

---

## Steps to Reproduce
Provide a step-by-step guide to reproduce the issue (the smaller the reproduction, the better):

1. Setup project with version `X.Y.Z`
2. Run command `pnpm dev`
3. Use component `Button` with props `{...}`
4. See error

---

## Expected Behavior
What you expected to happen.

---

## Actual Behavior
What actually happened (include exact error messages, console output, or failed network requests).

---

## Screenshots / Recordings
If applicable, add screenshots, GIFs, or a screen recording that demonstrates the issue.

---

## Environment
Please complete the following information:

- **OS:** [e.g. Ubuntu 22.04, Windows 11, macOS Sonoma]
- **Browser & Version:** [e.g. Chrome 118, Firefox 118]
- **Node.js Version:** [e.g. v20.10.0]
- **pnpm Version:** [e.g. 9.0.0]
- **Gentleduck Package(s) & Versions:**  
  - `@gentleduck/ui@X.Y.Z`  
  - `@gentleduck/motion@X.Y.Z`  
  - …  

---

## Project Context
- Framework: [e.g. Next.js 15, Vite 6, CRA]  
- Build Tool: [e.g. Turborepo, Nx, plain pnpm workspaces]  
- Configurations:  
  - Tailwind version & config (if relevant)  
  - Custom webpack/vite settings (if relevant)  

---

## Minimal Reproduction Repo
Please provide a link to a **minimal GitHub repo** or **CodeSandbox/StackBlitz** that reproduces the bug.  
This speeds up fixing by 10x.  

---

## Logs
Paste any relevant logs or error messages (console, server, or build logs):  

```bash
# Example
pnpm dev
Error: Button component failed to render...

