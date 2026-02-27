# @gentleduck/ui Registry Builder

## Overview

This script builds the @gentleduck/ui Registry, a centralized collection of components and utilities for the @gentleduck/ui package. It automates the process of compiling and organizing the registry, ensuring consistency and efficiency.

---

## Quick Start

1. Install dependencies:
   ```bash
   bun install
   ```

2. Copy the `example.env` to be .env
   ```bash
   sudo cp example.env .env
   ```

3. Uncomment the lines in the `index.ts`

4. Build the registry:
   ```bash
   bun run start
   ```

---

## What It Does

- Generates a centralized registry file for easy integration.
- Outputs the registry to the specified directory.

---

## Usage

Run the following command to build the registry:
```bash
bun run start
```

---

## Output

The registry will be generated in the `apps/duck-ui-docs/public/r/` directory with the following structure:
```
apps/duck-ui-docs/public/r/
  colors/             # the colors registry
  components/         # the components and examples registry
  themes/             # the themes registry
  index.json          # the main registry file
  themes.css          # the themes file
```

---

## Notes

- This script is designed to work within a monorepo.
- No additional setup is required for @gentleduck/ui; the script handles everything.
