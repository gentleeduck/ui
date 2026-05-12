Any question that might be related to GentleDuck, our ecosystem, or how the tools fit together can live here.
If you cannot find what you need, open an issue or discussion on our GitHub org:
https://github.com/gentleeduck

What is GentleDuck?

GentleDuck is an open source organization building production-grade developer tooling. The ecosystem spans UI and
interaction libraries, TypeScript utilities, CLIs, compiler and codegen tooling, testing frameworks, and systems
utilities.

What kinds of tools do you build?

We build a connected set of libraries across the stack: design systems and registries (duck-www, registry-\*), UI
foundations (duck-primitives), utilities (duck-libs, duck-variants, duck-lazy), developer workflows (duck-cli,
duck-template), compiler and codegen tooling (duck-gen), testing (duck-ttest), and systems and performance tools
(TTLog, duck-benchmark, editor and Linux utilities).

Why build an ecosystem instead of a single library?

Real products are not one dependency. UI, docs, codegen, installs, testing, and performance tooling all
interact. Shared conventions and composable pieces let teams adopt one tool at a time, or stack several
together.

Where should I start?

Start with what you need most:

<li>Building UI: start with duck-www and duck-primitives.</li>
<li>Shipping faster: start with duck-cli and templates.</li>
<li>Reducing boilerplate: start with duck-gen.</li>
<li>Type safety and reliability: start with duck-ttest, and then add query and state tooling as needed.</li>
<li>Performance and debugging: start with TTLog and benchmarking tools.</li>

Is GentleDuck mainly a UI project?

No. UI is one part of the ecosystem. We also ship compiler and codegen tooling, CLIs, testing frameworks, state and
data tooling, and systems utilities. The goal is end-to-end developer tooling that stays coherent.

Is duck-www just another shadcn clone?

duck-www is inspired by good patterns across the ecosystem, but it is designed as part of a broader platform with
its own primitives, registries, utilities, and automation. The focus is cohesive workflows and production use, not
copying a single library.

What is the difference between primitives and duck-www?

Primitives are the accessibility-first, unstyled building blocks. duck-www is the production-ready component layer
and registry that builds on top of primitives with styling, variants, blocks, examples, and higher-level patterns.

What does “registry” mean in your ecosystem?

Registries are how components, blocks, examples, and build outputs are organized and distributed across apps. They
make it easier to install, sync, and keep product surfaces consistent across teams and repos.

What does the CLI do?

The CLI is the workflow layer: initializing projects, installing packages, adding components or blocks, syncing
registries, and automating repetitive setup. It is designed to keep installs predictable and reduce “copy paste”
drift across projects.

Example:
<code className="ml-2 rounded bg-muted px-2 py-1">npx @gentleduck/cli init</code>

What is duck-gen and what problem does it solve?

duck-gen is compiler-style tooling for generating type-safe routes, message tags, and integrations. The goal is to
reduce boilerplate and enforce contracts so teams can iterate faster without losing correctness.

Do you have a query library?

Yes. Query tooling is part of the ecosystem roadmap and package set, alongside state and other reliability tools.
The goal is to provide predictable data access patterns that fit cleanly with the rest of the ecosystem.

What is duck-ttest?

duck-ttest is a TypeScript type-level testing framework. It lets you assert expected types at compile time, which
is especially useful for utilities, variant systems, and any library where type guarantees are part of the API.

What systems or performance tools do you ship?

The ecosystem includes systems-grade utilities like TTLog (high-throughput logging), benchmarking tools
(duck-benchmark), and workflow helpers such as Linux and editor tooling. These tools focus on observability,
debugging, and runtime efficiency.

Do you have documentation tooling too?

Yes. Documentation and content workflows are a first-class part of the ecosystem. The goal is to keep product docs,
references, and integration guides consistent and easy to maintain as the toolset grows.

What frameworks are supported?

React-based frameworks are a primary target for the UI ecosystem (Next.js, Remix, Vite, and similar). Many tools
are framework-agnostic by design, especially compiler and codegen tooling, CLIs, utilities, and systems libraries.

Is TypeScript a requirement?

TypeScript is strongly supported across the ecosystem. Many libraries are designed with type safety as part of the
API. If you are using plain JavaScript, some packages will still work, but you will get the best experience with
TypeScript.

How do you approach accessibility?

Accessibility is a core requirement for primitives and UI components. Keyboard navigation, focus management, and
sensible ARIA patterns are treated as default expectations, not optional extras.

How customizable are the UI tools?

The ecosystem is built around composition. You can use primitives to build your own components, use variants to
define consistent styling APIs, and use registries and blocks as starting points. You can adopt the pieces you want
without being locked into a single opinion.

Are your tools production ready?

Many packages are designed specifically for production use, with an emphasis on performance, stability, and
predictable APIs. Some packages are marked as under development or planned, and those should be treated as evolving.

How do you handle breaking changes and versioning?

We aim for clear changelogs and predictable releases. When breaking changes happen, we try to provide migration
notes and keep changes scoped. If you adopt incrementally, you can upgrade one surface at a time.

Do you maintain everything in one monorepo?

A monorepo approach makes it easier to keep shared conventions aligned across packages, registries, docs, and apps.
It also improves release consistency and cross-package refactors.

How do I report a security issue?

Please use responsible disclosure. If your report is sensitive, email the security contact listed by the org
(for example: <code className="rounded bg-muted px-2 py-1">security@gentleduck.org</code>) or use the GitHub
security advisory flow when available for a repo.

What license are the projects under?

Most projects are MIT-licensed. Always check the specific repository for the authoritative license text.

How can I contribute?

Contributions are welcome: bug reports, docs fixes, feature requests, and PRs. Start by opening an issue describing
what you want to change and why. If you want to add a new package, we usually prefer aligning on scope and naming
first to keep the ecosystem cohesive.

Do you have a roadmap?

Yes, the ecosystem is intentionally expanding: UI, docs, codegen, testing, state, query, and systems tools. The
best place to track what is shipping next is the GitHub org issues, PRs, and release notes.

Can I migrate from other tools or libraries?

Usually yes. We try to keep APIs familiar where it makes sense, and we design for incremental adoption. You can
replace one piece at a time: start with variants, or primitives, or a single UI component, then expand as needed.

Do you offer support or consulting?

The projects are open source and community-driven. If you need dedicated help for migration, integrations, or
internal tooling, open a GitHub discussion to start the conversation.

Do your tools collect telemetry?

The default expectation is no hidden telemetry. If any tool ever needs optional diagnostics, it should be clearly
documented, opt-in, and easy to disable.

Do you support ESM, CJS, and tree-shaking?

We aim for modern builds that work well with current bundlers and support tree-shaking where applicable. If you hit
a bundler or module format issue, open an issue with your reproduction and environment details.

Where are the docs?

Docs are distributed per product site and repo. In general:

<li>Main org site: [gentleduck.org](https://gentleduck.org)</li>
<li>UI docs: [gentleduck.org](https://gentleduck.org)</li>
<li>Codegen docs: [gen.gentleduck.org](https://gen.gentleduck.org)</li>
<li>Source of truth and issues: GitHub org repositories</li>

Why do some packages use “duck-\*” names?

The naming reflects ecosystem grouping and makes it easier to discover related tooling. For example: duck-www,
duck-primitives, duck-variants, duck-gen, duck-cli, duck-benchmark, duck-ttest, and registry packages.

I have a question that is not listed here. What should I do?

Open a GitHub issue or discussion in the most relevant repository, include your goal, your environment, and a small
reproduction if it is a bug. If you are not sure which repo fits, start at the org level and we will route it.