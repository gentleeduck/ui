## What You Will Build

This course walks you through building **PhotoDuck** -- a photo sharing app with a full upload
pipeline. You start with a single file upload and finish with a production-grade system using
multipart uploads, resumable transfers, React integration, persistence, and validation.

Upload"]
  end

  subgraph CH2["Chapter 2"]
      direction TB
      C2["Strategies& Backends"]
  end

  subgraph CH3["Chapter 3"]
      direction TB
      C3["ReactIntegration"]
  end

  subgraph CH4["Chapter 4"]
      direction TB
      C4["MultipartUploads"]
  end

  subgraph CH5["Chapter 5"]
      direction TB
      C5["Validation& Rejection"]
  end

  subgraph CH6["Chapter 6"]
      direction TB
      C6["Persistence& Resume"]
  end

  subgraph CH7["Chapter 7"]
      direction TB
      C7["Plugins& Hooks"]
  end

  subgraph CH8["Chapter 8"]
      direction TB
      C8["ProductionReadiness"]
  end

  CH1 --> CH2 --> CH3 --> CH4 --> CH5 --> CH6 --> CH7 --> CH8`}
/>

## Who Is This For

* Developers who are new to @gentleduck/upload and want a structured learning path
* Teams evaluating @gentleduck/upload for file upload needs
* Anyone who learns best by building something real

## Prerequisites

* TypeScript basics (types, interfaces, async/await)
* React basics (components, hooks, context)
* Node.js installed (v18+) or Bun
* Basic knowledge of S3/MinIO is helpful but not required

## How to Follow Along

Each chapter builds on the previous one. Every chapter ends with:

* A **checkpoint** showing the complete code so far
* **FAQ questions** answering common doubts about what you just learned

Estimated time: ~10-15 minutes per chapter.

You can follow along by creating a new project:

Create a new project directory and initialize it:

```sh
mkdir photoduck && cd photoduck
npm init -y
npm install @gentleduck/upload typescript tsx
npx tsc --init
mkdir src
```

You are ready. Start with [Chapter 1: Your First Upload](/duck-upload/course/chapter-1).

## Course Map

| Chapter | Topic | What You Learn |
| --- | --- | --- |
| [1](/duck-upload/course/chapter-1) | Your First Upload | `createUploadClient`, `UploadApi`, `dispatch`, phases, progress events |
| [2](/duck-upload/course/chapter-2) | Strategies & Backends | `PostStrategy`, `createStrategyRegistry`, presigned URLs, strategy architecture |
| [3](/duck-upload/course/chapter-3) | React Integration | `UploadProvider`, `useUploader`, dropzone UI, progress bars |
| [4](/duck-upload/course/chapter-4) | Multipart Uploads | `multipartStrategy`, chunked uploads, `signPart`, `completeMultipart`, concurrency |
| [5](/duck-upload/course/chapter-5) | Validation & Rejection | `UploadValidationRules`, file type/size limits, custom validators, rejection events |
| [6](/duck-upload/course/chapter-6) | Persistence & Resume | `PersistenceAdapter`, cursors, `rebind`, resumable uploads across sessions |
| [7](/duck-upload/course/chapter-7) | Plugins & Hooks | `UploadPlugin`, `UploadHooks`, debugging, metrics, custom extensions |
| [8](/duck-upload/course/chapter-8) | Production Readiness | Retry policies, error normalization, concurrency tuning, fingerprinting, testing |