# @gentleduck/ui Registry Builder

## Overview

This script builds the @gentleduck/ui Registry**, a centralized collection of components and utilities for the @gentleduck/ui package. It automates the process of compiling and organizing the registry, ensuring consistency and efficiency.

---

## Quick Start

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy the `example.env` to be .env 
   ```bash
   sudo cp example.env .env
   ```

3. Uncommetn the lines in the `index.ts` 

4. Build the registry:
   ```bash
   pnpm run start
   ```

---

## What It Does

- Generates a centralized registry file for easy integration.
- Outputs the registry to the specified directory.

---

## Usage

Run the following command to build the registry:
```bash
pnpm run start
```

---

## Output

The registry will be generated in the `apps/docs/public/registry/` directory with the following structure:
```
 duck-ui
│   ✗ registry           # the main registry.
│ │   colors             # the colros registry.
│ │   ✗ components       # the components and examples registry.
│ │   themes             # the themes registry.
│ │ │  ✗ index.json       # the main registry file.
└ └ └  themes.css         # the themes file.
```

---

## Notes

- This script is designed to work within a monorepo.
- No additional setup is required for @gentleduck/ui; the script handles everything.

Build your registry with ease! 🚀
