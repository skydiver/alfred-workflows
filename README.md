# Alfred Workflows

> A collection of my personally crafted Alfred workflows, designed to streamline productivity and automate everyday tasks with efficiency and precision.

## Available Workflows

| Workflow Name      | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| alfred-pretty-json | An Alfred workflow to format and prettify JSON                   |
| alfred-writewise   | Enhances writing by correcting grammar and refining style        |
| alfred-goodlinks   | Alfred workflow to manage and organize your GoodLinks bookmarks. |

## Development

Requirements: Node >= 24 and pnpm 11 (`corepack enable` picks the pinned
version automatically).

```sh
pnpm install
```

This is a pnpm workspace: each workflow lives under `workflows/<name>` and
shares dependency versions through the `catalog:` in `pnpm-workspace.yaml`.
Linting and formatting are handled by [Biome](https://biomejs.dev) with a
single root `biome.jsonc` — run `pnpm run lint` at the root to check the
whole repo.

### Workflow scripts

Every workflow exposes the same scripts. Run them from its directory
(`cd workflows/<name>`):

| Script          | What it does                                                       |
| --------------- | ------------------------------------------------------------------ |
| `pnpm build`    | Bundle `src/index.ts` into `build/bundle.js` with esbuild          |
| `pnpm dev`      | Run the entry point in watch mode with tsx                         |
| `pnpm run lint` | Check lint and formatting with Biome (`lint:fix` applies fixes)    |
| `pnpm test`     | Run vitest (only where a test suite exists, e.g. alfred-goodlinks) |
| `pnpm run pack` | Build the distributable `.alfredworkflow` (see below)              |

> Use `pnpm run pack` — bare `pnpm pack` invokes pnpm's own tarball command
> instead of the project script.

### Packaging

`pnpm run pack` produces `dist/<name>.alfredworkflow`, ready to import into
Alfred. It chains four steps:

1. `build` — bundle the TypeScript entry point with esbuild
2. `scripts/update-version.ts` — copy the `version` from the workflow's
   `package.json` into `assets/info.plist`
3. `scripts/pack.ts` — zip `assets/icon.png`, `assets/info.plist`, and
   `build/bundle.js` into the `.alfredworkflow` archive
4. `clean` — remove the intermediate `build/` directory

To release a new version: bump `version` in the workflow's `package.json`,
run `pnpm run pack`, and import the artifact from `dist/`.
