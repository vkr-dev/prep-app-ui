# prep-app-ui

Angular frontend for the Learning Tool - an interview-prep question generator. Backend lives in the sibling `prep-app-be` repo.

## What it does

Lets a user search a topic and get back a one-stop-shop study page: subtopics each with reading content followed by practice Q&A (recall-then-reveal answers), a progress checkbox per subtopic, and a run-summary panel showing eval/quality metrics. Also includes login/guest-registration, a per-user search history grouped by AI-assigned category, and an owner-only admin page for approving/revoking guest accounts.

## Tech stack

- **Framework**: Angular (standalone components, signals)
- **Styling**: glassmorphism UI with a custom liquid-glass refraction effect
- **Testing**: Vitest
- **Deployment**: static hosting, talks to the `prep-app-be` API
