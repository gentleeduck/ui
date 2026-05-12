## Course overview

Each chapter builds on the previous one. Follow them in order.

By the end you can:

* Understand why type-safe API contracts matter.
* Set up a NestJS project with Duck Gen from scratch.
* Generate typed route maps and message registries automatically.
* Consume generated types with Duck Query on the client.
* Add i18n support using typed message keys.
* Run Duck Gen in CI/CD pipelines for continuous type safety.

## Who this is for

Developers who:

* Are new to Duck Gen and want a structured path.
* Know basic TypeScript but haven't worked with code generation.
* Want the "why" before the "how".

} title="Prerequisites">
  You should be comfortable with TypeScript and have a basic understanding of REST APIs.
  Experience with NestJS is helpful but not required. Each chapter explains what you need
  to know as you go.

## Course chapters

| Chapter | Title | What you will learn |
| --- | --- | --- |
| 1 | [The Problem](/duck-gen/course/the-problem) | Why manual type syncing breaks and how Duck Gen fixes it. |
| 2 | [Project Setup](/duck-gen/course/project-setup) | Create a NestJS project and install Duck Gen. |
| 3 | [Your First Controller](/duck-gen/course/first-controller) | Build a simple controller and understand decorators. |
| 4 | [Generating Types](/duck-gen/course/generating-types) | Run Duck Gen for the first time and explore the output. |
| 5 | [Using Generated Types](/duck-gen/course/using-generated-types) | Import and use RouteReq, RouteRes, and ApiRoutes on the client. |
| 6 | [Message Keys](/duck-gen/course/message-keys) | Add typed i18n message registries with @duckgen tags. |
| 7 | [Duck Query Client](/duck-gen/course/duck-query-client) | Set up Duck Query for type-safe HTTP requests. |
| 8 | [Real World Patterns](/duck-gen/course/real-world-patterns) | Error handling, interceptors, CI/CD, and production tips. |

## How long does it take?

Each chapter takes 10-15 minutes. Read it in one sitting or spread across sessions.

} title="Already familiar with the basics?">
  If you already know what Duck Gen does and just want the reference docs, skip to the
  [Duck Gen overview](/duck-gen) or [Configuration](/duck-gen/configuration).