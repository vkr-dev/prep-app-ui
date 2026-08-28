# prep-app-ui

Angular frontend for the Interview-Prep Question Generator. See [context.md](context.md) for the full project brief. Backend lives in the sibling `prep-app-be` repo.

## Setup

Points `src/environments/environment.development.ts` at the local backend (`http://localhost:8000` by default) - make sure that's running first (see prep-app-be's README). Then:

```bash
npm install
```

## App structure

```
src/app/
  core/
    models/         TypeScript interfaces mirroring the backend's Pydantic schemas
    services/        Auth (login/register/logout, token in localStorage) and Generate (POST /api/generate)
    interceptors/    Bearer token attached to every request; auto-logout on 401
    guards/          Route guard - UX redirect only, real enforcement is server-side
  features/
    login/           Login + register form
    generate/        Topic input, results view (categorized by difficulty + a run summary panel)
```

The generate page's run-summary panel surfaces what the backend's pipeline computed: average LLM-judged relevance (1-5), max pairwise duplicate similarity (flagged if too high), total latency, input/output token counts, and a per-step timing breakdown - all from the `eval`/`metrics` fields on the `GenerateResult` response (see prep-app-be's README for what produces them).

## Status

Day 2: results view now renders the full agent pipeline's output, including eval scores and observability metrics. Deploy (Day 3) is next.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
