import { Button } from "@acme/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-background px-8 text-foreground">
      <h1 className="text-3xl font-semibold tracking-tight">Acme Full Stack</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Next.js front-end and NestJS server in one monorepo, styled with the
        shared @acme/ui component library.
      </p>
      <div className="flex gap-3">
        <Button>Get started</Button>
        <Button variant="outline">Documentation</Button>
      </div>
    </main>
  );
}
