# Contributing to gentleduck/ui

First off, thank you for considering contributing to **gentleduck/ui**!
We welcome all kinds of contributions  -  from bug reports and documentation improvements to feature requests and new packages.

This document provides guidelines to help you get started.

---

## Code of Conduct

By participating in this project, you agree to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md).
Please treat everyone with respect and kindness.

---

## 🛠 Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/gentleeduck/gentleduck.git
cd duck-ui
```

### 2. Install Dependencies

We use **Bun** with workspaces:

```bash
bun install
```

### 3. Build All Packages

```bash
bun run build
```

### 4. Run in Development

```bash
bun run dev
```

This will spin up local development environments for the packages and docs.

---

## Working with Packages

* All code lives under the `packages/` directory.
* Each package has its own `package.json` and may depend on other internal packages.
* Use [Turborepo](https://turbo.build/) commands to build, test, and lint efficiently.

---

## Development Workflow

1. **Branching**

   * Create a new branch from `master`.
   * Use a descriptive name, e.g. `fix/button-hover`, `feat/new-dialog`, `docs/readme-update`.

   ```bash
   git checkout -b feat/new-component
   ```

2. **Coding Standards**

   * Use **TypeScript**.
   * Follow existing **Biome** rules.
   * Write clear, self-documenting code.

3. **Commit Messages**
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   Also make sure that you pass the `Husky` checks.

   ```
   feat: add new dropdown menu component
   fix: resolve button focus issue in Safari
   docs: update contributing guide
   ```

4. **Testing**

   * Write unit tests for new functionality.
   * Run all tests before pushing:

     ```bash
     bun run test
     ```

---

## Submitting a Pull Request

1. Push your branch:

   ```bash
   git push origin feat/new-component
   ```

2. Open a Pull Request (PR) against the `master` branch.

3. Fill out the PR template with:

   * A clear description of your changes
   * Any related issues (`Closes #123`)
   * Screenshots or code samples (if UI related)

---

## Reporting Issues

If you find a bug, please [open an issue](https://github.com/gentleeduck/gentleduck/issues) with:

* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots (if applicable)

---

## Ways to Contribute

* **Code**: Bug fixes, features, optimizations
* **Docs**: Tutorials, guides, API references
* **Design**: Improving UX, accessibility, component design
* **Community**: Helping others in discussions, writing blog posts, or sharing gentleduck/ui

---

## Tips

* Start small - even fixing a typo helps!
* Look at the ["good first issue"](https://github.com/gentleeduck/gentleduck/labels/good%20first%20issue) label for beginner-friendly contributions.
* Ask questions! We're happy to guide you.

---

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](./LICENSE).
