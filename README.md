# prep-app-ui

Angular frontend for the Learning Tool. Backend lives in the sibling `prep-app-be` repo.

## What it does

Lets a user search any topic and get back a complete study page for it: each subtopic renders as a written explanation first, then a "Practice questions" accordion with recall-then-reveal answers, plus a per-subtopic reviewed checkbox that drives an overall progress bar. For freshly generated topics, a run-summary panel surfaces the backend's own AI-pipeline output live - average LLM-judged relevance score, a duplication-similarity check (flagged if too high), total latency, input/output token counts, and a full per-step timing breakdown of the agent pipeline (retrieve → plan → generate → dedupe → categorize → explain → eval) - so the AI work behind a result is visible, not a black box. The home page lists past searches grouped by an AI-assigned category, so related topics cluster together without any manual tagging.

## Tech stack

- **Framework**: Angular, built entirely on standalone components + signals - no NgModules, no RxJS state management layer. Reactive UI state (accordions, reveal toggles, progress, computed subtopic groupings) is expressed as plain signals and computed values.
- **Styling**: a custom glassmorphism design system, including a hand-built "liquid glass" refraction effect (a real-time backdrop distortion, Chrome-only, with an automatic graceful fallback elsewhere) - not a CSS framework component.
- **HTTP layer**: a single interceptor attaches auth to every request and handles session expiry uniformly; the app distinguishes and surfaces different backend failure modes distinctly in the UI - a rejected/unsafe topic, an LLM provider outage, versus a generic error - rather than one generic "something went wrong."
- **Testing**: Vitest for unit tests.
- **Deployment**: static hosting, calling the `prep-app-be` API over HTTPS.
