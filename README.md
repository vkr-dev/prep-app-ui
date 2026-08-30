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
    services/        Auth, Generate (POST /api/generate), SearchHistory (GET /api/search-history), Progress (GET/POST /api/progress)
    interceptors/    Bearer token attached to every request; auto-logout on 401
    guards/          Route guard - UX redirect only, real enforcement is server-side
  shared/
    liquid-glass.directive.ts   applies public/liquid-glass.js's refraction effect to an element
  features/
    search/          Home page - topic search (max 50 words) + past-searches grouped by AI-assigned category
    login/           Login + register form
    generate/        One-stop-shop view for a topic passed via ?topic= query param: subtopic accordions, recall-then-reveal answers, a per-subtopic reviewed checkbox, and a progress bar
```

Routing: `/` is the search/home page (protected), `/generate?topic=X` runs and shows results for that topic, `/login` is unauthenticated. Submitting the search bar or clicking a past-search button both just navigate to `/generate?topic=...` - the Generate component reads the query param on init and runs immediately, no separate "submit" step on that page.

The generate page is a one-stop-shop per subtopic: full reading content first (an always-visible card, not collapsed), then a "Practice questions" accordion scoped only to that subtopic's Q&A - the two are deliberately separate, so reading and self-testing aren't conflated into one collapsed blob. Questions group by subtopic (`Question.category`), not by difficulty, so nothing about a topic is fragmented across separate buckets. Each question's answer stays hidden behind a "Recollect, then reveal" toggle so you can actually try to answer before checking. Reading content comes from `GenerateResult.subtopic_content` (populated today only for curated topics - see prep-app-be's README on `scripts/seed_curated_topics.py`; the LLM pipeline doesn't generate it yet, so the reading card simply doesn't render for those subtopics). Checking "I've reviewed this subtopic" persists to the backend (`Progress` service) and moves the top progress bar; unchecking moves it back. A `curated: true` result shows a distinct "human-curated" badge instead of the usual cache/run-summary panel copy, so it's always clear when content never touched an LLM at all.

The run-summary panel (for LLM-generated topics) surfaces what the backend's pipeline computed: average LLM-judged relevance (1-5), max pairwise duplicate similarity (flagged if too high), total latency, input/output token counts, and a per-step timing breakdown - all from the `eval`/`metrics` fields on the `GenerateResult` response.

## Status

Day 3 (deploy) is live. Since then: a warm brown-gradient glassmorphism redesign (including a real Chrome-only liquid-glass refraction effect with automatic Safari/Firefox fallback), and a dedicated search/home page with AI-categorized, DB-persisted per-user search history.

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
