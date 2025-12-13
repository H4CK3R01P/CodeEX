# CodeEX – Automatic Text Contrast & Service Boot Plan

## Objectives
- Ensure all text automatically contrasts with its background (light-on-dark, dark-on-light) across the app (WCAG AA ≥ 4.5:1 where applicable).
- Replace hardcoded text colors with semantic tokens to guarantee consistency in light/dark modes and on gradient/colored surfaces.
- Stabilize runtime by fixing supervisor configuration to match current repo layout so preview is consistently live.
- Provide clear tests to verify visibility and prevent regressions.

## Development Level (for planning)
- Level 1 (UI/theme + service config). No POC required; build directly and test incrementally.

## Phase 1: Runtime Stabilization (Supervisor) — Status: In Progress
- Identify supervisor program configs pointing to non-existent /app/frontend and /app/backend.
- Update frontend program: cwd /app; command uses package.json script (yarn dev or yarn preview/build+serve) aligned with Vite/CRA present in repo; ensure bind 0.0.0.0:3000.
- Update backend program: cwd /app; command to run FastAPI at /app/api/main.py app on 0.0.0.0:8001.
- Reload supervisor, verify logs; ensure preview URL serves UI and /api routes work.
- Add a quick health check curl to confirm both processes are up.

User stories (Phase 1)
1) As a user, I can open the preview URL and see the UI load without 502/blank screens.
2) As a user, I can refresh the page and it remains responsive (no crash loops).
3) As QA, I can see server logs without spawn errors.
4) As QA, I can run a basic API request and get a valid JSON response.
5) As a maintainer, I can restart services via supervisor without editing code.

## Phase 2: Contrast Strategy & Design Tokens — Status: Not Started
- Import and enforce design tokens: ensure /src/styles/globals.css is loaded (in main.tsx) so CSS variables exist.
- Define/confirm semantic palette: --background, --foreground, --muted, --card, etc. Validate both light and dark.
- Add an auto-contrast utility approach:
  - Primary: enforce semantic text tokens by default (body, headings, labels) via base layer so text follows var(--foreground).
  - Secondary: create an optional data-auto-contrast utility that sets text to light/dark for decorated surfaces (e.g., gradients, colored chips) where semantic foreground doesn't apply.
  - Create helper class names: .on-dark (color: #fff), .on-light (color: #0a0a0f) to use on accent blocks if needed.
- Update tokens for high contrast: ensure muted-foreground and card-foreground meet WCAG on their surfaces.
- Ensure all Shadcn primitives default to text-foreground and expose a variant for muted.

User stories (Phase 2)
1) As a user, all standard text is legible on default backgrounds.
2) As a user, text on cards and popovers is readable in both light and dark modes.
3) As a user, labels, placeholders, and helper text have sufficient contrast.
4) As a user, gradient or colored badges render readable text without manual overrides.
5) As a user, toggling theme preserves readability everywhere.

## Phase 3: Component Refactor to Semantic Text — Status: Not Started
- Replace hardcoded color classes (e.g., text-gray-600, text-indigo-900, text-white) with semantic classes:
  - text-foreground for base text
  - text-muted-foreground for secondary text
  - on gradient/colored surfaces, use .on-dark/.on-light or data-auto-contrast
- Audit and update: LoginForm.tsx, DashboardHome.tsx, sections/*, shared UI primitives.
- Ensure icons follow the same semantic scheme (e.g., icon colors inherit unless accent required).
- Add data-testid on updated elements for reliable testing.

User stories (Phase 3)
1) As a user, the login page shows readable headings and descriptions in any theme.
2) As a user, dashboard stats and quick-access cards remain readable regardless of their background decorations.
3) As a user, error/help text is clearly legible and accessible.
4) As a user, buttons/links show proper contrast on hover/active states.
5) As a user, icons next to text don’t reduce text readability.

## Phase 4: Testing & Validation — Status: Not Started
- Automated: Use testing agent (Playwright) to visit login and dashboard, capture screenshots, and compute contrast on sampled nodes (via page.evaluate luminance calc).
- Manual: Visual scan in both themes; check assorted surfaces (card, popover, gradient blocks, alerts, buttons).
- Add a small in-app debug toggle (dev-only) to outline elements failing contrast (optional, if time allows).
- Fix failing spots iteratively until tests pass.

User stories (Phase 4)
1) As QA, I can run an automated test that asserts contrast on key elements.
2) As QA, I can view screenshots to confirm visual clarity.
3) As QA, I can toggle to dark/light modes and verify no regressions.
4) As QA, I can navigate across major sections and still read all text.
5) As QA, I can repeat tests after refactors and have them consistently pass.

## Phase 5: Polish & Safeguards — Status: Not Started
- Add a theme toggle (if missing) and ensure transitions don’t harm readability.
- Document style guidelines for contributors (use semantic tokens, avoid hardcoded text colors).
- Add lint rule or grep check for prohibited text color classes.
- Create a regression test that blocks merge when contrast checks fail on sampled pages.

User stories (Phase 5)
1) As a user, I can switch theme and see all text remain readable.
2) As a contributor, I know which classes to use for text colors.
3) As a maintainer, I get alerted if a PR introduces low-contrast text.
4) As a user, toast/alert notifications are readable regardless of background.
5) As a user, forms and inputs are legible including placeholders and errors.

## Implementation Steps (Condensed)
1) Fix supervisor configs → start services → verify preview.
2) Ensure globals.css is imported → verify tokens applied.
3) Add data-auto-contrast utilities and .on-light/.on-dark helpers.
4) Refactor components to semantic text tokens (remove hardcoded text colors).
5) Run testing agent → fix contrast failures → re-test.

## Next Actions (Immediate)
- Update supervisor program configs to point to /app and correct commands; restart; verify.
- Import /src/styles/globals.css in main.tsx if not already; rebuild; verify tokens.
- Sweep for hardcoded text colors and replace with semantic tokens in LoginForm and DashboardHome first (POC refs on primary screens).
- Add automated contrast test (testing agent) and iterate fixes.

## Success Criteria
- Services run under supervisor; preview URL loads consistently.
- No hardcoded text color classes remain on primary screens; semantic tokens used.
- Automated contrast checks pass (≥ 4.5:1 for normal text on sampled key elements in both themes).
- Visual QA confirms readability across cards, popovers, buttons, alerts, gradients.
- Regression tests in place to prevent future contrast issues.
