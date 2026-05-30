# Security Policy

## Supported Versions
We provide security updates for the latest major release of gentleduck/ui.  
Older versions may not receive patches.

## Reporting a Vulnerability
⚠️ **Please do not disclose security issues publicly.**  
If you discover a vulnerability in gentleduck/ui:

1. Report it privately by emailing: **security@gentleduck.org**
2. Include a detailed description of the vulnerability and how to reproduce it.
3. We will confirm receipt within **48 hours** and provide a timeline for a fix.

## Responsible Disclosure
We ask security researchers to give us **90 days** to address issues before public disclosure.  
We will credit you in release notes unless you prefer to remain anonymous.

Thank you for helping keep gentleduck/ui secure.

## Trust Model for `registry-build`

`registry-build` is a build tool that **executes the project's `registry-build.config.{ts,js,mjs,cjs,mts,cts}` file via dynamic `import()` / `jiti`**. This is standard behavior for config-driven JS/TS build tools (Vite, Rollup, Tsdown, Vitest all work the same way), but it is worth stating explicitly:

- **Do not run `registry-build` in a directory containing config files you do not trust.** The config discovery walks up the directory tree looking for `registry-build.config.*`; running the CLI in a hostile checkout can execute attacker-controlled code at build time.
- The CLI **validates every user-authored field through Zod schemas** before joining them into output paths or generating TSX index files. Entry names, root folders, file paths, and theme names are restricted to a safe character set and reject `..` traversal, absolute paths, and shell metacharacters.
- All generated JS source literals are produced via `JSON.stringify`, so a hostile `description` or `name` cannot break out of a string literal and inject executable code into the consumer's bundle.

If you need to build against untrusted configuration, run `registry-build` inside a sandbox (container, VM, ephemeral CI worker) and treat the resulting build output as untrusted until reviewed.
