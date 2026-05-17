# Security Policy

## Supported Versions

We provide security updates for the latest major release of `@gentleduck/iam`.
Older versions may not receive patches.

| Version | Supported |
| ------- | --------- |
| 2.x     | Yes       |
| 1.x     | No        |

## Reporting a Vulnerability

`@gentleduck/iam` is an authorization engine. Vulnerabilities in an
authorization library can result in privilege escalation, data exposure,
or bypassed access controls in any application using it. Please treat
security reports with the seriousness they deserve.

> [!WARNING]
> **Do not disclose security issues publicly.**
> Do not open a GitHub issue, PR, or discussion describing a vulnerability.

If you discover a vulnerability in `@gentleduck/iam`:

1. Report it privately by emailing **security@gentleduck.org**.
2. Include:
   - A detailed description of the vulnerability.
   - Steps to reproduce, ideally with a minimal repro.
   - The affected version(s).
   - Any known impact (privilege escalation, denial of service, ReDoS, etc.).
   - Suggested fix, if you have one.
3. We will confirm receipt within **48 hours** and provide a timeline for a fix.

## Responsible Disclosure

We ask security researchers to give us **90 days** to address issues before
public disclosure. We will credit you in the release notes unless you prefer
to remain anonymous.

## Scope

In scope:

- The `@gentleduck/iam` core evaluation engine.
- All shipped adapters: Memory, File, Prisma, Drizzle, Redis, HTTP.
- All shipped server middleware: Express, NestJS, Hono, Next.js, generic.
- All shipped client integrations: React, Vue, Vanilla.
- The condition operators and dollar-path resolution.
- The `explain()` trace builder.

Out of scope:

- Vulnerabilities in third-party dependencies (please report upstream first).
- Issues that require an attacker to already control the policy store or
  role definitions (those are by-design trusted inputs).
- Social-engineering or physical attacks against contributors.

## What We Care About Most

Pay extra attention to:

- **Authorization bypasses**: a request that should be denied returning allow.
- **Privilege escalation**: a user gaining permissions they were not granted.
- **Dollar-path injection**: malformed `$path` references leaking data across
  the request boundary.
- **Prototype pollution**: condition field paths reaching `__proto__`,
  `constructor`, or `prototype`.
- **ReDoS**: regex patterns in the `matches` operator causing pathological
  backtracking.
- **Cache poisoning**: a stale or attacker-controlled value persisting in the
  LRU cache after invalidation should have run.
- **Multi-tenant scope leaks**: a permission granted in one scope leaking into
  another scope.

Thank you for helping keep `@gentleduck/iam` and the wider gentleduck ecosystem
secure.
