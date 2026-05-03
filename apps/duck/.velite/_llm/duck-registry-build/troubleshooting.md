}>

Most failures fall into one of four buckets: config discovery, path resolution,
source discovery, or output/caching expectations.

## Fast triage

Build failed? Check in this order:

1. Was the right config discovered?
2. Are all config-relative paths declared from the config file's point of view?
3. Do the declared registry item types match the source and mapping keys?
4. Did the expected source files actually exist under the declared source root?
5. Is a cache expectation hiding a real content change?

---

## Common symptoms

  
    Config not found
    

Run the CLI from the consumer root or pass `--config` / `--cwd` explicitly.

```bash
registry-build build --config ./apps/docs/registry-build.config.ts
```

If the package is installed in a workspace app, run the script from that app rather
than the repo root.

    
  

  
    Source path does not exist
    

Almost always means the path was written relative to the current working directory
instead of the config file that declared it.

Fix the path in config, not in the caller shell.

    
  

  
    No files found for entry ...
    

Check `sources[type].path`, `entry.root_folder`, `sources[type].glob`, and `sources[type].ignore`.

Also verify whether the source should be `indexStrategy: 'item'` or `indexStrategy: 'file'`.

    
  

  
    Unknown registry item type
    

The registry item type namespace must be declared consistently across
`schema.itemTypes`, `sources`, `targetPaths`, `packageMappings`, and each
`RegistryEntry.type`.

Everything must satisfy ``registry:${string}``.

    
  

  
    TS config file does not load outside Bun
    

Use JSON configs for the most portable runtime path. TS config loading depends on
the runtime's ability to import TS or the loader fallback. For maximum portability,
keep the config declarative and move custom logic into plain JS/JSON-safe shapes.

    
  

  
    Warm builds still rewrite files
    

Usually the generated content is changing, not the cache. Check for unstable
ordering, custom generators with non-deterministic output, timestamps or
environment-specific strings, and changes in rewritten imports or stripped variables.

    
  

  
    changed-only still does more work than expected
    

Make the changed paths more specific. File-indexed sources narrow rebuild work
better than folder-indexed sources. Passing a whole source root still marks many
entries as affected.

    
  

  
    Generated component-index imports point at the wrong package path
    

Check `importMappings.packageMappings` first. If the generated import path still
isn't what you need, provide a custom generator through `componentIndex` or
`componentIndexExtension()`.

    
  

---

## Debug commands

```bash
registry-build build --verbose
registry-build build --json --silent
registry-build build --config ./registry-build.config.ts
```

To compare cache behavior, temporarily disable incremental mode in config and run
once.

---

## Debugging rule

}>

Don't debug by editing generated output. Debug the inputs: config, source files,
mappings, and extensions. Generated outputs are a consequence, not a source of truth.