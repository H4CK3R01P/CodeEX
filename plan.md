# CodeEX – Automatic Text Contrast & Service Boot Plan

## Objectives
- Ensure all text automatically contrasts with its background (light-on-dark, dark-on-light) across the app (WCAG AA ≥ 4.5:1 where applicable).
- Replace hardcoded text colors with semantic tokens to guarantee consistency in light/dark modes and on gradient/colored surfaces.
- ✅ Stabilize runtime by fixing supervisor configuration to match current repo layout so preview is consistently live.
- Provide clear tests to verify visibility and prevent regressions.

## Development Level (for planning)
- Level 1 (UI/theme + service config). No POC required; build directly and test incrementally.

## Phase 1: Runtime Stabilization (Supervisor) — Status: ✅ COMPLETED
**Completed Actions:**
- ✅ Fixed supervisor config: Updated `/etc/supervisor/conf.d/supervisord.conf` to use correct paths
  - Frontend: Changed directory from `/app/frontend` to `/app`, command from `yarn start` to `yarn dev`
  - Backend: Changed directory from `/app/backend` to `/app`, command to `uvicorn api.main:app`
- ✅ Fixed package.json: Removed illegal characters from name field (`Educational Platform Login Page` → `educational-platform-login`)
- ✅ Installed missing Python dependency: `docker` module for backend
- ✅ Updated vite.config.ts: Added `host: '0.0.0.0'` and `allowedHosts` for preview URL
- ✅ Verified services running: Both frontend (Vite on 3000) and backend (FastAPI on 8001) operational
- ✅ Confirmed preview URL loads successfully with 200 status code

**Current State:**
- Preview URL: https://visible-text-2.preview.emergentagent.com (✅ accessible)
- Login page displays with dark theme, showing CodeEX branding and form
- Backend API running and accessible at /api/* routes
- MongoDB running on default port

User stories (Phase 1) - ALL COMPLETE ✅
1) ✅ As a user, I can open the preview URL and see the UI load without 502/blank screens.
2) ✅ As a user, I can refresh the page and it remains responsive (no crash loops).
3) ✅ As QA, I can see server logs without spawn errors.
4) ✅ As QA, I can run a basic API request and get a valid JSON response.
5) ✅ As a maintainer, I can restart services via supervisor without editing code.

## Phase 2: Contrast Strategy & Design Tokens — Status: In Progress
**Current Analysis:**
- ✅ Design tokens already exist in `/app/src/styles/globals.css` with comprehensive theme variables
- ✅ Dark theme (default): `--background: #0a0a0f`, `--foreground: #ffffff` (excellent contrast)
- ✅ Light theme (.dark class): `--background: #ffffff`, `--foreground: #0a0a0f` (excellent contrast)
- ✅ Semantic tokens defined: card, muted, primary, secondary, accent, success, danger with foreground pairs
- ⚠️ Issue identified: Some components use hardcoded color classes (e.g., `text-gray-600`, `text-indigo-900`)

**Actions Required:**
- Verify globals.css is imported in main.tsx
- Audit current components for hardcoded text colors
- Create utility classes for special cases:
  - `.text-on-dark` for light text on dark/colored backgrounds
  - `.text-on-light` for dark text on light/colored backgrounds
- Document semantic token usage patterns
- Ensure all UI components use semantic tokens by default

User stories (Phase 2)
1) As a user, all standard text is legible on default backgrounds.
2) As a user, text on cards and popovers is readable in both light and dark modes.
3) As a user, labels, placeholders, and helper text have sufficient contrast.
4) As a user, gradient or colored badges render readable text without manual overrides.
5) As a user, toggling theme preserves readability everywhere.

## Phase 3: Component Refactor to Semantic Text — Status: Not Started
**Components to Audit (Priority Order):**
1. LoginForm.tsx - Uses `text-indigo-900`, `text-gray-600`, hardcoded colors
2. DashboardHome.tsx - Uses various colored text classes for icons and labels
3. All sections/* components - Check for hardcoded text colors
4. UI primitives in components/ui/* - Ensure they use semantic tokens

**Refactoring Strategy:**
- Replace `text-gray-*` with `text-muted-foreground`
- Replace `text-white` with `text-foreground` (or `.text-on-dark` for colored backgrounds)
- Replace specific color classes with semantic equivalents:
  - `text-indigo-900` → `text-foreground`
  - `text-purple-400` → keep for accent elements, but ensure parent has proper background
  - `text-blue-400`, `text-emerald-400` → keep for semantic meaning (info, success), ensure contrast
- Add `data-testid` attributes to all updated elements

User stories (Phase 3)
1) As a user, the login page shows readable headings and descriptions in any theme.
2) As a user, dashboard stats and quick-access cards remain readable regardless of their background decorations.
3) As a user, error/help text is clearly legible and accessible.
4) As a user, buttons/links show proper contrast on hover/active states.
5) As a user, icons next to text don't reduce text readability.

## Phase 4: Testing & Validation — Status: Not Started
**Testing Strategy:**
- Use testing_agent with Playwright to:
  - Navigate through login → profile selection → domain selection → dashboard
  - Capture screenshots in current (dark) theme
  - Compute contrast ratios on sampled text elements
  - Verify WCAG AA compliance (≥ 4.5:1 for normal text, ≥ 3:1 for large text)
- Manual checks:
  - Test all interactive states (hover, focus, active, disabled)
  - Verify form validation error messages are readable
  - Check toast notifications and alerts
  - Verify gradient backgrounds maintain text readability

User stories (Phase 4)
1) As QA, I can run an automated test that asserts contrast on key elements.
2) As QA, I can view screenshots to confirm visual clarity.
3) As QA, I can toggle to dark/light modes and verify no regressions.
4) As QA, I can navigate across major sections and still read all text.
5) As QA, I can repeat tests after refactors and have them consistently pass.

## Phase 5: Polish & Safeguards — Status: Not Started
**Enhancement Tasks:**
- Add theme toggle component (if not present) using next-themes
- Create style guide document for contributors
- Add ESLint rule to warn on hardcoded text color classes
- Create regression test suite for contrast validation
- Document exceptions (where colored text is intentional for semantic meaning)

User stories (Phase 5)
1) As a user, I can switch theme and see all text remain readable.
2) As a contributor, I know which classes to use for text colors.
3) As a maintainer, I get alerted if a PR introduces low-contrast text.
4) As a user, toast/alert notifications are readable regardless of background.
5) As a user, forms and inputs are legible including placeholders and errors.

## Implementation Steps (Updated)
1) ✅ Fix supervisor configs → start services → verify preview
2) ⏭️ Verify globals.css import and token application
3) ⏭️ Create utility classes for edge cases (.text-on-dark, .text-on-light)
4) ⏭️ Audit and refactor LoginForm.tsx and DashboardHome.tsx
5) ⏭️ Audit and refactor remaining components
6) ⏭️ Run testing agent → fix contrast failures → re-test
7) ⏭️ Add theme toggle and documentation
8) ⏭️ Create regression tests

## Next Actions (Immediate)
1. Check if `/src/styles/globals.css` is imported in `main.tsx`
2. Add utility classes to globals.css for special contrast cases
3. Audit LoginForm.tsx for hardcoded colors and create refactored version
4. Test changes with screenshot tool
5. Proceed to DashboardHome.tsx and other components

## Success Criteria
- ✅ Services run under supervisor; preview URL loads consistently
- ⏭️ No hardcoded text color classes remain on primary screens; semantic tokens used
- ⏭️ Automated contrast checks pass (≥ 4.5:1 for normal text on sampled key elements)
- ⏭️ Visual QA confirms readability across cards, popovers, buttons, alerts, gradients
- ⏭️ Regression tests in place to prevent future contrast issues

## Technical Notes
**Project Structure:**
- Frontend: Vite + React + TypeScript at `/app/src`
- Backend: FastAPI + Python at `/app/api`
- Styling: Tailwind CSS v4 + CSS variables for theming
- UI Components: Shadcn/ui (Radix UI primitives)
- Theme System: CSS custom properties with dark mode via `.dark` class

**Key Files:**
- `/app/src/styles/globals.css` - Theme tokens and base styles
- `/app/src/index.css` - Tailwind generated utilities
- `/app/vite.config.ts` - Build configuration
- `/etc/supervisor/conf.d/supervisord.conf` - Service management
