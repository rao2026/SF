**Add your own guidelines here**
<!--
# Figma Make – Engineering Handoff Guidelines

These guidelines ensure designs generated from Figma produce code that is structured, scalable, maintainable, testable, and supports a clean mock mode with pluggable APIs. Share this with designers in Figma Make so components and tokens align with our implementation.

## Design System
- **Tokens:** Define and use global styles for color, typography, spacing, radius, shadows, z-index, breakpoints. Name semantically (e.g., `color/bg-primary`, `font/heading-lg`, `space/4`, `radius/md`, `bp/md`).
- **Components:** Follow atomic design (atoms, molecules, organisms). Use clear, stable names (e.g., `Button/Primary`, `Card/WithHeader`). Avoid visual-only labels.
- **Variants:** Model state/size/intent as variants (`size`, `state`, `intent`, `loading`, `disabled`) instead of separate frames. Variants must map to code props 1:1.
- **Layout:** Use Auto Layout and proper constraints for responsiveness. Avoid absolute positioning for primary flows. Publish container width guidelines for common breakpoints.

## Component Contracts (in Figma component description)
- **Props:** List props with types and required vs optional (e.g., `title: string (required)`, `subtitle?: string`).
- **Data Shape:** Provide a small JSON example for data-driven widgets (lists/cards/charts). Document key meanings and constraints.
- **Events:** Describe interaction events semantically (`onSubmit`, `onRemove`, `onSelect`) instead of “clicked.”
- **Accessibility:** Include role, ARIA labels, keyboard interactions, focus behavior, and contrast requirements.
- **Testing:** Specify `data-testid` naming conventions (e.g., `button.submit`, `card.study-summary`). Document minimal render props and edge cases.

## Mock Mode & API Abstraction
- **Mock-first:** Every data-driven component must include default mock data (in the description) matching the real schema.
- **Single Injection Point:** Code selects APIs via `src/config/api.ts` and `src/config/featureFlags.ts`. Designers should not require inline fetching in components.
- **No Inline Fetching:** Generated components are pure UI and controlled via props. Containers (views) own data orchestration, routing, and async state.
- **Placeholders/Flags:** Use `USE_MOCKS` and other flags (e.g., `ENABLE_SSE`, `ENABLE_CACHE`) to switch behavior in the config layer only.

## Views vs. UI Components
- **Views (containers):** `LandingView`, `DashboardView`, `GoldenSiteProfileView` manage data loading, progress, and navigation. They call `api.*` methods and pass data into UI components.
- **UI Components:** Keep `src/components/ui/*` stateless and controlled. No side effects, timers, or network calls.
- **Async Status:** Standardize async status as `{ status: 'idle'|'loading'|'success'|'error', progress?: number, error?: string }` and design loading/skeleton/error variants.

## Performance & Responsiveness
- **Grid & Auto Layout:** Ensure list/card patterns are responsive without layout shifts. Provide skeleton variants for loading states.
- **Breakpoints:** Publish tokenized breakpoints and container max widths. Ensure typography scales appropriately.

## Assets & Icons
- **SVG Icons:** Use consistent `viewBox`, stroke settings, and semantic names. Avoid embedded text. Prefer tree-shakable icon sets.
- **Images:** Name assets deterministically and specify required sizes (`@1x`, `@2x`, `@3x`).

## Versioning & Handoff
- **Stable IDs/Names:** Keep stable Figma component names mapped to code paths (e.g., `figma: Button/Primary -> src/components/ui/button.tsx`).
- **Release Notes:** With each Figma update, include a change log: added/changed/removed components, token updates, schema changes.

## API Contract (for engineers – referenced by designers)
- **Files:**
  - `src/config/featureFlags.ts` – global flags (`USE_MOCKS`, `ENABLE_SSE`, etc.).
  - `src/config/api.ts` – `ApiClient` interface and selection: `export const api = USE_MOCKS ? mockClient : realClient`.
  - `src/services/*` – implementations for `mockClient` and `realClient` using typed responses.
- **Interfaces:** Centralize types in `src/types/index.ts` and align Figma JSON examples with these types.

### Suggested API Interfaces
```ts
export interface UploadApi {
  upload(payload: { protocolDoc: File; feasibilityDoc: File }): Promise<{ uploadId: string; protocolDocMeta: any; feasibilityDocMeta: any }>;
  progress(uploadId: string): Promise<{ protocolProgress: number; feasibilityProgress: number; status: 'pending'|'processing'|'complete'|'error' }>;
}

export interface ProcessApi {
  start(uploadId: string): Promise<{ jobId: string }>;
  status(jobId: string): Promise<{ status: 'queued'|'running'|'complete'|'error'; progress?: number }>;
  result(jobId: string): Promise<ProcessingProtocolSet>;
  list(): Promise<ProcessingProtocolSet[]>;
}

export interface StudiesApi {
  profile(setId: string): Promise<ProtocolInput>;
}

export interface FeedbackApi {
  submit(data: { name: string; email: string; message: string; context?: any }): Promise<{ id: string; status: 'received'|'error' }>;
}

export interface ApiClient {
  uploads: UploadApi;
  process: ProcessApi;
  studies: StudiesApi;
  feedback: FeedbackApi;
}
```

## Container Wiring Examples (design intent → code behavior)
- **LandingView:**
  - On file select: call `api.uploads.upload`, then `api.process.start(uploadId)`, then poll/SSE `status`/`progress` and update view state.
  - On completion: enable “View Profiles” and navigate with fetched `ProtocolInput`.
- **DashboardView:**
  - On mount: call `api.process.list()`; show empty state when `[]`.
  - On “View Profile”: call `api.studies.profile(setId)`.
- **GoldenSiteProfileView:**
  - Receives `ProtocolInput` via props; no fetching inside.

## Accessibility Requirements
- **Semantics:** Map to proper HTML roles (`button`, `nav`, `header`, `dialog`, `table`).
- **Keyboard:** Define tab order, Enter/Space activation, Escape for dialogs, arrow keys for lists/menus.
- **Focus:** Include focus-visible styles in variants; meet contrast ratios.

## Testing Requirements
- **data-testid:** Provide deterministic IDs for interactive elements and key containers.
- **State Coverage:** Provide mock examples for default, loading, success, empty, and error states.

## What Designers Should Include Per Component
- Prop list with types and required/optional.
- Variant list and mapping to props.
- JSON data example that matches `src/types`.
- Event names and semantics.
- Accessibility notes (roles/labels/keyboard/focus).
- Testing hooks (`data-testid`) and minimal render instructions.

---

By following these guidelines, the generated codebase remains pure-UI at the component level, with pluggable APIs and a robust mock mode controlled via configuration, enabling smooth transitions from design-time mocks to production backends without refactors.
-->
