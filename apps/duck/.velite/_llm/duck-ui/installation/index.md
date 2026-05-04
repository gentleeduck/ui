## Pick Your Framework

Select your framework and follow the instructions to install dependencies and structure the app. @gentleduck/ui works with every React framework below.

## TypeScript

This project and its components are written in TypeScript. TypeScript is recommended.

JavaScript projects are supported. Use the same components without types.
See the [CLI page](/duck-cli) for setup and component add commands.

For import aliases, use `jsconfig.json`:

```json {4} title="jsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```