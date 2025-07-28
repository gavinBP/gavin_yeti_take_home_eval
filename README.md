# README

> A monorepo managed through [lerna](https://github.com/lerna/lerna) that houses packages related to the README project.

## Getting Started

### Install node

```bash
nvm install 20.11
```

The `.nvmrc` file in the root of this project should default to node 20.11 if you run `nvm use`.
Confirm that this is the case by running `node --version` on the command line.

### Install pnpm

Follow the [pnpm installation instructions](https://pnpm.io/installation).

### Install dependencies

We use [pnpm workspaces](https://pnpm.io/workspaces), which allows for dependency sharing between packages. This allows us to just do a single install at the root folder.

```bash
pnpm install
```

## Deployments

We use Render to handle deployments.

### Staging Deploy

Staging deploys are started automatically when a commit is merged into the `develop` branch.

### Production Deploy

Production deploys are started automatically when a commit is merged into the `main` branch. Merge with caution!
