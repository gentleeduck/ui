# Security Policy

## Supported Versions

Pre-1.0. Only the latest minor of each `@gentleduck/*` package is
supported. Security fixes go into the latest minor.

## Reporting a Vulnerability

Do not open a public issue for security vulnerabilities.

Email [ahmedayobbusiness@gmail.com](mailto:ahmedayobbusiness@gmail.com)
with:

- a description of the issue
- the affected package and version
  (e.g. `bun pm ls @gentleduck/registry-ui`)
- a minimal reproducer if possible
- your assessment of the impact

We aim to acknowledge within 72 hours and release a fix or mitigation
within 30 days for high severity issues.

## Threat surfaces

`@gentleduck/ui` ships React components, primitives, and a CLI that
runs in dev/build environments. Relevant attack surfaces:

- **CLI (`@gentleduck/cli`)**: writes files, runs package-manager
  install commands, and reads/writes a project config. Run only on
  trusted projects. Audit the registry source before pointing the CLI
  at a custom registry URL.
- **Registry source (`@gentleduck/registry-ui`)**: components are
  source-exported and copied into the user's project. Inspect the
  copied source like any other dependency.
- **DOM injection**: components that accept user-supplied HTML or
  arbitrary children can become XSS surfaces if used without
  sanitisation. Sanitise upstream or via a server-side sanitiser.
- **Build-time artifacts**: `dist/`, `.turbo/`, `.next/` are build
  outputs; do not import from them at runtime.

## Responsible disclosure

We ask researchers to give us 90 days to address issues before public
disclosure. We will credit you in release notes unless you prefer to
remain anonymous.

Thank you for helping keep gentleduck/ui secure.
